<?php
/**
 * Front end: shows the dashboard as its own full-screen page so the theme's
 * styles never touch the design.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BDD_Frontend {

	public static function init() {
		add_shortcode( BDD_SHORTCODE, array( __CLASS__, 'shortcode' ) );
		add_action( 'init', array( __CLASS__, 'maybe_serve_photo' ), 1 );
		add_action( 'init', array( __CLASS__, 'maybe_render_book' ), 20 );
		add_filter( 'query_vars', array( __CLASS__, 'query_vars' ) );
		add_action( 'template_redirect', array( __CLASS__, 'maybe_render' ), 1 );
		add_filter( 'show_admin_bar', array( __CLASS__, 'admin_bar' ) );
		add_action( 'admin_init', array( __CLASS__, 'block_admin' ) );
		add_filter( 'login_redirect', array( __CLASS__, 'login_redirect' ), 10, 3 );
	}

	/**
	 * Private photos: /?bd_photo=<owner id>/<file>. Sent only to the logged-in owner or an admin.
	 */
	public static function maybe_serve_photo() {
		if ( ! isset( $_GET['bd_photo'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}
		$ref = bdd_parse_private_photo_ref( sanitize_text_field( wp_unslash( $_GET['bd_photo'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		header( 'X-Robots-Tag: noindex, nofollow' );
		if ( ! $ref ) {
			status_header( 404 );
			exit;
		}
		list( $owner, $name ) = $ref;
		if ( ! bdd_can_view_private_photo( $owner ) ) {
			status_header( 403 );
			header( 'Cache-Control: no-store' );
			echo 'This photo is private.';
			exit;
		}
		$path = bdd_private_dir() . '/' . $owner . '/' . $name;
		if ( ! is_file( $path ) ) {
			status_header( 404 );
			exit;
		}
		$mimes = array( 'jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp' );
		status_header( 200 );
		header( 'Content-Type: ' . $mimes[ pathinfo( $name, PATHINFO_EXTENSION ) ] );
		header( 'Content-Length: ' . filesize( $path ) );
		header( 'Cache-Control: private, max-age=3600' );
		header( 'X-Content-Type-Options: nosniff' );
		header( 'Content-Disposition: inline' );
		readfile( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
		exit;
	}

	/**
	 * Printable book for "Print / Save as PDF": /?bd_book=1&paper=a4|letter.
	 */
	public static function maybe_render_book() {
		if ( ! isset( $_GET['bd_book'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}
		if ( ! is_user_logged_in() ) {
			wp_safe_redirect( bdd_dashboard_url() );
			exit;
		}
		$parent = isset( $_GET['bd_parent'] ) ? absint( wp_unslash( $_GET['bd_parent'] ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$paper  = ( isset( $_GET['paper'] ) && 'letter' === $_GET['paper'] ) ? 'letter' : 'a4'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		BDD_Book::render( bdd_target_user_id( $parent ), $paper );
		exit;
	}

	public static function query_vars( $vars ) {
		$vars[] = 'bd_dashboard';
		return $vars;
	}

	/**
	 * Is the current request a page that holds the dashboard?
	 */
	private static function is_dashboard_request() {
		if ( get_query_var( 'bd_dashboard' ) ) {
			return true;
		}
		if ( ! is_singular() ) {
			return false;
		}
		$post = get_queried_object();
		if ( ! $post instanceof WP_Post ) {
			return false;
		}
		if ( (int) $post->ID === (int) get_option( 'bdd_page_id' ) ) {
			return true;
		}
		return has_shortcode( $post->post_content, BDD_SHORTCODE );
	}

	public static function maybe_render() {
		if ( ! self::is_dashboard_request() || post_password_required() ) {
			return;
		}
		self::render();
		exit;
	}

	/**
	 * Fallback when the shortcode is printed inside a theme template or builder area.
	 */
	public static function shortcode() {
		$url = add_query_arg( 'bd_dashboard', '1', home_url( '/' ) );
		return '<iframe src="' . esc_url( $url ) . '" title="' . esc_attr__( 'Parent Dashboard', 'bright-dreamers-dashboard' ) . '" style="display:block;width:100%;height:100vh;min-height:720px;border:0" loading="lazy"></iframe>';
	}

	/**
	 * Everything the dashboard script needs on load.
	 */
	public static function boot_data() {
		$user      = wp_get_current_user();
		$logged_in = $user->exists();
		$is_admin  = $logged_in && bdd_is_admin_user( $user );

		// Admins can open a parent's portfolio with ?bd_parent=<user ID>.
		$acting = null;
		if ( $is_admin && isset( $_GET['bd_parent'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$parent_id = absint( wp_unslash( $_GET['bd_parent'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$parent    = $parent_id ? get_userdata( $parent_id ) : false;
			if ( $parent && $parent_id !== (int) $user->ID ) {
				$acting = array(
					'id'    => $parent_id,
					'name'  => $parent->display_name,
					'email' => $parent->user_email,
				);
			}
		}
		$state = $logged_in ? bdd_get_state( $acting ? $acting['id'] : $user->ID ) : null;

		return array(
			'loggedIn'    => $logged_in,
			'rest'        => esc_url_raw( rest_url( BDD_Rest::NS . '/' ) ),
			'nonce'       => $logged_in ? wp_create_nonce( 'wp_rest' ) : '',
			'authNonce'   => wp_create_nonce( 'bdd_auth' ),
			'imgs'        => bdd_image_urls(),
			'canRegister' => (bool) bdd_setting( 'allow_register' ),
			'canEmail'    => (bool) bdd_setting( 'allow_email' ),
			'lostUrl'     => wp_lostpassword_url( bdd_dashboard_url() ),
			'siteName'    => wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ),
			'homeUrl'     => home_url( '/' ),
			'user'        => $acting ? array( 'name' => $acting['name'], 'email' => $acting['email'] ) : ( $logged_in ? array( 'name' => $user->display_name, 'email' => $user->user_email ) : null ),
			'isAdmin'     => $is_admin,
			'allowEmailShare' => $logged_in ? bdd_allow_email_share( $acting ? $acting['id'] : $user->ID ) : false,
			'showCoverPhoto'  => $logged_in ? bdd_show_photo_on_cover( $acting ? $acting['id'] : $user->ID ) : false,
			'consent'         => $logged_in ? bdd_guardian_consent( $user->ID ) : null,
			'privacyUrl'      => function_exists( 'get_privacy_policy_url' ) ? get_privacy_policy_url() : '',
			'bookUrl'         => $logged_in ? add_query_arg( array_filter( array( 'bd_book' => 1, 'bd_parent' => $acting ? $acting['id'] : 0 ) ), home_url( '/' ) ) : '',
			'actingFor'   => $acting,
			'adminUrl'    => $is_admin ? admin_url( 'users.php?role=' . BDD_ROLE ) : '',
			'state'       => $state,
		);
	}

	public static function render() {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
		nocache_headers();
		status_header( 200 );
		header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );
		header( 'X-Frame-Options: SAMEORIGIN' );

		$boot = self::boot_data();
		include BDD_DIR . 'templates/dashboard.php';
	}

	/* ---------- Parents stay on the dashboard ---------- */

	public static function admin_bar( $show ) {
		return bdd_is_parent() && ! current_user_can( 'edit_posts' ) ? false : $show;
	}

	public static function block_admin() {
		if ( ! bdd_setting( 'block_admin' ) || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return;
		}
		if ( bdd_is_parent() && ! current_user_can( 'edit_posts' ) ) {
			wp_safe_redirect( bdd_dashboard_url() );
			exit;
		}
	}

	public static function login_redirect( $redirect_to, $requested, $user ) {
		if ( $user instanceof WP_User && bdd_is_parent( $user ) && ! user_can( $user, 'edit_posts' ) ) {
			return bdd_dashboard_url();
		}
		return $redirect_to;
	}
}
