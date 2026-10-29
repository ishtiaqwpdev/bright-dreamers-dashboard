<?php
/**
 * Printable portfolio book (used for "Print / Save as PDF").
 *
 * The book is built here on the server from the saved portfolio, so the server decides
 * what goes into the PDF. When "Show my child's photo on the private portfolio cover"
 * is OFF, the child's photo is never written into this page (and so never into the PDF):
 * a neutral placeholder avatar is used instead.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BDD_Book {

	private static $months = array( 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' );
	private static $types  = array(
		'activity'    => array( 'Activity', 'activities' ),
		'skill'       => array( 'Skill', 'skills' ),
		'achievement' => array( 'Achievement', 'achievements' ),
		'project'     => array( 'Project', 'projects' ),
		'certificate' => array( 'Certificate', 'achievements' ),
		'goal'        => array( 'Goal', 'goals' ),
	);
	private static $imgs = null;

	/**
	 * Build the book HTML for a parent's portfolio.
	 *
	 * @param int    $user_id Parent whose portfolio is printed.
	 * @param string $paper   'a4' or 'letter'.
	 * @return string Full HTML document.
	 */
	public static function html( $user_id, $paper = 'a4' ) {
		$state   = bdd_get_state( $user_id );
		$state   = is_array( $state ) ? $state : array( 'profile' => array(), 'entries' => array() );
		$profile = isset( $state['profile'] ) && is_array( $state['profile'] ) ? $state['profile'] : array();
		$entries = isset( $state['entries'] ) && is_array( $state['entries'] ) ? array_values( array_filter( $state['entries'], 'is_array' ) ) : array();
		$book    = isset( $state['book'] ) && is_array( $state['book'] ) ? $state['book'] : array();
		$on      = function ( $k ) use ( $book ) {
			return ! isset( $book[ $k ] ) || false !== $book[ $k ];
		};
		$p = function ( $k ) use ( $profile ) {
			return isset( $profile[ $k ] ) ? (string) $profile[ $k ] : '';
		};

		$name = esc_html( $p( 'name' ) );

		// Server-side rule: the child's photo is only used when the parent allows it.
		$face = bdd_show_photo_on_cover( $user_id ) ? self::src( $p( 'photo' ) ) : bdd_cover_avatar( $p( 'name' ) );

		$pages = array();
		$n     = 0;
		$page  = function ( $title, $icon, $body ) use ( &$pages, &$n, $name ) {
			$n++;
			$pages[] = '<article class="page" aria-label="Page ' . $n . ': ' . esc_attr( $title ) . '"><h2>' . ( $icon ? '<img src="' . esc_attr( self::img( $icon ) ) . '" alt="">' : '' ) . esc_html( $title ) . '</h2>' . $body . '<div class="page__foot"><span>Bright Dreamers Portfolio | ' . $name . '</span><span>Page ' . $n . '</span></div></article>';
		};
		$items = function ( $list, $meta ) {
			$out = '';
			foreach ( array_slice( $list, 0, 4 ) as $e ) {
				$desc = isset( $e['description'] ) && '' !== $e['description'] ? $e['description'] : ( isset( $e['why'] ) ? $e['why'] : '' );
				$out .= '<div class="pg-item"><img src="' . esc_attr( self::photo( $e ) ) . '" alt=""><div><strong>' . esc_html( self::v( $e, 'title' ) ) . '</strong><small class="muted">' . $meta( $e ) . '</small><p>' . esc_html( self::cut( (string) $desc, 140 ) ) . '</p></div></div>';
			}
			return '' !== $out ? $out : '<p class="muted">Nothing added yet.</p>';
		};

		if ( $on( 'cover' ) ) {
			$n++;
			$pages[] = '<article class="page page--cover" aria-label="Page 1: Cover"><img class="logo" src="' . esc_attr( self::img( 'logo' ) ) . '" alt="Bright Dreamers"><h1>My Bright Future <span>Portfolio</span></h1><img class="face" src="' . esc_attr( $face ) . '" alt=""><span class="name">' . $name . '</span><strong>Age ' . esc_html( $p( 'age' ) ) . '</strong><q style="font-style:italic;color:var(--muted)">' . esc_html( $p( 'quote' ) ) . '</q></article>';
		}
		if ( $on( 'about' ) ) {
			$page( 'About Me', 'profile', '<div class="pg-item"><img src="' . esc_attr( $face ) . '" alt="" style="width:34%"><div><p><b>Name:</b> ' . $name . '<br><b>Age:</b> ' . esc_html( $p( 'age' ) ) . '<br><b>Location:</b> ' . esc_html( $p( 'location' ) ) . '<br><b>My Interests:</b> ' . esc_html( $p( 'interests' ) ) . '</p></div></div><h3 style="font-size:1.3em">A Little Bit About Me</h3><p>' . esc_html( $p( 'about' ) ) . '</p><div style="background:var(--pink-soft);border-radius:.8em;padding:1em"><strong style="color:var(--pink)">&hearts; My Dream</strong><p style="margin:.3em 0 0">&ldquo;' . esc_html( $p( 'dream' ) ) . '&rdquo;</p></div>' );
		}
		if ( $on( 'skills' ) ) {
			$html = '';
			foreach ( array_slice( self::of_type( $entries, array( 'skill' ) ), 0, 9 ) as $s ) {
				$html .= '<div><img src="' . esc_attr( self::photo( $s ) ) . '" alt=""><strong>' . esc_html( self::v( $s, 'title' ) ) . '</strong><small>' . esc_html( self::v( $s, 'description' ) ) . '</small></div>';
			}
			$page( 'My Skills', 'skills', '<div class="pg-skills">' . $html . '</div>' );
		}
		if ( $on( 'activities' ) ) {
			$page(
				'My Activities & Experiences',
				'activities',
				$items(
					self::by_date( self::of_type( $entries, array( 'activity' ) ) ),
					function ( $e ) {
						return ( '' !== self::v( $e, 'org' ) ? esc_html( self::v( $e, 'org' ) ) . ' · ' : '' ) . self::range( $e );
					}
				)
			);
		}
		if ( $on( 'achievements' ) ) {
			$page(
				'My Achievements',
				'achievements',
				$items(
					self::by_date( self::of_type( $entries, array( 'achievement', 'certificate' ) ) ),
					function ( $e ) {
						$src = self::src_label( $e );
						return self::date( self::v( $e, 'date' ), true ) . ( '' !== $src ? ' · ' . esc_html( $src ) : '' );
					}
				)
			);
		}
		if ( $on( 'projects' ) ) {
			$page(
				'My Projects',
				'bulb',
				$items(
					self::by_date( self::of_type( $entries, array( 'project' ) ) ),
					function ( $e ) {
						return self::range( $e ) . ' · ' . ( 'done' === self::v( $e, 'status' ) ? 'Completed' : 'In Progress' );
					}
				)
			);
		}
		if ( $on( 'goals' ) ) {
			$page(
				'My Goals',
				'goals',
				$items(
					self::of_type( $entries, array( 'goal' ) ),
					function ( $e ) {
						$labels = array( 'want' => 'Want to Try', 'working' => 'Working On It', 'achieved' => 'Achieved' );
						$st     = self::v( $e, 'status' );
						return ( isset( $labels[ $st ] ) ? $labels[ $st ] : '' ) . ( '' !== self::v( $e, 'target' ) ? ' · ' . self::date( self::v( $e, 'target' ), true ) : '' );
					}
				)
			);
		}
		if ( $on( 'timeline' ) ) {
			$list = array_filter(
				$entries,
				function ( $e ) {
					$t = self::v( $e, 'type' );
					return 'skill' !== $t && 'goal' !== $t;
				}
			);
			$html = '';
			foreach ( array_slice( self::by_date( array_values( $list ) ), 0, 8 ) as $e ) {
				$t     = self::v( $e, 'type' );
				$html .= '<div><small>' . self::date( self::v( $e, 'date' ), true ) . '</small><strong>' . esc_html( self::v( $e, 'title' ) ) . '</strong><br><span class="muted">' . esc_html( isset( self::$types[ $t ] ) ? self::$types[ $t ][0] : '' ) . '</span></div>';
			}
			$page( 'My Portfolio Timeline', 'journey', '<div class="pg-tl">' . $html . '</div>' );
		}

		$letter = 'letter' === $paper;
		$css    = BDD_URL . 'assets/css/dashboard.css?ver=' . BDD_VERSION . '.' . filemtime( BDD_DIR . 'assets/css/dashboard.css' );
		ob_start();
		?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?php echo esc_html( sprintf( '%s – Bright Future Portfolio', $p( 'name' ) ? $p( 'name' ) : 'My' ) ); ?></title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700;800&amp;family=Outfit:wght@400;500;600;700&amp;family=Caveat:wght@600;700&amp;display=swap">
<link rel="stylesheet" href="<?php echo esc_url( $css ); ?>">
<style>@page{size:<?php echo $letter ? 'letter' : 'A4'; ?>;margin:0}body{background:#fff}.book{padding:24px}</style>
</head>
<body class="bd-book">
<div class="book<?php echo $letter ? ' letter' : ''; ?>"><?php echo implode( '', $pages ) ? implode( '', $pages ) : '<p class="muted">Pick at least one section.</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts above. ?></div>
<script>window.addEventListener('load',function(){if(window.parent===window){setTimeout(function(){window.print();},300);}});</script>
</body>
</html>
		<?php
		return ob_get_clean();
	}

	public static function render( $user_id, $paper ) {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
		nocache_headers();
		status_header( 200 );
		header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'X-Robots-Tag: noindex, nofollow' );
		echo self::html( $user_id, $paper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/* ---------- helpers (match the dashboard script) ---------- */

	private static function v( $e, $k ) {
		return isset( $e[ $k ] ) && is_scalar( $e[ $k ] ) ? (string) $e[ $k ] : '';
	}

	private static function img( $key ) {
		if ( null === self::$imgs ) {
			self::$imgs = bdd_image_urls();
		}
		return isset( self::$imgs[ $key ] ) ? self::$imgs[ $key ] : self::$imgs['portfolio'];
	}

	private static function src( $value ) {
		$value = (string) $value;
		if ( '' === $value ) {
			return self::img( 'portfolio' );
		}
		if ( 0 === strpos( $value, 'k:' ) ) {
			return self::img( substr( $value, 2 ) );
		}
		$clean = bdd_clean_photo( $value );
		return '' !== $clean ? $clean : self::img( 'portfolio' );
	}

	private static function photo( $e ) {
		if ( ! empty( $e['photos'] ) && is_array( $e['photos'] ) && ! empty( $e['photos'][0] ) ) {
			return self::src( $e['photos'][0] );
		}
		$t = self::v( $e, 'type' );
		return self::img( isset( self::$types[ $t ] ) ? self::$types[ $t ][1] : 'portfolio' );
	}

	private static function date( $d, $short = false ) {
		if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})/', (string) $d, $m ) ) {
			return '';
		}
		$mon = isset( self::$months[ (int) $m[2] - 1 ] ) ? self::$months[ (int) $m[2] - 1 ] : '';
		return $short ? $mon . ' ' . $m[1] : $mon . ' ' . (int) $m[3] . ', ' . $m[1];
	}

	private static function range( $e ) {
		$t     = self::v( $e, 'type' );
		$start = self::date( self::v( $e, 'date' ), true );
		$end   = self::v( $e, 'end' );
		if ( '' !== $end && ( 'activity' === $t || 'project' === $t ) ) {
			return $start . ( self::v( $e, 'date' ) === $end ? '' : ' – ' . self::date( $end, true ) );
		}
		if ( 'activity' === $t && 'ongoing' === self::v( $e, 'status' ) ) {
			return $start . ' – Present';
		}
		return $start;
	}

	private static function src_label( $e ) {
		$src = self::v( $e, 'source' );
		if ( 'Bright Dreamers' === $src ) {
			return ! empty( $e['verified'] ) ? 'Verified by Bright Dreamers' : 'Bright Dreamers';
		}
		return $src;
	}

	private static function of_type( $entries, $types ) {
		return array_values(
			array_filter(
				$entries,
				function ( $e ) use ( $types ) {
					return in_array( self::v( $e, 'type' ), $types, true );
				}
			)
		);
	}

	private static function by_date( $list ) {
		usort(
			$list,
			function ( $a, $b ) {
				return strcmp( self::v( $b, 'date' ), self::v( $a, 'date' ) );
			}
		);
		return $list;
	}

	private static function cut( $text, $len ) {
		return function_exists( 'mb_substr' ) ? mb_substr( $text, 0, $len ) : substr( $text, 0, $len );
	}
}
