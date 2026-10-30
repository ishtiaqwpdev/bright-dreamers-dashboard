<?php
/**
 * Shared helpers.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function bdd_default_settings() {
	return array(
		'allow_register' => 1,
		'allow_email'    => 1,
		'email_limit'    => 10,
		'block_admin'    => 1,
	);
}

function bdd_setting( $key ) {
	$settings = get_option( 'bdd_settings' );
	$defaults = bdd_default_settings();
	$settings = is_array( $settings ) ? array_merge( $defaults, $settings ) : $defaults;
	return isset( $settings[ $key ] ) ? $settings[ $key ] : null;
}

/**
 * URL of the dashboard (the page holding the shortcode, or a fallback endpoint).
 */
function bdd_dashboard_url() {
	$page_id = (int) get_option( 'bdd_page_id' );
	if ( $page_id && 'publish' === get_post_status( $page_id ) ) {
		return get_permalink( $page_id );
	}
	return add_query_arg( 'bd_dashboard', '1', home_url( '/' ) );
}

/**
 * Bright Dreamers staff who may verify entries and open any parent's portfolio.
 * Change the capability with the bdd_admin_capability filter.
 */
function bdd_is_admin_user( $user = null ) {
	$user = $user ? $user : wp_get_current_user();
	return $user && $user->exists() && user_can( $user, apply_filters( 'bdd_admin_capability', 'manage_options' ) );
}

/**
 * Whose portfolio a request works on: an admin may pass a parent's user ID, everyone else gets their own.
 */
function bdd_target_user_id( $requested = 0 ) {
	$requested = absint( $requested );
	if ( $requested && $requested !== get_current_user_id() && bdd_is_admin_user() && get_userdata( $requested ) ) {
		return $requested;
	}
	return get_current_user_id();
}

function bdd_is_parent( $user = null ) {
	$user = $user ? $user : wp_get_current_user();
	return $user && $user->exists() && in_array( BDD_ROLE, (array) $user->roles, true );
}

/**
 * Image keys used by the dashboard design (file name inside assets/img).
 */
function bdd_image_urls() {
	$files = array(
		'achievements', 'activities', 'add', 'bulb', 'dashboard', 'email', 'goals', 'journey', 'logo', 'parent',
		'portfolio', 'print', 'profile', 'projects', 'quote', 'settings', 'skills',
		's-comm', 's-creativity', 's-dance', 's-env', 's-kind', 's-music', 's-problem', 's-team',
	);
	$jpg   = array(
		'art', 'birdhouse', 'book', 'community', 'cover', 'dance', 'dash-art', 'dash-garden', 'dash-piano',
		'garden', 'kindness', 'marine', 'maya', 'piano', 'robot', 'science',
	);
	$out   = array();
	foreach ( $files as $key ) {
		$out[ $key ] = BDD_URL . 'assets/img/' . $key . '.png';
	}
	foreach ( $jpg as $key ) {
		$out[ $key ] = BDD_URL . 'assets/img/' . $key . '.jpg';
	}
	return apply_filters( 'bdd_image_urls', $out );
}

/**
 * Read a parent's saved portfolio.
 */
function bdd_get_state( $user_id ) {
	$raw = get_user_meta( $user_id, BDD_META, true );
	if ( ! $raw ) {
		return null;
	}
	$state = json_decode( $raw, true );
	return is_array( $state ) ? bdd_force_private( $state ) : null;
}

function bdd_save_state( $user_id, $state ) {
	$state = bdd_force_private( $state );
	if ( is_array( $state ) ) {
		// The saved account setting is the source of truth for email sharing.
		$state['parent']['share']      = bdd_allow_email_share( $user_id );
		$state['parent']['coverPhoto'] = bdd_show_photo_on_cover( $user_id );
	}
	update_user_meta( $user_id, 'bdd_portfolio_private', 1 );
	return update_user_meta( $user_id, BDD_META, wp_slash( wp_json_encode( $state ) ) );
}

/**
 * The child's portfolio is always private. This is a status, not a setting:
 * whatever the browser sends, portfolio_private is stored as true.
 * Sharing only happens through a sharing feature such as Email Share.
 */
function bdd_force_private( $state ) {
	if ( ! is_array( $state ) ) {
		return $state;
	}
	if ( ! isset( $state['parent'] ) || ! is_array( $state['parent'] ) ) {
		$state['parent'] = array();
	}
	$state['parent']['privateEntries'] = true;
	$state['portfolio_private']        = true;
	return $state;
}

/**
 * "Allow me to share portfolio copies by email" (per parent account).
 * Stored as user meta bdd_allow_email_share = '1' or '0'.
 * If the meta is missing (accounts from before 1.4.0), the old "Allow sharing by email"
 * choice saved in the portfolio is copied over, so nobody's choice is reset.
 * Turning this on only allows sending a copy to an email address the parent types in.
 * It never makes the portfolio public and never creates a public link.
 */
function bdd_allow_email_share( $user_id ) {
	$user_id = (int) $user_id;
	if ( ! $user_id ) {
		return false;
	}
	$meta = get_user_meta( $user_id, 'bdd_allow_email_share', true );
	if ( '1' === (string) $meta || '0' === (string) $meta ) {
		return '1' === (string) $meta;
	}
	$raw   = get_user_meta( $user_id, BDD_META, true );
	$state = $raw ? json_decode( $raw, true ) : null;
	$allow = ! ( is_array( $state ) && isset( $state['parent']['share'] ) && false === $state['parent']['share'] );
	bdd_set_allow_email_share( $user_id, $allow );
	return $allow;
}

function bdd_set_allow_email_share( $user_id, $allow ) {
	update_user_meta( (int) $user_id, 'bdd_allow_email_share', $allow ? '1' : '0' );
}

/**
 * Whether a parent's portfolio is private. Always true; one place for other code to check.
 */
function bdd_is_portfolio_private( $user_id ) {
	return true;
}

/**
 * Keep only photo values the dashboard understands.
 */
function bdd_clean_photo( $value ) {
	if ( ! is_string( $value ) ) {
		return '';
	}
	if ( preg_match( '/^k:[a-z0-9\-]{1,40}$/', $value ) ) {
		return $value;
	}
	if ( preg_match( '#^data:image/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$#', $value ) ) {
		return $value;
	}
	if ( preg_match( '#^https?://#i', $value ) ) {
		return esc_url_raw( $value );
	}
	return '';
}

/**
 * Validate a portfolio sent by the browser.
 *
 * @param array      $state    Portfolio from the browser.
 * @param array|null $old      Portfolio saved before this change (used for Bright Dreamers verification).
 * @param bool       $is_admin Whether the person saving is Bright Dreamers staff.
 * @return array|WP_Error
 */
function bdd_validate_state( $state, $old = null, $is_admin = false ) {
	if ( ! is_array( $state ) || ! isset( $state['entries'] ) || ! is_array( $state['entries'] ) || ! isset( $state['profile'] ) || ! is_array( $state['profile'] ) ) {
		return new WP_Error( 'bdd_bad_state', __( 'The portfolio data could not be read.', 'bright-dreamers-dashboard' ), array( 'status' => 400 ) );
	}

	unset( $state['confirmReset'] );
	if ( isset( $state['parent'] ) && is_array( $state['parent'] ) ) {
		unset( $state['parent']['pw'] );
	}
	// Ignore any submitted privacy value: the portfolio is always private.
	$state = bdd_force_private( $state );

	$state['entries'] = array_values(
		array_filter(
			$state['entries'],
			function ( $e ) {
				return is_array( $e );
			}
		)
	);
	$old_entries = array();
	if ( is_array( $old ) && ! empty( $old['entries'] ) && is_array( $old['entries'] ) ) {
		foreach ( $old['entries'] as $old_entry ) {
			if ( is_array( $old_entry ) && isset( $old_entry['id'] ) ) {
				$old_entries[ (string) $old_entry['id'] ] = $old_entry;
			}
		}
	}
	$kinds   = array( 'achievement', 'award', 'recognition', 'certificate' );
	$sources = array( 'Outside Activity', 'Personal / Family', 'Bright Dreamers' );

	foreach ( $state['entries'] as $i => $entry ) {
		$type = isset( $entry['type'] ) ? (string) $entry['type'] : '';
		if ( 'achievement' === $type || 'certificate' === $type ) {
			// Achievements: only Bright Dreamers staff can set the "Bright Dreamers / Verified" source.
			$kind = isset( $entry['kind'] ) && in_array( $entry['kind'], $kinds, true ) ? $entry['kind'] : ( 'certificate' === $type ? 'certificate' : 'achievement' );
			$src  = isset( $entry['source'] ) ? (string) $entry['source'] : '';
			if ( 'Personal Project' === $src ) {
				$src = 'Personal / Family';
			}
			if ( ! in_array( $src, $sources, true ) ) {
				$src = 'Outside Activity';
			}
			if ( $is_admin ) {
				$verified = ( 'Bright Dreamers' === $src );
			} else {
				$id   = isset( $entry['id'] ) ? (string) $entry['id'] : '';
				$prev = isset( $old_entries[ $id ] ) ? $old_entries[ $id ] : null;
				$was  = $prev && ! empty( $prev['verified'] ) && isset( $prev['source'] ) && 'Bright Dreamers' === $prev['source'];
				if ( 'Bright Dreamers' === $src && ! $was ) {
					$src = 'Outside Activity';
				}
				$verified = ( 'Bright Dreamers' === $src );
			}
			$state['entries'][ $i ]['type']     = 'certificate' === $kind ? 'certificate' : 'achievement';
			$state['entries'][ $i ]['kind']     = $kind;
			$ctypes = array( 'course', 'program', 'participation', 'award', 'competition', 'other' );
			$state['entries'][ $i ]['ctype']    = ( 'certificate' === $kind && isset( $entry['ctype'] ) && in_array( $entry['ctype'], $ctypes, true ) ) ? $entry['ctype'] : '';
			$state['entries'][ $i ]['source']   = $src;
			$state['entries'][ $i ]['verified'] = $verified;
		} elseif ( 'goal' === $type ) {
			// Goals: same Bright Dreamers verification rule; goal type and status from fixed lists.
			$src = isset( $entry['source'] ) ? (string) $entry['source'] : '';
			if ( '' !== $src && ! in_array( $src, $sources, true ) ) {
				$src = 'Personal / Family';
			}
			if ( 'Bright Dreamers' === $src && ! $is_admin ) {
				$id   = isset( $entry['id'] ) ? (string) $entry['id'] : '';
				$prev = isset( $old_entries[ $id ] ) ? $old_entries[ $id ] : null;
				$was  = $prev && ! empty( $prev['verified'] ) && isset( $prev['source'] ) && 'Bright Dreamers' === $prev['source'];
				if ( ! $was ) {
					$src = 'Personal / Family';
				}
			}
			$gtypes   = array( 'learning', 'growth', 'creative', 'health', 'kindness', 'other' );
			$statuses = array( 'want', 'working', 'achieved' );
			$state['entries'][ $i ]['gtype']    = isset( $entry['gtype'] ) && in_array( $entry['gtype'], $gtypes, true ) ? $entry['gtype'] : '';
			$state['entries'][ $i ]['status']   = isset( $entry['status'] ) && in_array( $entry['status'], $statuses, true ) ? $entry['status'] : 'want';
			$state['entries'][ $i ]['source']   = $src;
			$state['entries'][ $i ]['verified'] = ( 'Bright Dreamers' === $src );
			unset( $state['entries'][ $i ]['kind'], $state['entries'][ $i ]['toAch'], $state['entries'][ $i ]['achDate'] );
		} elseif ( 'project' === $type ) {
			// Projects: same Bright Dreamers verification rule; project type from a fixed list.
			$src = isset( $entry['source'] ) ? (string) $entry['source'] : '';
			if ( 'Personal Project' === $src ) {
				$src = 'Personal / Family';
			}
			if ( '' !== $src && ! in_array( $src, $sources, true ) ) {
				$src = 'Outside Activity';
			}
			if ( 'Bright Dreamers' === $src && ! $is_admin ) {
				$id   = isset( $entry['id'] ) ? (string) $entry['id'] : '';
				$prev = isset( $old_entries[ $id ] ) ? $old_entries[ $id ] : null;
				$was  = $prev && ! empty( $prev['verified'] ) && isset( $prev['source'] ) && 'Bright Dreamers' === $prev['source'];
				if ( ! $was ) {
					$src = 'Outside Activity';
				}
			}
			$ptypes = array( 'creative', 'stem', 'community', 'kindness', 'environmental', 'personal', 'other' );
			$state['entries'][ $i ]['ptype']    = isset( $entry['ptype'] ) && in_array( $entry['ptype'], $ptypes, true ) ? $entry['ptype'] : '';
			$state['entries'][ $i ]['source']   = $src;
			$state['entries'][ $i ]['verified'] = ( 'Bright Dreamers' === $src );
			$state['entries'][ $i ]['status']   = ( isset( $entry['status'] ) && 'done' === $entry['status'] ) ? 'done' : 'progress';
			unset( $state['entries'][ $i ]['kind'] );
		} elseif ( 'skill' === $type ) {
			// Skills & talents: same Bright Dreamers verification rule as achievements.
			$src = isset( $entry['source'] ) ? (string) $entry['source'] : '';
			if ( '' !== $src && ! in_array( $src, $sources, true ) ) {
				$src = 'Personal / Family';
			}
			if ( 'Bright Dreamers' === $src && ! $is_admin ) {
				$id   = isset( $entry['id'] ) ? (string) $entry['id'] : '';
				$prev = isset( $old_entries[ $id ] ) ? $old_entries[ $id ] : null;
				$was  = $prev && ! empty( $prev['verified'] ) && isset( $prev['source'] ) && 'Bright Dreamers' === $prev['source'];
				if ( ! $was ) {
					$src = 'Outside Activity';
				}
			}
			$levels = array( 'exploring' => 20, 'growing' => 40, 'developing' => 60, 'confident' => 80, 'strong' => 100 );
			$lvl    = isset( $entry['lvl'] ) && isset( $levels[ $entry['lvl'] ] ) ? $entry['lvl'] : '';
			if ( '' === $lvl ) {
				$n   = isset( $entry['level'] ) ? (int) $entry['level'] : 0;
				$lvl = $n <= 20 ? 'exploring' : ( $n <= 40 ? 'growing' : ( $n <= 60 ? 'developing' : ( $n <= 80 ? 'confident' : 'strong' ) ) );
			}
			$state['entries'][ $i ]['source']   = $src;
			$state['entries'][ $i ]['verified'] = ( 'Bright Dreamers' === $src );
			$state['entries'][ $i ]['lvl']      = $lvl;
			$state['entries'][ $i ]['level']    = $levels[ $lvl ];
			$state['entries'][ $i ]['stype']    = ( isset( $entry['stype'] ) && 'talent' === $entry['stype'] ) ? 'talent' : 'skill';
			unset( $state['entries'][ $i ]['kind'] );
		} else {
			unset( $state['entries'][ $i ]['verified'], $state['entries'][ $i ]['kind'] );
		}
		$photos = isset( $entry['photos'] ) && is_array( $entry['photos'] ) ? $entry['photos'] : array();
		$photos = array_values( array_filter( array_map( 'bdd_clean_photo', $photos ) ) );
		$state['entries'][ $i ]['photos'] = array_slice( $photos, 0, 6 );
		if ( ! isset( $entry['skills'] ) || ! is_array( $entry['skills'] ) ) {
			$state['entries'][ $i ]['skills'] = array();
		}
	}
	if ( isset( $state['profile']['photo'] ) ) {
		$state['profile']['photo'] = bdd_clean_photo( $state['profile']['photo'] );
	}
	if ( isset( $state['profile']['photoSrc'] ) ) {
		$state['profile']['photoSrc'] = bdd_clean_photo( $state['profile']['photoSrc'] );
	}
	if ( isset( $state['profile']['photoCrop'] ) ) {
		$crop = is_array( $state['profile']['photoCrop'] ) ? $state['profile']['photoCrop'] : array();
		$rot  = isset( $crop['rot'] ) ? (int) $crop['rot'] : 0;
		$num  = function ( $key, $min, $max, $default ) use ( $crop ) {
			$v = isset( $crop[ $key ] ) && is_numeric( $crop[ $key ] ) ? (float) $crop[ $key ] : $default;
			return max( $min, min( $max, $v ) );
		};
		$state['profile']['photoCrop'] = array(
			'rot' => in_array( $rot, array( 0, 90, 180, 270 ), true ) ? $rot : 0,
			'z'   => $num( 'z', 0.01, 4, 1 ),
			'ox'  => $num( 'ox', -5, 5, 0 ),
			'oy'  => $num( 'oy', -5, 5, 0 ),
		);
	}

	$max = (int) apply_filters( 'bdd_max_state_bytes', 3 * MB_IN_BYTES );
	if ( strlen( wp_json_encode( $state ) ) > $max ) {
		return new WP_Error( 'bdd_too_big', __( 'The portfolio is too large to save. Remove a few photos and try again.', 'bright-dreamers-dashboard' ), array( 'status' => 413 ) );
	}
	return $state;
}

/**
 * Simple per-key counter used for rate limits.
 */
function bdd_hit_limit( $key, $max, $window ) {
	$tkey  = 'bdd_rl_' . md5( $key );
	$count = (int) get_transient( $tkey );
	if ( $count >= $max ) {
		return true;
	}
	set_transient( $tkey, $count + 1, $window );
	return false;
}

function bdd_client_ip() {
	return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
}

/* ---------- "Show my child's photo on the private portfolio cover" ---------- */

/**
 * Per-parent display setting, stored as user meta bdd_show_photo_on_cover = '1' or '0'.
 * If missing (accounts from before 1.5.0) the old "Show photo on the portfolio cover" choice
 * is copied over, so nobody's choice is reset. This only changes what is DISPLAYED on covers;
 * the uploaded photo stays private either way.
 */
function bdd_show_photo_on_cover( $user_id ) {
	$user_id = (int) $user_id;
	if ( ! $user_id ) {
		return false;
	}
	$meta = get_user_meta( $user_id, 'bdd_show_photo_on_cover', true );
	if ( '1' === (string) $meta || '0' === (string) $meta ) {
		return '1' === (string) $meta;
	}
	$raw   = get_user_meta( $user_id, BDD_META, true );
	$state = $raw ? json_decode( $raw, true ) : null;
	$show  = ! ( is_array( $state ) && isset( $state['parent']['coverPhoto'] ) && false === $state['parent']['coverPhoto'] );
	bdd_set_show_photo_on_cover( $user_id, $show );
	return $show;
}

function bdd_set_show_photo_on_cover( $user_id, $show ) {
	update_user_meta( (int) $user_id, 'bdd_show_photo_on_cover', $show ? '1' : '0' );
}

/**
 * Neutral placeholder avatar: the child's first initial in a brand-colored circle
 * (a simple silhouette when there is no name). Returned as an SVG data URI.
 */
function bdd_cover_avatar( $name ) {
	$name    = trim( wp_strip_all_tags( (string) $name ) );
	$initial = '' === $name ? '' : ( function_exists( 'mb_substr' ) ? mb_strtoupper( mb_substr( $name, 0, 1 ) ) : strtoupper( substr( $name, 0, 1 ) ) );
	$svg     = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ee1d78"/><stop offset="1" stop-color="#8a4fd8"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>';
	if ( '' !== $initial ) {
		$svg .= '<text x="100" y="100" dy=".35em" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="96" font-weight="700" fill="#ffffff">' . htmlspecialchars( $initial, ENT_QUOTES | ENT_XML1, 'UTF-8' ) . '</text>';
	} else {
		$svg .= '<circle cx="100" cy="80" r="34" fill="#ffffff" fill-opacity=".92"/><path d="M38 176c6-36 32-56 62-56s56 20 62 56z" fill="#ffffff" fill-opacity=".92"/>';
	}
	$svg .= '</svg>';
	return 'data:image/svg+xml;charset=utf-8,' . rawurlencode( $svg );
}

/* ---------- Private photo storage ---------- */

/**
 * Photos are stored in wp-content/uploads/bdd-private/<user id>/ with random names,
 * outside the Media Library. The folder blocks direct web access (.htaccess for Apache /
 * LiteSpeed) and photos are only sent through bdd_serve_private_photo() after checking
 * that the visitor is logged in as the owner (or an admin).
 */
function bdd_private_dir() {
	$uploads = wp_upload_dir( null, false );
	$dir     = trailingslashit( $uploads['basedir'] ) . 'bdd-private';
	if ( ! is_dir( $dir ) ) {
		wp_mkdir_p( $dir );
	}
	if ( ! file_exists( $dir . '/.htaccess' ) ) {
		@file_put_contents( $dir . '/.htaccess', "# Bright Dreamers private photos\n<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\nOptions -Indexes\n" ); // phpcs:ignore
	}
	if ( ! file_exists( $dir . '/index.php' ) ) {
		@file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore
	}
	return $dir;
}

function bdd_private_photo_url( $owner_id, $name ) {
	return add_query_arg( 'bd_photo', (int) $owner_id . '/' . $name, home_url( '/' ) );
}

/**
 * @return array|null [ owner_id, file_name ] or null if the reference is not valid.
 */
function bdd_parse_private_photo_ref( $ref ) {
	if ( ! is_string( $ref ) || ! preg_match( '#^(\d+)/([a-f0-9]{32}\.(?:jpg|png|webp))$#', $ref, $m ) ) {
		return null;
	}
	return array( (int) $m[1], $m[2] );
}

/**
 * Save photo bytes privately for a parent.
 *
 * @return string|WP_Error Private URL (only works for the logged-in owner or an admin).
 */
function bdd_store_private_photo( $owner_id, $binary, $ext ) {
	$ext = 'jpeg' === $ext ? 'jpg' : $ext;
	if ( ! in_array( $ext, array( 'jpg', 'png', 'webp' ), true ) ) {
		return new WP_Error( 'bdd_bad_image', 'Unsupported image type.' );
	}
	$dir = bdd_private_dir() . '/' . (int) $owner_id;
	if ( ! is_dir( $dir ) && ! wp_mkdir_p( $dir ) ) {
		return new WP_Error( 'bdd_upload_failed', 'Could not create the photo folder.' );
	}
	if ( ! file_exists( $dir . '/index.php' ) ) {
		@file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore
	}
	$name = bin2hex( random_bytes( 16 ) ) . '.' . $ext;
	if ( false === @file_put_contents( $dir . '/' . $name, $binary ) ) { // phpcs:ignore
		return new WP_Error( 'bdd_upload_failed', 'Could not save the photo.' );
	}
	return bdd_private_photo_url( $owner_id, $name );
}

function bdd_can_view_private_photo( $owner_id ) {
	return is_user_logged_in() && ( get_current_user_id() === (int) $owner_id || bdd_is_admin_user() );
}

/**
 * Copy a parent's old Media Library photos (public URLs) into private storage and
 * point the portfolio at the private copies. The old files are NOT deleted here;
 * an admin removes them from Settings → Parent Dashboard.
 *
 * @return int Number of photo links moved to private copies.
 */
function bdd_migrate_photos_to_private( $user_id ) {
	$state = bdd_get_state( $user_id );
	if ( ! $state ) {
		return 0;
	}
	$map   = array();
	$count = 0;
	$fix   = function ( $url ) use ( $user_id, &$map, &$count ) {
		if ( ! is_string( $url ) || ! preg_match( '#^https?://#i', $url ) || false !== strpos( $url, 'bd_photo=' ) ) {
			return $url;
		}
		if ( isset( $map[ $url ] ) ) {
			return $map[ $url ];
		}
		$att = attachment_url_to_postid( $url );
		if ( ! $att || ! get_post_meta( $att, '_bdd_parent_upload', true ) ) {
			return $url;
		}
		$copy = get_post_meta( $att, '_bdd_private_copy', true );
		if ( ! $copy ) {
			$file = get_attached_file( $att );
			if ( ! $file || ! is_readable( $file ) ) {
				return $url;
			}
			$stored = bdd_store_private_photo( $user_id, file_get_contents( $file ), strtolower( pathinfo( $file, PATHINFO_EXTENSION ) ) ); // phpcs:ignore
			if ( is_wp_error( $stored ) ) {
				return $url;
			}
			$copy = $stored;
			update_post_meta( $att, '_bdd_private_copy', $copy );
		}
		$map[ $url ] = $copy;
		$count++;
		return $copy;
	};
	if ( isset( $state['profile'] ) && is_array( $state['profile'] ) ) {
		foreach ( array( 'photo', 'photoSrc' ) as $k ) {
			if ( isset( $state['profile'][ $k ] ) ) {
				$state['profile'][ $k ] = $fix( $state['profile'][ $k ] );
			}
		}
	}
	if ( isset( $state['entries'] ) && is_array( $state['entries'] ) ) {
		foreach ( $state['entries'] as $i => $e ) {
			if ( is_array( $e ) && isset( $e['photos'] ) && is_array( $e['photos'] ) ) {
				$state['entries'][ $i ]['photos'] = array_map( $fix, $e['photos'] );
			}
		}
	}
	if ( $count ) {
		bdd_save_state( $user_id, $state );
	}
	return $count;
}

/**
 * Old public Media Library copies of parent photos that can be removed:
 * already copied to private storage, or not used by any portfolio.
 *
 * @return int[] Attachment IDs.
 */
function bdd_removable_public_photos() {
	$ids = get_posts(
		array(
			'post_type'   => 'attachment',
			'post_status' => 'inherit',
			'numberposts' => -1,
			'fields'      => 'ids',
			'meta_key'    => '_bdd_parent_upload', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		)
	);
	if ( ! $ids ) {
		return array();
	}
	$used = array();
	foreach ( get_users( array( 'meta_key' => BDD_META, 'fields' => 'ID', 'number' => -1 ) ) as $uid ) { // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$raw = get_user_meta( $uid, BDD_META, true );
		if ( $raw ) {
			$used[] = $raw;
		}
	}
	$all = implode( "\n", $used );
	$out = array();
	foreach ( $ids as $id ) {
		$url = wp_get_attachment_url( $id );
		if ( get_post_meta( $id, '_bdd_private_copy', true ) || ! $url || false === strpos( $all, str_replace( '/', '\/', $url ) ) && false === strpos( $all, $url ) ) {
			$out[] = (int) $id;
		}
	}
	return $out;
}

/* ---------- Parent / guardian consent (asked once: Create Account, or Profile / Account Settings for older accounts) ---------- */

// v1 = "...to manage this private portfolio." (Account Settings, 1.6.0)
// v2 = "...to create and manage this private portfolio." (1.9.0). Earlier v1 confirmations stay valid.
define( 'BDD_CONSENT_VERSION', 'v2' );

/**
 * Stored once per parent account:
 * bdd_consent_guardian = 1, bdd_consent_guardian_at = Unix time, bdd_consent_guardian_text_version = v1.
 *
 * @return array|null [ 'at' => ISO 8601 date, 'version' => 'v1' ] or null if not given yet.
 */
function bdd_guardian_consent( $user_id ) {
	$user_id = (int) $user_id;
	if ( ! $user_id || '1' !== (string) get_user_meta( $user_id, 'bdd_consent_guardian', true ) ) {
		return null;
	}
	$at = (int) get_user_meta( $user_id, 'bdd_consent_guardian_at', true );
	return array(
		'at'      => $at ? gmdate( 'c', $at ) : '',
		'version' => (string) get_user_meta( $user_id, 'bdd_consent_guardian_text_version', true ),
	);
}

function bdd_record_guardian_consent( $user_id ) {
	update_user_meta( (int) $user_id, 'bdd_consent_guardian', '1' );
	update_user_meta( (int) $user_id, 'bdd_consent_guardian_at', time() );
	update_user_meta( (int) $user_id, 'bdd_consent_guardian_text_version', BDD_CONSENT_VERSION );
}

/* ---------- Email Share audit log ---------- */

/**
 * Record one Email Share send on the parent's account (user meta bdd_share_log).
 * Only who sent it, to whom, when, and that the confirmation was given.
 * The portfolio contents and the message are NOT logged. Keeps the latest 200 sends.
 */
function bdd_log_email_share( $user_id, $recipients ) {
	$log = get_user_meta( (int) $user_id, 'bdd_share_log', true );
	$log = is_array( $log ) ? $log : array();
	$log[] = array(
		'parent_id'  => (int) $user_id,
		'recipients' => array_values( array_map( 'strval', (array) $recipients ) ),
		'sent_at'    => time(),
		'confirmed'  => true,
	);
	if ( count( $log ) > 200 ) {
		$log = array_slice( $log, -200 );
	}
	update_user_meta( (int) $user_id, 'bdd_share_log', $log );
}

/* ---------- "Clear all entries" (Account Settings → Start over) ---------- */

/**
 * True when a normal save would wipe a portfolio that had 2 or more entries.
 * Removing everything at once must go through the "Clear all entries" step, which
 * requires the parent's confirmation. Deleting entries one by one still works.
 */
function bdd_is_bulk_clear( $new_state, $old_state ) {
	$old = is_array( $old_state ) && isset( $old_state['entries'] ) && is_array( $old_state['entries'] ) ? count( $old_state['entries'] ) : 0;
	$new = is_array( $new_state ) && isset( $new_state['entries'] ) && is_array( $new_state['entries'] ) ? count( $new_state['entries'] ) : 0;
	return $old >= 2 && 0 === $new;
}

/**
 * Audit log for "Clear all entries" (user meta bdd_delete_log). Who, whose portfolio,
 * when, how many entries, and that the confirmation was given. No portfolio contents.
 * Each parent account has one child portfolio, so the portfolio is identified by the parent ID.
 */
function bdd_log_portfolio_clear( $owner_id, $by_user_id, $entries_removed, $files_removed = 0 ) {
	$log = get_user_meta( (int) $owner_id, 'bdd_delete_log', true );
	$log = is_array( $log ) ? $log : array();
	$log[] = array(
		'parent_id'       => (int) $owner_id,
		'portfolio_id'    => (int) $owner_id,
		'deleted_by'      => (int) $by_user_id,
		'entries_removed' => (int) $entries_removed,
		'files_removed'   => (int) $files_removed,
		'deleted_at'      => time(),
		'confirmed'       => true,
	);
	if ( count( $log ) > 100 ) {
		$log = array_slice( $log, -100 );
	}
	update_user_meta( (int) $owner_id, 'bdd_delete_log', $log );
}

/**
 * Did the child's profile text change? Used to ask for the parent / guardian confirmation once
 * before a profile is first set up. Missing keys count as empty text.
 */
function bdd_profile_text_changed( $new_state, $old_state ) {
	$new = is_array( $new_state ) && isset( $new_state['profile'] ) && is_array( $new_state['profile'] ) ? $new_state['profile'] : array();
	$old = is_array( $old_state ) && isset( $old_state['profile'] ) && is_array( $old_state['profile'] ) ? $old_state['profile'] : array();
	foreach ( array( 'name', 'age', 'location', 'interests', 'about', 'dream', 'quote' ) as $k ) {
		$a = isset( $new[ $k ] ) && is_scalar( $new[ $k ] ) ? trim( (string) $new[ $k ] ) : '';
		$b = isset( $old[ $k ] ) && is_scalar( $old[ $k ] ) ? trim( (string) $old[ $k ] ) : '';
		if ( $a !== $b ) {
			return true;
		}
	}
	return false;
}

/**
 * Delete every private photo file of one portfolio (uploads/bdd-private/<owner>/).
 * Returns the number of files removed, or WP_Error if any file could not be removed
 * (nothing is reported as deleted in that case, so the parent can try again).
 */
function bdd_delete_private_files( $owner_id ) {
	$owner_id = (int) $owner_id;
	if ( $owner_id < 1 ) {
		return 0;
	}
	$dir = bdd_private_dir() . '/' . $owner_id;
	if ( ! is_dir( $dir ) ) {
		return 0;
	}
	$files = glob( $dir . '/*.{jpg,png,webp}', GLOB_BRACE );
	$files = is_array( $files ) ? $files : array();
	$count = 0;
	$fail  = 0;
	foreach ( $files as $file ) {
		if ( ! is_file( $file ) ) {
			continue;
		}
		if ( @unlink( $file ) && ! file_exists( $file ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink
			$count++;
		} else {
			$fail++;
		}
	}
	if ( $fail ) {
		return new WP_Error( 'bdd_delete_files', sprintf( '%d file(s) could not be deleted.', $fail ) );
	}
	return $count;
}

/* ---------- Parent Portal footer (links to the existing public website pages) ---------- */

/**
 * Footer links for every Parent Portal page. URLs come from the website's own footer settings
 * (Bright Dreamers Club theme), so if a page is changed there the portal follows automatically.
 * Financial Transparency and the Photo & Media Consent Form are intentionally not included.
 *
 * @return array[] list of [ 'key', 'label', 'url' ].
 */
function bdd_portal_footer_links() {
	$links = array(
		'privacy'      => array( __( 'Privacy Policy', 'bright-dreamers-dashboard' ), home_url( '/privacy-policy/' ) ),
		'terms'        => array( __( 'Terms of Use', 'bright-dreamers-dashboard' ), home_url( '/terms/' ) ),
		'child_safety' => array( __( 'Child Safety & Safeguarding', 'bright-dreamers-dashboard' ), home_url( '/faq/' ) ),
		'photo_policy' => array( __( 'Photo & Media Policy', 'bright-dreamers-dashboard' ), home_url( '/photo-media-policy/' ) ),
		'contact'      => array( __( 'Contact Us', 'bright-dreamers-dashboard' ), home_url( '/contact/' ) ),
	);
	if ( function_exists( 'get_privacy_policy_url' ) && get_privacy_policy_url() ) {
		$links['privacy'][1] = get_privacy_policy_url();
	}
	if ( function_exists( 'bdc_get_header_footer_settings' ) ) {
		$s   = bdc_get_header_footer_settings();
		$map = array(
			'privacy'      => array( 'legal_links', 'privacy' ),
			'terms'        => array( 'legal_links', 'terms' ),
			'child_safety' => array( 'resources_links', 'child_safety' ),
			'photo_policy' => array( 'resources_links', 'photo_policy' ),
			'contact'      => array( 'explore_links', 'contact' ),
		);
		foreach ( $map as $key => $path ) {
			$url = isset( $s[ $path[0] ][ $path[1] ]['url'] ) ? trim( (string) $s[ $path[0] ][ $path[1] ]['url'] ) : '';
			if ( '' !== $url ) {
				$links[ $key ][1] = $url;
			}
		}
	}
	$links = apply_filters( 'bdd_portal_footer_links', $links );
	$out   = array();
	foreach ( $links as $key => $link ) {
		$url = esc_url_raw( (string) $link[1] );
		if ( '' !== $url ) {
			$out[] = array( 'key' => (string) $key, 'label' => (string) $link[0], 'url' => $url );
		}
	}
	return $out;
}

/* ---------- Download My Data ---------- */

/** A temporary file for downloads. wp_tempnam() lives in wp-admin/includes/file.php, which is not loaded on the front end. */
function bdd_temp_file() {
	if ( ! function_exists( 'wp_tempnam' ) && defined( 'ABSPATH' ) && file_exists( ABSPATH . 'wp-admin/includes/file.php' ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
	}
	if ( function_exists( 'wp_tempnam' ) ) {
		return wp_tempnam( 'bdd-export' );
	}
	$dir = function_exists( 'get_temp_dir' ) ? get_temp_dir() : sys_get_temp_dir();
	return tempnam( $dir, 'bdd-export' );
}


/**
 * Build the "Download My Data" file for one parent account: a ZIP with the portfolio data,
 * account settings, consent and share records, and the private photos. Falls back to a JSON
 * file when the server has no ZipArchive. Returns [ path, filename, mime ] of a temp file.
 */
function bdd_build_data_export( $user_id ) {
	$user_id = (int) $user_id;
	$user    = get_userdata( $user_id );
	$state   = bdd_get_state( $user_id );
	$state   = is_array( $state ) ? $state : array();
	$dir     = bdd_private_dir() . '/' . $user_id;
	$photos  = array();
	$files   = is_dir( $dir ) ? glob( $dir . '/*.{jpg,png,webp}', GLOB_BRACE ) : array();
	foreach ( (array) $files as $file ) {
		if ( is_file( $file ) ) {
			$photos[ basename( $file ) ] = $file;
		}
	}
	// Point photo links in the data at the files inside the download (no private URLs in the file).
	$fix = function ( $value ) use ( &$fix, $user_id ) {
		if ( is_array( $value ) ) {
			return array_map( $fix, $value );
		}
		if ( is_string( $value ) && preg_match( '#[?&]bd_photo=' . $user_id . '(?:/|%2F)([a-f0-9]{32}\.(?:jpg|png|webp))#i', $value, $m ) ) {
			return 'photos/' . $m[1];
		}
		return $value;
	};
	$json = (string) wp_json_encode( $fix( $state ), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

	$account = array(
		'exported_at'           => gmdate( 'c' ),
		'parent_name'           => $user ? $user->display_name : '',
		'parent_email'          => $user ? $user->user_email : '',
		'portfolio_private'     => true,
		'allow_email_share'     => bdd_allow_email_share( $user_id ),
		'show_photo_on_cover'   => bdd_show_photo_on_cover( $user_id ),
		'guardian_confirmation' => bdd_guardian_consent( $user_id ),
		'email_share_log'       => array_values( (array) get_user_meta( $user_id, 'bdd_share_log', true ) ),
		'deletion_log'          => array_values( (array) get_user_meta( $user_id, 'bdd_delete_log', true ) ),
	);
	$readme = "Bright Dreamers - My Data\n\nportfolio.json : your child's portfolio (profile, entries, goals, projects, achievements, skills)\naccount.json   : your account details, privacy settings, guardian confirmation, Email Share and deletion records\nphotos/        : the private photos from your child's portfolio\n\nThis file was downloaded from your private Parent Portal on " . gmdate( 'Y-m-d' ) . " (UTC).\n";
	$date   = gmdate( 'Y-m-d' );

	if ( class_exists( 'ZipArchive' ) ) {
		$tmp = bdd_temp_file();
		$zip = new ZipArchive();
		if ( true === $zip->open( $tmp, ZipArchive::OVERWRITE ) ) {
			$zip->addFromString( 'README.txt', $readme );
			$zip->addFromString( 'portfolio.json', $json );
			$zip->addFromString( 'account.json', wp_json_encode( $account, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) );
			foreach ( $photos as $name => $file ) {
				$zip->addFile( $file, 'photos/' . $name );
			}
			$zip->close();
			return array( $tmp, 'bright-dreamers-my-data-' . $date . '.zip', 'application/zip' );
		}
	}
	$tmp = bdd_temp_file();
	file_put_contents( $tmp, wp_json_encode( array( 'readme' => $readme, 'account' => $account, 'portfolio' => json_decode( $json, true ), 'photos_note' => 'Photos are not included in this file. Please contact us for a copy.' ), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); // phpcs:ignore
	return array( $tmp, 'bright-dreamers-my-data-' . $date . '.json', 'application/json' );
}
