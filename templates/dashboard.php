<?php
/**
 * Full-screen dashboard page. The theme is not loaded here on purpose,
 * so its styles cannot change the dashboard design.
 *
 * @var array $boot Data prepared by BDD_Frontend::boot_data().
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$bdd_css_ver = BDD_VERSION . '.' . filemtime( BDD_DIR . 'assets/css/dashboard.css' );
$bdd_js_ver  = BDD_VERSION . '.' . filemtime( BDD_DIR . 'assets/js/dashboard.js' );
$bdd_icon    = get_site_icon_url( 64 );
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title><?php echo esc_html( sprintf( __( 'Parent Dashboard – %s', 'bright-dreamers-dashboard' ), get_bloginfo( 'name' ) ) ); ?></title>
<?php if ( $bdd_icon ) : ?><link rel="icon" href="<?php echo esc_url( $bdd_icon ); ?>"><?php endif; ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700;800&amp;family=Outfit:wght@400;500;600;700&amp;family=Caveat:wght@600;700&amp;display=swap">
<link rel="stylesheet" href="<?php echo esc_url( BDD_URL . 'assets/css/dashboard.css?ver=' . $bdd_css_ver ); ?>">
<style id="bd-page-size">@page{size:A4;margin:0}</style>
<?php do_action( 'bdd_head' ); ?>
</head>
<body class="bd-dashboard">
<div class="app" id="app">
  <aside class="side" id="side" aria-label="Dashboard navigation">
    <a class="side__logo" href="#dashboard"><img data-i="logo" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" width="440" height="251"></a>
    <nav class="nav" id="nav"></nav>
    <div class="side__quote"><img data-i="quote" alt="Big ideas, brighter futures!" width="239" height="303"></div>
  </aside>
  <div class="scrim" id="scrim"></div>
  <main class="main">
    <div class="wrap">
      <div class="top">
        <button class="iconbtn menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
        <h1 id="pageTitle">Parent Dashboard</h1>
        <div class="top__right">
          <button class="iconbtn" id="bellBtn" aria-label="Notifications" aria-expanded="false"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><span class="badge" id="bellCount" hidden></span></button>
          <button class="user" id="userBtn" aria-expanded="false"><img class="avatar" id="parentAvatar" alt=""><span id="parentName">Parent</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="pop" id="bellPop" hidden></div>
          <div class="pop" id="userPop" hidden></div>
        </div>
      </div>
      <section class="banner" id="banner"></section>
      <div id="view" class="view"></div>
      <footer class="pfoot" id="pfoot"></footer>
    </div>
  </main>
</div>
<div class="auth" id="auth" hidden></div>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<script>window.BD_DASH = <?php echo wp_json_encode( $boot, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ); ?>;</script>
<script src="<?php echo esc_url( BDD_URL . 'assets/js/dashboard.js?ver=' . $bdd_js_ver ); ?>"></script>
<?php do_action( 'bdd_footer' ); ?>
</body>
</html>
