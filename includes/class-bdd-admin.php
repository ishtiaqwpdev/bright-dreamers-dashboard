<?php
/**
 * Settings screen (Settings → Parent Dashboard) and a Users list column.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BDD_Admin {

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( BDD_FILE ), array( __CLASS__, 'links' ) );
		add_filter( 'manage_users_columns', array( __CLASS__, 'user_column' ) );
		add_filter( 'manage_users_custom_column', array( __CLASS__, 'user_column_value' ), 10, 3 );
		add_filter( 'display_post_states', array( __CLASS__, 'post_state' ), 10, 2 );
		add_filter( 'user_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_post_bdd_remove_public_photos', array( __CLASS__, 'remove_public_photos' ) );
	}

	public static function menu() {
		add_options_page(
			__( 'Parent Dashboard', 'bright-dreamers-dashboard' ),
			__( 'Parent Dashboard', 'bright-dreamers-dashboard' ),
			'manage_options',
			'bdd-settings',
			array( __CLASS__, 'page' )
		);
	}

	public static function links( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=bdd-settings' ) ) . '">' . esc_html__( 'Settings', 'bright-dreamers-dashboard' ) . '</a>' );
		return $links;
	}

	public static function register() {
		register_setting( 'bdd_settings_group', 'bdd_settings', array( 'sanitize_callback' => array( __CLASS__, 'sanitize' ) ) );
		register_setting( 'bdd_settings_group', 'bdd_page_id', array( 'sanitize_callback' => 'absint' ) );
	}

	public static function sanitize( $input ) {
		$input = is_array( $input ) ? $input : array();
		return array(
			'allow_register' => empty( $input['allow_register'] ) ? 0 : 1,
			'allow_email'    => empty( $input['allow_email'] ) ? 0 : 1,
			'email_limit'    => max( 1, min( 100, absint( isset( $input['email_limit'] ) ? $input['email_limit'] : 10 ) ) ),
			'block_admin'    => empty( $input['block_admin'] ) ? 0 : 1,
		);
	}

	public static function page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$page_id = (int) get_option( 'bdd_page_id' );
		$parents = count_users();
		$parents = isset( $parents['avail_roles'][ BDD_ROLE ] ) ? (int) $parents['avail_roles'][ BDD_ROLE ] : 0;
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Bright Dreamers Parent Dashboard', 'bright-dreamers-dashboard' ); ?></h1>
			<p>
				<?php esc_html_e( 'Dashboard link:', 'bright-dreamers-dashboard' ); ?>
				<a href="<?php echo esc_url( bdd_dashboard_url() ); ?>" target="_blank" rel="noopener"><?php echo esc_html( bdd_dashboard_url() ); ?></a>
				&nbsp;·&nbsp;
				<?php
				/* translators: %d: number of parent accounts */
				printf( esc_html( _n( '%d parent account', '%d parent accounts', $parents, 'bright-dreamers-dashboard' ) ), (int) $parents );
				?>
			</p>
			<form method="post" action="options.php">
				<?php settings_fields( 'bdd_settings_group' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="bdd_page_id"><?php esc_html_e( 'Dashboard page', 'bright-dreamers-dashboard' ); ?></label></th>
						<td>
							<?php
							wp_dropdown_pages(
								array(
									'name'              => 'bdd_page_id',
									'id'                => 'bdd_page_id',
									'selected'          => $page_id,
									'show_option_none'  => __( '— Select —', 'bright-dreamers-dashboard' ),
									'option_none_value' => 0,
								)
							);
							?>
							<p class="description"><?php printf( esc_html__( 'This page shows the dashboard full screen. You can also put the shortcode %s on any page.', 'bright-dreamers-dashboard' ), '<code>[' . esc_html( BDD_SHORTCODE ) . ']</code>' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Parent sign-up', 'bright-dreamers-dashboard' ); ?></th>
						<td><label><input type="checkbox" name="bdd_settings[allow_register]" value="1" <?php checked( bdd_setting( 'allow_register' ) ); ?>> <?php esc_html_e( 'Show “Create Account” so parents can sign up themselves', 'bright-dreamers-dashboard' ); ?></label></td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Email sharing', 'bright-dreamers-dashboard' ); ?></th>
						<td>
							<label><input type="checkbox" name="bdd_settings[allow_email]" value="1" <?php checked( bdd_setting( 'allow_email' ) ); ?>> <?php esc_html_e( 'Let parents send their child’s portfolio by email from the website', 'bright-dreamers-dashboard' ); ?></label>
							<p><label><?php esc_html_e( 'Emails per parent per day', 'bright-dreamers-dashboard' ); ?> <input type="number" min="1" max="100" class="small-text" name="bdd_settings[email_limit]" value="<?php echo esc_attr( bdd_setting( 'email_limit' ) ); ?>"></label></p>
							<p class="description"><?php esc_html_e( 'Uses the website’s normal email. An SMTP plugin is recommended so emails reach inboxes.', 'bright-dreamers-dashboard' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Keep parents out of wp-admin', 'bright-dreamers-dashboard' ); ?></th>
						<td><label><input type="checkbox" name="bdd_settings[block_admin]" value="1" <?php checked( bdd_setting( 'block_admin' ) ); ?>> <?php esc_html_e( 'Send parents to the dashboard instead of the WordPress admin area', 'bright-dreamers-dashboard' ); ?></label></td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
			<hr>
			<h2><?php esc_html_e( 'Verifying achievements, skills, projects and goals', 'bright-dreamers-dashboard' ); ?></h2>
			<p><?php esc_html_e( 'Parents can choose “Outside Activity” or “Personal / Family” as the source of an achievement, a skill / talent, a project or a goal. Only admins see “Bright Dreamers / Verified by Bright Dreamers”.', 'bright-dreamers-dashboard' ); ?></p>
			<p><?php esc_html_e( 'To add or verify an entry for a parent, go to Users, hover over the parent and click “Open portfolio”. Edit the achievement and set the source to “Bright Dreamers / Verified by Bright Dreamers”. The parent then sees a “Verified by Bright Dreamers” badge and cannot change the source.', 'bright-dreamers-dashboard' ); ?></p>
			<hr>
			<h2><?php esc_html_e( 'Parent / guardian confirmation', 'bright-dreamers-dashboard' ); ?></h2>
			<p><?php esc_html_e( 'Before saving Account Settings for the first time, parents confirm that they are the child’s parent or legal guardian (or authorized by them). The confirmation and its date are saved on the parent’s account.', 'bright-dreamers-dashboard' ); ?></p>
			<?php if ( function_exists( 'get_privacy_policy_url' ) && get_privacy_policy_url() ) : ?>
				<p><?php esc_html_e( 'Privacy Policy link shown to parents:', 'bright-dreamers-dashboard' ); ?> <a href="<?php echo esc_url( get_privacy_policy_url() ); ?>" target="_blank" rel="noopener"><?php echo esc_html( get_privacy_policy_url() ); ?></a></p>
			<?php else : ?>
				<div class="notice notice-warning inline"><p><?php esc_html_e( 'No Privacy Policy page is set, so parents do not see a Privacy Policy link. Choose the page in Settings → Privacy.', 'bright-dreamers-dashboard' ); ?> <a href="<?php echo esc_url( admin_url( 'options-privacy.php' ) ); ?>"><?php esc_html_e( 'Open Privacy settings', 'bright-dreamers-dashboard' ); ?></a></p></div>
			<?php endif; ?>
			<hr>
			<h2><?php esc_html_e( 'Private photos', 'bright-dreamers-dashboard' ); ?></h2>
			<p><?php esc_html_e( 'Parent photos are stored privately and are only shown to the logged-in parent or an admin. Photos uploaded before version 1.5.0 were copied to private storage automatically.', 'bright-dreamers-dashboard' ); ?></p>
			<?php
			$removable = bdd_removable_public_photos();
			if ( isset( $_GET['bdd_removed'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				/* translators: %d: number of photos */
				echo '<div class="notice notice-success inline"><p>' . esc_html( sprintf( _n( '%d old public photo copy was removed.', '%d old public photo copies were removed.', absint( $_GET['bdd_removed'] ), 'bright-dreamers-dashboard' ), absint( $_GET['bdd_removed'] ) ) ) . '</p></div>'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			}
			if ( $removable ) :
				?>
				<p><strong>
				<?php
				/* translators: %d: number of photos */
				printf( esc_html( _n( '%d old copy of a parent photo is still public in the Media Library.', '%d old copies of parent photos are still public in the Media Library.', count( $removable ), 'bright-dreamers-dashboard' ) ), count( $removable ) );
				?>
				</strong> <?php esc_html_e( 'The dashboards already use the private copies. Removing the old copies deletes them from the Media Library and cannot be undone.', 'bright-dreamers-dashboard' ); ?></p>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
					<input type="hidden" name="action" value="bdd_remove_public_photos">
					<?php wp_nonce_field( 'bdd_remove_public_photos' ); ?>
					<?php submit_button( __( 'Remove old public photo copies', 'bright-dreamers-dashboard' ), 'delete', 'submit', false ); ?>
				</form>
			<?php else : ?>
				<p><?php esc_html_e( 'There are no public copies of parent photos in the Media Library.', 'bright-dreamers-dashboard' ); ?></p>
			<?php endif; ?>

		</div>
		<?php
	}

	/**
	 * "Open portfolio" link on the Users screen, so staff can add or verify entries for a parent.
	 */
	public static function portfolio_url( $user_id ) {
		return add_query_arg( 'bd_parent', (int) $user_id, bdd_dashboard_url() );
	}

	public static function row_actions( $actions, $user ) {
		if ( bdd_is_admin_user() && ( bdd_is_parent( $user ) || bdd_get_state( $user->ID ) ) ) {
			$actions['bdd_portfolio'] = '<a href="' . esc_url( self::portfolio_url( $user->ID ) ) . '" target="_blank" rel="noopener">' . esc_html__( 'Open portfolio', 'bright-dreamers-dashboard' ) . '</a>';
		}
		return $actions;
	}

	public static function remove_public_photos() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'bright-dreamers-dashboard' ) );
		}
		check_admin_referer( 'bdd_remove_public_photos' );
		$removed = 0;
		foreach ( bdd_removable_public_photos() as $id ) {
			if ( wp_delete_attachment( $id, true ) ) {
				$removed++;
			}
		}
		wp_safe_redirect( add_query_arg( array( 'page' => 'bdd-settings', 'bdd_removed' => $removed ), admin_url( 'options-general.php' ) ) );
		exit;
	}

	public static function user_column( $columns ) {
		$columns['bdd_entries'] = __( 'Portfolio entries', 'bright-dreamers-dashboard' );
		$columns['bdd_shares']  = __( 'Email shares', 'bright-dreamers-dashboard' );
		return $columns;
	}

	public static function user_column_value( $value, $column, $user_id ) {
		if ( 'bdd_shares' === $column ) {
			// Audit log: recipients and dates only, never the portfolio contents.
			$log = get_user_meta( $user_id, 'bdd_share_log', true );
			if ( ! is_array( $log ) || ! $log ) {
				return '—';
			}
			$last  = end( $log );
			$title = array();
			foreach ( array_slice( array_reverse( $log ), 0, 10 ) as $row ) {
				$title[] = wp_date( 'j M Y H:i', (int) $row['sent_at'] ) . ' → ' . implode( ', ', (array) $row['recipients'] ) . ( ! empty( $row['confirmed'] ) ? ' (confirmed)' : '' );
			}
			/* translators: 1: number of sends, 2: date of last send */
			return '<span title="' . esc_attr( implode( "\n", $title ) ) . '">' . esc_html( sprintf( __( '%1$d · last %2$s', 'bright-dreamers-dashboard' ), count( $log ), wp_date( 'j M Y', (int) $last['sent_at'] ) ) ) . '</span>';
		}
		if ( 'bdd_entries' !== $column ) {
			return $value;
		}
		$state = bdd_get_state( $user_id );
		if ( ! $state ) {
			return '—';
		}
		$count = 0;
		foreach ( $state['entries'] as $entry ) {
			if ( isset( $entry['type'] ) && 'skill' !== $entry['type'] ) {
				$count++;
			}
		}
		return bdd_is_admin_user() ? '<a href="' . esc_url( self::portfolio_url( $user_id ) ) . '" target="_blank" rel="noopener">' . (int) $count . '</a>' : (string) $count;
	}

	public static function post_state( $states, $post ) {
		if ( (int) $post->ID === (int) get_option( 'bdd_page_id' ) ) {
			$states['bdd'] = __( 'Parent Dashboard', 'bright-dreamers-dashboard' );
		}
		return $states;
	}
}
