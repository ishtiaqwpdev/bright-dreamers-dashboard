<?php
/**
 * Runs when the plugin is deleted from Plugins → Installed Plugins.
 * Removes settings only. Parent accounts, their portfolios and uploaded photos are kept.
 */
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
delete_option( 'bdd_settings' );
