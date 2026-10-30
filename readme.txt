=== Bright Dreamers Parent Dashboard ===
Requires at least: 5.8
Requires PHP: 7.4
Stable tag: 1.9.0
License: GPLv2 or later

Parent dashboard for Bright Dreamers: a child's portfolio with entries, projects, goals, skills, a journey timeline, a printable book and email sharing.

== Installation ==
1. Plugins → Add New → Upload Plugin → choose bright-dreamers-dashboard.zip → Install → Activate.
2. A page called "Parent Dashboard" (/parent-dashboard/) is created automatically.
3. Settings → Parent Dashboard: choose the page, turn parent sign-up and email sharing on or off.
4. Add a menu link to the Parent Dashboard page so parents can find it.

== How it works ==
* The dashboard opens as its own full-screen page. The theme is not loaded on that page, so the dashboard design always looks the same.
* Parents log in with their WordPress account. New parents can create an account (role "Parent").
* Each parent's portfolio is saved in their user account. Photos go to the Media Library.
* Parents are kept out of wp-admin and do not see the admin bar.
* The child's photo can be zoomed, moved, centered and rotated in the photo editor (Profile → Change photo or Adjust photo). The original photo is kept so it can be adjusted again later.
* Print / PDF uses the browser's print window ("Save as PDF").
* Email sharing uses the website's email. An SMTP plugin (for example WP Mail SMTP) is recommended.
* Shortcode: [bright_dreamers_dashboard]. On a normal page it takes over the whole page; inside widgets or builder areas it shows the dashboard in a frame.

== Notes ==
* Photos are stored in wp-content/uploads/bdd-private and are only sent to the logged-in parent or an admin. On Nginx servers, also block direct access to /wp-content/uploads/bdd-private/ in the server config (Apache/LiteSpeed use the included .htaccess).
* Deleting the plugin removes its settings only. Parent accounts, portfolios and photos are kept.

== Changelog ==
= 1.9.0 =
* Parent / guardian confirmation (new text: "...to create and manage this private portfolio.", version v2) is now asked once on Create Account (required by the server). Older accounts that have not confirmed are asked once on the Profile page (or Account Settings). Earlier v1 confirmations stay valid.
* Upload helper text under every photo upload: "Upload only photos, certificates, or files you are authorized to provide."
* View Portfolio: privacy notice (no checkbox).
* Profile: "Preferred Name / Nickname" with helper text; the full preferred name is now used everywhere (it no longer takes only the first word). Create Account asks for the child's preferred name.
* "Delete portfolio": final button "Delete Portfolio Data". It now deletes the entries, the child's profile, the share history AND the private photo files. If a file cannot be deleted, nothing is cleared and an error is shown. Kept: the parent account, settings, the guardian confirmation and a deletion record (counts only). Old public Media Library copies are still removed separately by an admin.

= 1.8.5 =
* Email Share: new helper text, a privacy notice above Send, updated confirmation checkbox text (Send stays disabled until ticked; server still requires confirm_share = 1), new default message ending "Shared from Bright Dreamers", Share history shown as a table (Date, Recipient(s), Subject, Status, Use again), and a paper-plane Email Share icon. No public URLs or file links are added to emails.

= 1.8.4 =
* Brought back the Bright Dreamers logo at the top of the dashboard sidebar (undoes 1.8.3).

= 1.8.3 =
* Removed the Bright Dreamers logo from the top of the dashboard sidebar. The menu now starts at the top. (The logo stays on the login screen and the PDF cover.)

= 1.8.2 =
* Entry detail page: the photo box now takes the shape of the photo, so the photo fills the full width with no cropping (very tall photos are limited to 680px high). Fixed demo photos showing small.

= 1.8.1 =
* Entry detail page: the photo is now shown in full (no cropping or zoom). Empty space is filled with a soft blurred copy of the photo.
* New entry photos are saved at up to 1600px (was 900px) with better quality, so they stay sharp.

= 1.8.0 =
* "Clear all entries": the final confirmation now has an "I understand this will permanently delete..." checkbox (unticked every time) and the button stays disabled until it is ticked. Clearing now uses its own endpoint (/bd/v1/clear) that requires confirm_delete = 1, and normal saves can no longer wipe a portfolio with 2+ entries in one go. Each clear is logged (bdd_delete_log) without portfolio contents. What is deleted is unchanged (entries only).

= 1.7.0 =
* Email Share: parents must tick "I understand that this will send a copy of my child's portfolio..." before each send (unticked every time). The server rejects sends without confirm_share = 1. Each send is logged on the parent's account (bdd_share_log: parent ID, recipients, time, confirmed), without the portfolio contents; see the "Email shares" column in Users.

= 1.6.0 =
* One-time parent / guardian confirmation in Account Settings (with a link to the site's Privacy Policy page from Settings → Privacy). Saving Account Settings is blocked, also on the server, until it is given. Stored per parent as bdd_consent_guardian, bdd_consent_guardian_at and bdd_consent_guardian_text_version (v1).

= 1.5.0 =
* "Show photo on the portfolio cover" is now "Show my child's photo on the private portfolio cover", saved per parent (user meta bdd_show_photo_on_cover). When off, a neutral initial avatar is shown on every cover and in the printable book / PDF, and the server never puts the photo into the PDF page. Existing choices are kept.
* Print / PDF is now built on the server (/?bd_book=1).
* Photos are stored privately (uploads/bdd-private) and only sent to the logged-in parent or an admin. Old Media Library photos are copied to private storage on upgrade; an admin can remove the old public copies in Settings → Parent Dashboard.

= 1.4.0 =
* "Allow sharing by email" is now "Allow me to share portfolio copies by email", saved per parent (user meta bdd_allow_email_share). When it is off, Email Share is disabled in the dashboard and the server rejects email requests. Existing choices are kept. Email Share never creates a public link.

= 1.3.0 =
* Privacy: the child's portfolio is always private. The Privacy setting is now a locked status ("My child's portfolio is private by default") and the server always stores portfolio_private = true, whatever is submitted. Existing accounts are updated on upgrade.

= 1.2.0 =
* Achievement form: Type (Achievement, Award, Recognition, Certificate), Source (Outside Activity, Personal / Family) and "Date Achieved".
* Admin-only source "Bright Dreamers / Verified by Bright Dreamers", enforced on the server. Verified entries show a badge.
* Admins can open any parent's portfolio from Users → Open portfolio.
* Activities and projects: Start date and optional End date.
* US spelling, more space around dropdown arrows.
* Skill / Talent form: Type buttons (Skill, Talent), Start date picker, Level (Exploring, Growing, Developing, Confident, Strong) and Source with admin-only verification.
* Project form: Project Type, Status, Source (admin-only verification), Start / End date pickers and searchable skill tags.
* Goal form: Goal Type, Target Date picker, Status, Source (admin-only verification), Related Skills tags and a help panel with goal types, tips and examples. When a goal is Achieved, parents are asked "Add this to Achievements?".
* Certificate form: Certificate Title, Issuing Organization, Date Received, Certificate Type, Source and a help panel with certificate types, tips and examples. The Achievement form has a matching help panel.
* New Goals page: goal header, status tabs with counts, search, goal type filter, photo cards (type, status, target date, skills) and a side panel with goal types, tips and examples.
* New Skills & Talents page: child header, level tabs, search, skill/talent filter and photo cards.
* New Achievements page: child header, counts by type, tabs, search, category filter and photo cards with a menu (view, edit, delete).

= 1.1.0 =
* New photo editor for the child's profile photo: zoom, drag to move, center, fit, rotate and adjust again later.

= 1.0.0 =
* First release.
