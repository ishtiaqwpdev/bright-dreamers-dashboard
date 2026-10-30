<?php
/**
 * Plugin Name:       Bright Dreamers Parent Dashboard
 * Description:       Parent dashboard for Bright Dreamers: child portfolio, entries, projects, goals, skills, journey timeline, printable book and email sharing, with parent login and sign-up.
 * Version:           1.9.1
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Visiboom
 * Text Domain:       bright-dreamers-dashboard
 * License:           GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BDD_VERSION', '1.9.1' );
define( 'BDD_FILE', __FILE__ );
define( 'BDD_DIR', plugin_dir_path( __FILE__ ) );
define( 'BDD_URL', plugin_dir_url( __FILE__ ) );
define( 'BDD_META', 'bdd_portfolio' );
define( 'BDD_ROLE', 'bd_parent' );
define( 'BDD_SHORTCODE', 'bright_dreamers_dashboard' );

require_once BDD_DIR . 'includes/functions.php';
require_once BDD_DIR . 'includes/class-bdd-rest.php';
require_once BDD_DIR . 'includes/class-bdd-frontend.php';
require_once BDD_DIR . 'includes/class-bdd-book.php';
require_once BDD_DIR . 'includes/class-bdd-admin.php';

register_activation_hook( __FILE__, 'bdd_activate' );
add_action( 'plugins_loaded', 'bdd_maybe_upgrade' );
register_deactivation_hook( __FILE__, 'bdd_deactivate' );

/**
 * Activation: add the Parent role, default settings and the dashboard page.
 */
function bdd_activate() {
	add_role(
		BDD_ROLE,
		__( 'Parent', 'bright-dreamers-dashboard' ),
		array( 'read' => true )
	);

	$defaults = bdd_default_settings();
	$current  = get_option( 'bdd_settings' );
	update_option( 'bdd_settings', is_array( $current ) ? array_merge( $defaults, $current ) : $defaults );

	$page_id = (int) get_option( 'bdd_page_id' );
	if ( ! $page_id || 'page' !== get_post_type( $page_id ) || 'trash' === get_post_status( $page_id ) ) {
		$page_id = wp_insert_post(
			array(
				'post_title'   => __( 'Parent Dashboard', 'bright-dreamers-dashboard' ),
				'post_name'    => 'parent-dashboard',
				'post_content' => '[' . BDD_SHORTCODE . ']',
				'post_status'  => 'publish',
				'post_type'    => 'page',
			)
		);
		if ( $page_id && ! is_wp_error( $page_id ) ) {
			update_option( 'bdd_page_id', (int) $page_id );
		}
	}
}

/**
 * One-time upgrade for existing parents:
 * - store portfolio_private = true for everyone (1.3.0), including missing or false values;
 * - copy the old "Allow sharing by email" choice into bdd_allow_email_share (1.4.0);
 * - copy the old "Show photo on the portfolio cover" choice into bdd_show_photo_on_cover and
 *   move photos from the public Media Library to private copies (1.5.0).
 */
function bdd_maybe_upgrade() {
	if ( version_compare( (string) get_option( 'bdd_db_version', '0' ), '1.5.0', '>=' ) ) {
		return;
	}
	$user_ids = get_users(
		array(
			'meta_key' => BDD_META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'fields'   => 'ID',
			'number'   => -1,
		)
	);
	foreach ( $user_ids as $user_id ) {
		bdd_allow_email_share( (int) $user_id ); // Copies the old choice if the new field is missing.
		bdd_show_photo_on_cover( (int) $user_id ); // Same for the cover photo choice.
		bdd_migrate_photos_to_private( (int) $user_id );
		$state = bdd_get_state( (int) $user_id );
		if ( $state ) {
			bdd_save_state( (int) $user_id, $state );
		}
	}
	update_option( 'bdd_db_version', '1.5.0' );
}

function bdd_deactivate() {
	// Data, the page and the role are kept so nothing is lost if the plugin is turned back on.
}

BDD_Rest::init();
BDD_Frontend::init();
BDD_Admin::init();
