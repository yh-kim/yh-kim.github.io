# Project Harness

This repository is a Jekyll-based personal blog with a few standalone static areas. Use this document as the operating guide before changing content, layout, assets, or publishing behavior.

## Project Structure

| Path | Role |
| --- | --- |
| `_config.yml` | Main Jekyll configuration: site metadata, permalink rules, plugins, and the `daily` collection. |
| `_posts/` | Main blog posts. Filenames use `YYYY-MM-DD-slug.md` or `.markdown`. These are listed on `index.html` through Jekyll pagination. |
| `_daily/` | Daily collection posts. These are listed by `daily.html` and generated under `/daily/.../`. |
| `_layouts/` | Page templates. `default.html` wraps the common shell, `page.html` renders top-level pages, `post.html` renders posts and daily entries, `tag.html` renders category pages. |
| `_includes/` | Shared partials such as `<head>`, navigation, footer, and About page snippets. |
| `_data/html_documents.yml` | Registry for standalone HTML documents published from `html-documents/`. |
| `index.html` | Home page. Lists `_posts` via `paginator.posts`. |
| `daily.html` | Daily landing page. Lists `site.daily` entries. |
| `about.html`, `tags.html`, `404.html`, `offline.html` | Static Jekyll pages. |
| `category/` | One page per blog tag. Each page uses `layout: tag` and points at a matching tag name. |
| `css/`, `less/`, `js/`, `fonts/`, `img/` | Theme styles, source Less files, scripts, fonts, and shared images. |
| `img/in-post/` | Images used inside blog posts. |
| `html-documents/` | Standalone HTML documents served directly, such as full study notes or generated pages. |
| `portfolio/` | Standalone portfolio page and its own assets. |
| `pwa/`, `sw.js`, `offline.html` | PWA manifest, icons, service worker, and offline fallback. |
| `scripts/` | Local verification harness. Run `scripts/verify-all.sh` after changes. |

## Work Procedure

Use this sequence for any prompt or change request:

1. Classify the request.
   - Content: add or edit `_posts`, `_daily`, `about.html`, category content, or assets.
   - Structure: change `_config.yml`, layouts, includes, navigation, permalink rules, or pagination.
   - Static app/page: change `portfolio`, PWA files, or standalone HTML assets.
   - Maintenance: Git, dependencies, build, deployment, or cleanup.

2. Read the relevant files before editing.
   - For posts: read a nearby existing post, the target layout, and `_config.yml`.
   - For daily: read `daily.html`, `_config.yml` collection settings, and one existing `_daily` file.
   - For standalone HTML documents: read `_data/html_documents.yml`, `_daily/2026-05-27-html-documents.markdown`, and the target file in `html-documents/`.
   - For navigation or layout: read `_includes/nav.html`, `_layouts/default.html`, and the specific layout.
   - For assets: inspect how existing posts reference `img/in-post` or `html-documents`.

3. Choose the smallest compatible change.
   - Follow existing front matter style and indentation.
   - Prefer explicit `permalink` when a user-facing URL must be stable.
   - Use `relative_url` or `site.baseurl` for local links inside generated pages.
   - Keep standalone HTML/CSS isolated when it could collide with the blog theme.
   - For uploaded HTML documents, place the HTML in `html-documents/`, add an entry to `_data/html_documents.yml`, and let `/daily/html-documents/` be the visible Daily entry point.
   - If a standalone HTML document already had a direct Daily post, keep that post only as a hidden compatibility page when preserving old URLs matters.

4. Review the result against the request.
   - Confirm the changed files match the requested area.
   - Confirm generated URLs are predictable.
   - Confirm links and embedded assets point to existing files.
   - Confirm there are no unrelated edits.

5. Run the harness.
   - `scripts/verify-all.sh`
   - If Jekyll is available, the harness also runs `jekyll build` and verifies the generated `_site` output.
   - If Jekyll is not available, install project dependencies before doing release-level verification.
   - Run `ruby scripts/test-harness.rb` after changing the harness itself.

6. Summarize the change.
   - Mention changed files.
   - Mention the expected URL if a page was added.
   - Include the verification output and any skipped checks.
   - Stop before committing unless the user explicitly asks for a commit or push.

## Commit Boundary

Default stopping point:

1. Apply the requested file changes.
2. Run the relevant verification commands.
3. Report changed files, test results, and any remaining risks.
4. Leave the working tree uncommitted.

Only stage, commit, or push when the user explicitly asks for that action.

## Known Jekyll Pitfalls

| Case | Symptom | Harness Coverage |
| --- | --- | --- |
| Future-dated daily post | The post appears in `/daily/`, but Jekyll does not write the detail page, so the list link returns 404. | `verify-daily-links.rb` fails when a daily post date is later than the current build time. |
| Standalone HTML not registered | The HTML file exists, but there is no visible Daily entry point for users to find it. | `verify-html-documents.rb` checks `_data/html_documents.yml` and `/daily/html-documents/`. |
| Registered HTML asset missing | The list links to an HTML file that was moved or not committed. | `verify-html-documents.rb` checks every registered `/html-documents/*.html` file exists. |
| Hidden compatibility page exposed | A direct compatibility page is generated but should not appear in the Daily list. | `verify-built-site.rb` checks generated Daily output after `jekyll build`. |
| Personal/profile links exposed | About, Portfolio, RSS, Facebook, GitHub, old avatar, or old real-name markers reappear. | `verify-privacy.rb` checks source markers and generated `_site` output. |
| Missing stable daily permalink | A user-facing Daily URL can change if the filename or collection rules change. | `verify-daily-links.rb` checks Daily URL shape and PSP's stable permalink. |
| Missing category page | A post tag can render to a category link that has no corresponding `category/<tag>.html`. | `verify-project-structure.rb` checks tags against category pages. |
| Missing local asset | A post or layout can link to a file that does not exist in the repository. | `verify-content-links.rb` scans local `href` and `src` targets. |
| Links inside examples | Code snippets can contain strings that look like links but are not site links. | `verify-content-links.rb` ignores comments, fenced code blocks, inline code, and Android resource refs. |

## Test Harness

Run all checks:

```bash
scripts/verify-all.sh
```

Individual checks:

```bash
ruby scripts/verify-project-structure.rb
ruby scripts/verify-daily-links.rb
ruby scripts/verify-html-documents.rb
ruby scripts/verify-content-links.rb
ruby scripts/verify-built-site.rb
ruby scripts/verify-privacy.rb
```

Add a standalone HTML document:

1. Put the file under `html-documents/`, for example `html-documents/example.html`.
2. Run `ruby scripts/add-html-document.rb` to sync `_data/html_documents.yml` from the folder.
3. Review the generated entry in `_data/html_documents.yml`.
4. Run `scripts/verify-all.sh`.
5. Open `/daily/html-documents/` and use the generated link to reach the HTML page.

자세한 HTML 추가 가이드: `docs/html-documents-guide.md`.

## Escape Room Invite Cards

Use this workflow when the user asks to create or update a 방탈출 카드, 방탈출 초대장, or 방탈출 정보 page.

### Source of Truth

1. Look up the theme on 빠방 first.
   - 빠방 primary site: `https://bbabang.net/`.
   - 빠방 service identity: `빠방 - 빠른 방탈출 예약/평점 조회`.
   - If the user gives a 빠방 link, screenshot, theme name, or reservation details, prefer that context over guessing.
2. Pull these fields from 빠방 when available:
   - Theme name.
   - Store/branch name.
   - Area, for example `홍대`.
   - Genre.
   - Play time in minutes.
   - Difficulty.
   - Fear level.
   - Activity level.
   - Price.
   - Theme description.
   - Poster image.
3. Reservation date/time usually comes from the user, not from 빠방. Convert it into:
   - `reservedDate`: Korean display text such as `6월 3일 수요일`.
   - `reservedTime`: `HH:MM`.
   - The visible time range is calculated by JS from `reservedTime + playMinutes`; do not hardcode the end time in card data.
4. Use Naver Map search URL for `mapUrl`, based on the store/branch name. The area badge should remain clickable.
5. Do not invent unavailable fields. Ask the user or leave a conservative value only when the user explicitly allows arbitrary content.
6. Do not show 빠방 rating, source credit, or day plan text unless the user explicitly asks for it.
7. Do not generate poster images. Save the poster found from 빠방 or another official/theme source.

### How to Collect Data from 빠방

Use this order. Do not jump straight to arbitrary web search unless 빠방 does not expose the needed detail.

1. Open `https://bbabang.net/`.
2. Use 빠방's own search to look up the exact theme name.
   - Search by full theme name first.
   - If no result appears, search by distinctive words from the title.
   - If the store is known, search again with `theme name + store/branch`.
3. Open the matching theme detail page/card and confirm it matches the user's request.
   - Theme name must match.
   - Store/branch must match when the user provided one.
   - Area must match when the user provided one.
4. Extract only the fields needed by `window.escapeRoomInviteData`:
   - `title`: theme name.
   - `store`: store/branch name.
   - `area`: area shown by 빠방, or the area implied by the store.
   - `playMinutes`: play time in minutes.
   - `genre`: genre text.
   - `difficulty`: difficulty text.
   - `fear`: fear level.
   - `activity`: activity level.
   - `price`: per-person price or displayed price.
   - `description`: theme introduction text.
   - `posterUrl`: local poster path after saving the poster.
5. Save the poster from 빠방.
   - Prefer the actual theme poster image.
   - Save it as `html-documents/escape-room-invite-card/assets/poster-N.jpg`.
   - If the downloaded file is PNG/WebP, either keep the real extension and update `posterUrl`, or convert/rename only when the bytes are actually JPEG.
   - Do not hotlink 빠방's image URL in the HTML.
6. Create a Naver Map search URL for `mapUrl`.
   - Use the exact store/branch text from 빠방.
   - Example query shape: `https://map.naver.com/p/search/{encoded store name}`.
7. If 빠방 blocks direct extraction, is login-gated, or the detail page cannot be reached:
   - Ask the user for a 빠방 screenshot/link.
   - Use the screenshot/link as the source of truth.
   - If the poster is visible only in a screenshot, ask for the original poster image or a shareable 빠방 page before using a cropped screenshot.
8. If a field is missing on 빠방:
   - Do not invent it silently.
   - Ask the user, or mark it with a conservative value only when the user explicitly allows arbitrary content.

Useful search fallback when 빠방 internal search is hard to operate:

```text
site:bbabang.net "테마명"
site:bbabang.net "테마명" "매장명"
```

This fallback may fail because 빠방 content may be rendered dynamically. A failed search does not mean the theme is absent from 빠방.

### File Structure

The public list page stays at:

```text
html-documents/escape-room-invite.html
```

Individual cards live under:

```text
html-documents/escape-room-invite-card/
```

Use numeric card files:

```text
html-documents/escape-room-invite-card/1.html
html-documents/escape-room-invite-card/2.html
html-documents/escape-room-invite-card/3.html
```

Shared card assets live under:

```text
html-documents/escape-room-invite-card/assets/
```

Poster files use the matching card number:

```text
poster-1.jpg
poster-2.jpg
poster-3.jpg
```

Common CSS and JS stay shared:

```text
escape-room-card.css
escape-room-card.js
```

Do not duplicate the shared CSS/JS for each card unless the user asks for a one-off design that cannot be shared.

Do not add `html-documents/escape-room-invite-card/index.html`. Invalid or directory URLs should be left to the site's root `404.html` handling.

### Adding a New Card

1. Find the next card number by listing existing files:

   ```bash
   find html-documents/escape-room-invite-card -maxdepth 1 -name '*.html' | sort
   ```

2. Copy the latest card file to the next number.
   - Example: copy `1.html` to `2.html`.
   - Keep the same DOM structure.
   - Change only `window.escapeRoomInviteData` unless layout changes are requested.

3. Save the poster into `assets/poster-N.jpg`.
   - Use a relative path in card data: `./assets/poster-N.jpg`.
   - Never use `/Users/...` or another local absolute path.

4. Update `window.escapeRoomInviteData` in `N.html`.
   Required keys:

   ```js
   window.escapeRoomInviteData = {
     label: "방탈출 정보",
     title: "...",
     store: "...",
     area: "...",
     reservedDate: "...",
     reservedTime: "HH:MM",
     playMinutes: 80,
     genre: "...",
     difficulty: "...",
     fear: "...",
     activity: "...",
     price: "...",
     description: "...",
     posterUrl: "./assets/poster-N.jpg",
     mapUrl: "..."
   };
   ```

5. Update the list page `html-documents/escape-room-invite.html`.
   - Add one list item linking to `./escape-room-invite-card/N.html`.
   - Use the matching poster `./escape-room-invite-card/assets/poster-N.jpg`.
   - Keep the list page as the only registered HTML document in `_data/html_documents.yml`.

6. Do not run `ruby scripts/add-html-document.rb` only to register individual card files.
   - The sync script scans only `html-documents/*.html`.
   - Individual cards intentionally stay out of `/daily/html-documents/`.
   - Run it only if the top-level list page metadata needs syncing.

7. Verify:

   ```bash
   node --check html-documents/escape-room-invite-card/assets/escape-room-card.js
   scripts/verify-all.sh
   ```

8. Report:
   - New card URL, for example `/html-documents/escape-room-invite-card/2.html`.
   - Updated list URL: `/html-documents/escape-room-invite.html`.
   - Source used for the poster/details.
   - Verification commands and results.

When the user says they are adding an HTML file or asks to publish an HTML document:

1. Treat it as a standalone HTML document unless they explicitly ask for a normal blog post.
2. Copy or create the HTML under `html-documents/` with a stable, lowercase, hyphenated filename.
3. Run `ruby scripts/add-html-document.rb` to sync `_data/html_documents.yml`.
4. Review the generated `title`, `description`, `date`, and optional `tags`.
5. Do not embed it with an iframe in a Daily post by default.
6. Use `/daily/html-documents/` as the visible Daily entry point.
7. Preserve or create a direct Daily compatibility page only when there is already a shared URL or the user asks for one.
8. Run `scripts/verify-all.sh` and `ruby scripts/test-harness.rb`.
9. Stop before commit and report the changed files and verification output.

Harness self-tests:

```bash
ruby scripts/test-harness.rb
```

The self-test copies the repository to a temporary directory and verifies that known-bad cases fail without modifying the real working tree.

The harness is intentionally local and dependency-light. It catches the common mistakes that caused 404s here: missing front matter, unstable daily permalinks, missing category pages, missing local assets, and local links that point nowhere.
