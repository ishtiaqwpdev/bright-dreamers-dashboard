<?php
/**
 * REST API used by the dashboard (namespace bd/v1).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BDD_Rest {

	const NS = 'bd/v1';

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	public static function routes() {
		$logged_in = array( __CLASS__, 'can_use' );
		$public    = '__return_true';

		register_rest_route( self::NS, '/state', array(
			array( 'methods' => 'GET', 'callback' => array( __CLASS__, 'get_state' ), 'permission_callback' => $logged_in ),
			array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'save_state' ), 'permission_callback' => $logged_in ),
		) );
		register_rest_route( self::NS, '/upload', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'upload' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/account', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'account' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/email', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'email' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/clear', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'clear_entries' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/privacy', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'privacy' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/consent', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'consent' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/logout', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'logout' ), 'permission_callback' => $logged_in ) );
		register_rest_route( self::NS, '/login', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'login' ), 'permission_callback' => $public ) );
		register_rest_route( self::NS, '/register', array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'register' ), 'permission_callback' => $public ) );
	}

	public static function can_use() {
		return is_user_logged_in() && current_user_can( 'read' );
	}

	private static function error( $code, $message, $status = 400 ) {
		return new WP_Error( $code, $message, array( 'status' => $status ) );
	}

	/**
	 * Re-authentication for sensitive changes (password, email, delete): the user must enter their
	 * CURRENT password. Wrong attempts are limited (5 per 15 minutes per account). Generic message.
	 */
	private static function check_current_password( WP_REST_Request $req ) {
		$user = wp_get_current_user();
		$key  = 'bdd_rl_' . md5( 'reauth_' . $user->ID );
		if ( (int) get_transient( $key ) >= 5 ) {
			return self::error( 'bdd_reauth_limit', __( 'Too many incorrect password attempts. Please wait 15 minutes and try again.', 'bright-dreamers-dashboard' ), 429 );
		}
		$current = (string) $req->get_param( 'current_password' );
		if ( '' === $current || ! wp_check_password( $current, $user->user_pass, $user->ID ) ) {
			set_transient( $key, (int) get_transient( $key ) + 1, 15 * MINUTE_IN_SECONDS );
			return self::error( 'bdd_current_password', __( 'Your current password is not correct.', 'bright-dreamers-dashboard' ), 403 );
		}
		delete_transient( $key );
		return true;
	}

	private static function check_auth_nonce( WP_REST_Request $req ) {
		$nonce = (string) $req->get_param( 'nonce' );
		if ( ! wp_verify_nonce( $nonce, 'bdd_auth' ) ) {
			return self::error( 'bd_expired', __( 'This page has expired. Please refresh the page and try again.', 'bright-dreamers-dashboard' ), 403 );
		}
		return true;
	}

	/* ---------- Portfolio ---------- */

	public static function get_state( WP_REST_Request $req ) {
		return rest_ensure_response( array( 'state' => bdd_get_state( bdd_target_user_id( $req->get_param( 'parent' ) ) ) ) );
	}

	public static function save_state( WP_REST_Request $req ) {
		$user_id = bdd_target_user_id( $req->get_param( 'parent' ) );
		$old     = bdd_get_state( $user_id );
		$state   = bdd_validate_state( $req->get_param( 'state' ), $old, bdd_is_admin_user() );
		if ( is_wp_error( $state ) ) {
			return $state;
		}
		if ( bdd_is_bulk_clear( $state, $old ) ) {
			return self::error( 'bdd_use_clear', __( 'To remove every entry, use “Delete My Child’s Portfolio” in Account Settings.', 'bright-dreamers-dashboard' ), 400 );
		}
		// The parent / guardian confirmation is asked once before the child's profile is set up.
		// (Admins viewing a parent's portfolio are not asked; the parent confirms for themselves.)
		if ( ! bdd_is_admin_user() && ! bdd_guardian_consent( $user_id ) && bdd_profile_text_changed( $state, $old ) ) {
			return self::error( 'bdd_consent_required', __( 'Please confirm that you are this child’s parent or legal guardian on the Profile page first.', 'bright-dreamers-dashboard' ), 403 );
		}
		bdd_save_state( $user_id, $state );
		return rest_ensure_response( array( 'saved' => true ) );
	}

	/**
	 * Privacy & Data toggles (Account Settings): email sharing and the cover photo, saved per parent
	 * account as soon as they are switched. The portfolio itself is always private and cannot be changed here.
	 */
	public static function privacy( WP_REST_Request $req ) {
		$user_id = get_current_user_id();
		if ( null !== $req->get_param( 'allow_email_share' ) ) {
			bdd_set_allow_email_share( $user_id, filter_var( $req->get_param( 'allow_email_share' ), FILTER_VALIDATE_BOOLEAN ) );
		}
		if ( null !== $req->get_param( 'show_photo_on_cover' ) ) {
			bdd_set_show_photo_on_cover( $user_id, filter_var( $req->get_param( 'show_photo_on_cover' ), FILTER_VALIDATE_BOOLEAN ) );
		}
		$state = bdd_get_state( $user_id );
		if ( is_array( $state ) ) {
			bdd_save_state( $user_id, $state ); // keeps parent.share / parent.coverPhoto in step and portfolio_private = true
		}
		return rest_ensure_response(
			array(
				'portfolio_private'   => true,
				'allow_email_share'   => bdd_allow_email_share( $user_id ),
				'show_photo_on_cover' => bdd_show_photo_on_cover( $user_id ),
			)
		);
	}

	/**
	 * Parent / guardian confirmation, asked once (Profile page, for accounts that have not confirmed yet).
	 * Always recorded for the logged-in parent themselves, never for another account.
	 */
	public static function consent( WP_REST_Request $req ) {
		if ( ! filter_var( $req->get_param( 'consent_guardian' ), FILTER_VALIDATE_BOOLEAN ) ) {
			return self::error( 'bdd_consent_required', __( 'Please confirm this statement to continue.', 'bright-dreamers-dashboard' ), 400 );
		}
		$user_id = get_current_user_id();
		if ( ! bdd_guardian_consent( $user_id ) ) {
			bdd_record_guardian_consent( $user_id );
		}
		return rest_ensure_response( array( 'consent' => bdd_guardian_consent( $user_id ) ) );
	}

	/**
	 * "Delete portfolio" (Account Settings → Start over): deletes the entries, the child's profile and the private photo files.
	 * The parent account, settings and the guardian confirmation record are kept. Requires confirm_delete = 1.
	 * The REST nonce (X-WP-Nonce) check still applies to this route like every other.
	 */
	public static function clear_entries( WP_REST_Request $req ) {
		if ( ! filter_var( $req->get_param( 'confirm_delete' ), FILTER_VALIDATE_BOOLEAN ) ) {
			return self::error( 'bdd_confirm_delete', __( 'Please confirm this statement before deleting.', 'bright-dreamers-dashboard' ), 400 );
		}
		// Strong confirmation: the person deleting must also enter their own current password.
		$reauth = self::check_current_password( $req );
		if ( is_wp_error( $reauth ) ) {
			return $reauth;
		}
		$user_id = bdd_target_user_id( $req->get_param( 'parent' ) );
		$old     = bdd_get_state( $user_id );
		$old     = is_array( $old ) ? $old : array();
		$removed = isset( $old['entries'] ) && is_array( $old['entries'] ) ? count( $old['entries'] ) : 0;

		// 1. Private photo files first. If any file cannot be removed, stop and report it:
		//    nothing is shown as deleted, so the parent can try again.
		$files = bdd_delete_private_files( $user_id );
		if ( is_wp_error( $files ) ) {
			return self::error( 'bdd_delete_files', __( 'Some private files could not be deleted. Nothing else was changed. Please try again, or contact us if this keeps happening.', 'bright-dreamers-dashboard' ), 500 );
		}

		// 2. Portfolio data: every entry, the child's profile and the share history.
		//    Kept: the parent's account, settings, the guardian confirmation record and this deletion record (no content).
		bdd_save_state(
			$user_id,
			array(
				'demo'    => false,
				'profile' => array( 'name' => '', 'age' => '', 'location' => '', 'interests' => '', 'about' => '', 'dream' => '', 'quote' => '', 'photo' => 'k:profile' ),
				'parent'  => isset( $old['parent'] ) && is_array( $old['parent'] ) ? $old['parent'] : array(),
				'shares'  => array(),
				'read'    => array(),
				'entries' => array(),
			)
		);
		bdd_log_portfolio_clear( $user_id, get_current_user_id(), $removed, $files );
		return rest_ensure_response( array( 'cleared' => true, 'state' => bdd_get_state( $user_id ) ) );
	}

	/* ---------- Photos ---------- */

	public static function upload( WP_REST_Request $req ) {
		$user_id = get_current_user_id();
		$owner   = bdd_target_user_id( $req->get_param( 'parent' ) ); // An admin may upload for a parent.
		if ( bdd_hit_limit( 'upload_' . $user_id, (int) apply_filters( 'bdd_daily_upload_limit', 150 ), DAY_IN_SECONDS ) ) {
			return self::error( 'bdd_limit', __( 'You have uploaded a lot of photos today. Please try again tomorrow.', 'bright-dreamers-dashboard' ), 429 );
		}

		$data = (string) $req->get_param( 'image' );
		if ( ! preg_match( '#^data:image/(jpeg|png|webp);base64,#', $data ) ) {
			return self::error( 'bdd_bad_image', __( 'Choose a JPG or PNG photo.', 'bright-dreamers-dashboard' ) );
		}
		$binary = base64_decode( substr( $data, strpos( $data, ',' ) + 1 ), true );
		if ( false === $binary || strlen( $binary ) > 5 * MB_IN_BYTES ) {
			return self::error( 'bdd_bad_image', __( 'That photo is too large. Choose a smaller photo.', 'bright-dreamers-dashboard' ) );
		}
		$info  = @getimagesizefromstring( $binary ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		$types = array( 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp' );
		if ( ! $info || empty( $info['mime'] ) || ! isset( $types[ $info['mime'] ] ) ) {
			return self::error( 'bdd_bad_image', __( 'That file is not a photo we can use. Choose a JPG or PNG photo.', 'bright-dreamers-dashboard' ) );
		}

		// Private storage: not in the Media Library, no public URL.
		$url = bdd_store_private_photo( $owner, $binary, $types[ $info['mime'] ] );
		if ( is_wp_error( $url ) ) {
			return self::error( 'bdd_upload_failed', __( 'The photo could not be saved. Please try again.', 'bright-dreamers-dashboard' ), 500 );
		}

		return rest_ensure_response( array( 'url' => $url ) );
	}

	/* ---------- Account ---------- */

	public static function account( WP_REST_Request $req ) {
		$user     = wp_get_current_user();
		$name     = sanitize_text_field( (string) $req->get_param( 'name' ) );
		$email    = sanitize_email( (string) $req->get_param( 'email' ) );
		$password = (string) $req->get_param( 'password' );

		if ( ! is_email( $email ) ) {
			return self::error( 'bdd_email', __( 'Enter a valid email address.', 'bright-dreamers-dashboard' ) );
		}
		$owner = email_exists( $email );
		if ( $owner && (int) $owner !== (int) $user->ID ) {
			return self::error( 'bdd_email_taken', __( 'Another account already uses this email.', 'bright-dreamers-dashboard' ) );
		}
		if ( '' !== $password && strlen( $password ) < 6 ) {
			return self::error( 'bdd_password', __( 'Password must be at least 6 characters.', 'bright-dreamers-dashboard' ) );
		}
		$confirm = $req->get_param( 'password_confirm' );
		if ( '' !== $password && null !== $confirm && (string) $confirm !== $password ) {
			return self::error( 'bdd_password_match', __( 'The new passwords do not match.', 'bright-dreamers-dashboard' ) );
		}
		// Changing the password or the login email needs the current password (server-side re-authentication).
		$email_changed = strtolower( $email ) !== strtolower( (string) $user->user_email );
		if ( '' !== $password || $email_changed ) {
			$reauth = self::check_current_password( $req );
			if ( is_wp_error( $reauth ) ) {
				return $reauth;
			}
		}

		// Parent / guardian confirmation: required once before Account Settings can be saved.
		$had_consent = (bool) bdd_guardian_consent( $user->ID );
		if ( ! $had_consent && ! filter_var( $req->get_param( 'consent_guardian' ), FILTER_VALIDATE_BOOLEAN ) ) {
			return self::error( 'bdd_consent_required', __( 'Please confirm this statement to continue.', 'bright-dreamers-dashboard' ), 403 );
		}

		$state = $req->get_param( 'state' );

		// "Allow me to share portfolio copies by email": saved per parent account.
		$allow_share = $req->get_param( 'allow_email_share' );
		if ( null === $allow_share && is_array( $state ) && isset( $state['parent']['share'] ) ) {
			$allow_share = $state['parent']['share'];
		}
		if ( null !== $allow_share ) {
			bdd_set_allow_email_share( $user->ID, filter_var( $allow_share, FILTER_VALIDATE_BOOLEAN ) );
		}

		// "Show my child's photo on the private portfolio cover": saved per parent account.
		$show_photo = $req->get_param( 'show_photo_on_cover' );
		if ( null === $show_photo && is_array( $state ) && isset( $state['parent']['coverPhoto'] ) ) {
			$show_photo = $state['parent']['coverPhoto'];
		}
		if ( null !== $show_photo ) {
			bdd_set_show_photo_on_cover( $user->ID, filter_var( $show_photo, FILTER_VALIDATE_BOOLEAN ) );
		}

		if ( null !== $state ) {
			$old_state = bdd_get_state( $user->ID );
			$state     = bdd_validate_state( $state, $old_state, bdd_is_admin_user( $user ) );
			if ( is_wp_error( $state ) ) {
				return $state;
			}
			if ( bdd_is_bulk_clear( $state, $old_state ) ) {
				return self::error( 'bdd_use_clear', __( 'To remove every entry, use “Delete My Child’s Portfolio” in Account Settings.', 'bright-dreamers-dashboard' ), 400 );
			}
			bdd_save_state( $user->ID, $state );
		}

		$update = array(
			'ID'           => $user->ID,
			'user_email'   => $email,
			'display_name' => '' !== $name ? $name : $user->display_name,
			'first_name'   => '' !== $name ? strtok( $name, ' ' ) : $user->first_name,
		);
		if ( '' !== $password ) {
			$update['user_pass'] = $password;
		}
		$result = wp_update_user( $update );
		if ( is_wp_error( $result ) ) {
			return self::error( 'bdd_account', $result->get_error_message() );
		}

		if ( ! $had_consent ) {
			bdd_record_guardian_consent( $user->ID ); // Saved once, after a successful save.
		}
		// After a password change, sign out every other session of this account (other browsers / devices).
		if ( '' !== $password && class_exists( 'WP_Session_Tokens' ) && function_exists( 'wp_get_session_token' ) ) {
			WP_Session_Tokens::get_instance( $user->ID )->destroy_others( wp_get_session_token() );
		}

		$fresh = get_userdata( $user->ID );
		return rest_ensure_response(
			array(
				'name'              => $fresh->display_name,
				'email'             => $fresh->user_email,
				'allow_email_share' => bdd_allow_email_share( $user->ID ),
				'show_photo_on_cover' => bdd_show_photo_on_cover( $user->ID ),
				'consent'           => bdd_guardian_consent( $user->ID ),
			)
		);
	}

	/* ---------- Email sharing ---------- */

	public static function email( WP_REST_Request $req ) {
		if ( ! bdd_setting( 'allow_email' ) ) {
			return self::error( 'bdd_email_off', __( 'Sending email is turned off on this website.', 'bright-dreamers-dashboard' ), 403 );
		}
		if ( ! bdd_allow_email_share( get_current_user_id() ) ) {
			return self::error( 'bdd_share_off', __( 'Email sharing is turned off for your account. Turn on “Allow me to share portfolio copies by email” in Account Settings to send a copy.', 'bright-dreamers-dashboard' ), 403 );
		}
		// The parent must confirm each send ("I understand that this will send a copy...").
		if ( ! filter_var( $req->get_param( 'confirm_share' ), FILTER_VALIDATE_BOOLEAN ) ) {
			return self::error( 'bdd_confirm_required', __( 'Please confirm this statement before sending.', 'bright-dreamers-dashboard' ), 400 );
		}
		$user = wp_get_current_user();
		$to   = array_values( array_filter( array_map( 'sanitize_email', (array) $req->get_param( 'to' ) ), 'is_email' ) );
		if ( ! $to || count( $to ) > 5 ) {
			return self::error( 'bdd_to', __( 'Enter between one and five email addresses.', 'bright-dreamers-dashboard' ) );
		}
		$subject = sanitize_text_field( (string) $req->get_param( 'subject' ) );
		$body    = sanitize_textarea_field( (string) $req->get_param( 'body' ) );
		if ( '' === $subject ) {
			$subject = sprintf( __( 'A Bright Dreamers portfolio from %s', 'bright-dreamers-dashboard' ), $user->display_name );
		}
		if ( strlen( $body ) > 8000 ) {
			return self::error( 'bdd_long', __( 'The message is too long.', 'bright-dreamers-dashboard' ) );
		}
		if ( bdd_hit_limit( 'email_' . $user->ID, max( 1, (int) bdd_setting( 'email_limit' ) ), DAY_IN_SECONDS ) ) {
			return self::error( 'bdd_limit', __( 'You have reached today\'s email limit. Please try again tomorrow.', 'bright-dreamers-dashboard' ), 429 );
		}

		$reply_name = trim( str_replace( array( "\r", "\n", '<', '>', '"' ), '', $user->display_name ) );
		$headers    = array( 'Reply-To: ' . ( $reply_name ? '"' . $reply_name . '" ' : '' ) . '<' . $user->user_email . '>' );
		$body      .= "\n\n—\n" . sprintf( __( 'Sent by %1$s from %2$s', 'bright-dreamers-dashboard' ), $user->display_name, get_bloginfo( 'name' ) );

		if ( ! wp_mail( $to, $subject, $body, $headers ) ) {
			return self::error( 'bdd_mail_failed', __( 'The website could not send the email. Please ask the site team to check the email settings.', 'bright-dreamers-dashboard' ), 500 );
		}
		bdd_log_email_share( $user->ID, $to );
		return rest_ensure_response( array( 'sent' => true ) );
	}

	/* ---------- Log in / sign up / log out ---------- */

	public static function login( WP_REST_Request $req ) {
		$check = self::check_auth_nonce( $req );
		if ( is_wp_error( $check ) ) {
			return $check;
		}
		if ( bdd_hit_limit( 'login_' . bdd_client_ip(), 20, 15 * MINUTE_IN_SECONDS ) ) {
			return self::error( 'bdd_limit', __( 'Too many attempts. Please wait a few minutes and try again.', 'bright-dreamers-dashboard' ), 429 );
		}
		$login = sanitize_text_field( (string) $req->get_param( 'email' ) );
		$user  = wp_signon(
			array(
				'user_login'    => $login,
				'user_password' => (string) $req->get_param( 'password' ),
				'remember'      => (bool) $req->get_param( 'remember' ),
			),
			is_ssl()
		);
		if ( is_wp_error( $user ) ) {
			return self::error( 'bdd_login', __( 'That email or password is not right. Please try again.', 'bright-dreamers-dashboard' ), 403 );
		}
		return rest_ensure_response( array( 'ok' => true ) );
	}

	public static function register( WP_REST_Request $req ) {
		if ( ! bdd_setting( 'allow_register' ) ) {
			return self::error( 'bdd_closed', __( 'New sign-ups are closed. Please contact us to get an account.', 'bright-dreamers-dashboard' ), 403 );
		}
		$check = self::check_auth_nonce( $req );
		if ( is_wp_error( $check ) ) {
			return $check;
		}
		if ( bdd_hit_limit( 'register_' . bdd_client_ip(), 5, HOUR_IN_SECONDS ) ) {
			return self::error( 'bdd_limit', __( 'Too many sign-ups from this connection. Please try again later.', 'bright-dreamers-dashboard' ), 429 );
		}

		$name     = sanitize_text_field( (string) $req->get_param( 'name' ) );
		$child    = sanitize_text_field( (string) $req->get_param( 'child' ) );
		$email    = sanitize_email( (string) $req->get_param( 'email' ) );
		$password = (string) $req->get_param( 'password' );

		if ( '' === $name || '' === $child || '' === $email || '' === $password ) {
			return self::error( 'bdd_fields', __( 'Please fill in every field.', 'bright-dreamers-dashboard' ) );
		}
		if ( ! is_email( $email ) ) {
			return self::error( 'bdd_email', __( 'Enter a valid email address.', 'bright-dreamers-dashboard' ) );
		}
		if ( email_exists( $email ) ) {
			return self::error( 'bdd_email_taken', __( 'An account with this email already exists. Please log in instead.', 'bright-dreamers-dashboard' ) );
		}
		if ( strlen( $password ) < 6 ) {
			return self::error( 'bdd_password', __( 'Password must be at least 6 characters.', 'bright-dreamers-dashboard' ) );
		}
		// Parent / guardian confirmation: required once, when the child's portfolio is first created.
		if ( ! filter_var( $req->get_param( 'consent_guardian' ), FILTER_VALIDATE_BOOLEAN ) ) {
			return self::error( 'bdd_consent_required', __( 'Please confirm this statement to continue.', 'bright-dreamers-dashboard' ), 403 );
		}

		$base = sanitize_user( strstr( $email, '@', true ), true );
		$base = $base ? $base : 'parent';
		$login = $base;
		$n     = 1;
		while ( username_exists( $login ) ) {
			$login = $base . $n++;
		}

		$user_id = wp_insert_user(
			array(
				'user_login'   => $login,
				'user_email'   => $email,
				'user_pass'    => $password,
				'display_name' => $name,
				'first_name'   => strtok( $name, ' ' ),
				'role'         => BDD_ROLE,
			)
		);
		if ( is_wp_error( $user_id ) ) {
			return self::error( 'bdd_register', $user_id->get_error_message() );
		}

		bdd_save_state(
			$user_id,
			array(
				'demo'    => false,
				'portfolio_private' => true,
				'profile' => array( 'name' => $child, 'age' => '', 'location' => '', 'interests' => '', 'about' => '', 'dream' => '', 'quote' => '', 'photo' => 'k:profile' ),
				'parent'  => array( 'name' => $name, 'email' => $email, 'share' => true, 'coverPhoto' => true, 'privateEntries' => true ),
				'shares'  => array(),
				'read'    => array(),
				'entries' => array(),
			)
		);

		bdd_record_guardian_consent( $user_id );
		wp_new_user_notification( $user_id, null, 'admin' );
		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id, true, is_ssl() );
		do_action( 'bdd_parent_registered', $user_id );

		return rest_ensure_response( array( 'ok' => true ) );
	}

	public static function logout() {
		wp_logout();
		return rest_ensure_response( array( 'ok' => true ) );
	}
}
