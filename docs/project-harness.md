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

## Home Cooking Recipe List

Use this workflow when the user asks to analyze a recipe post, Instagram reel, cooking link, caption, screenshot, or video and add it to the home cooking recipe list.

### Files and Structure

1. Keep the list page at `html-documents/home-cooking-recipes.html`.
2. Keep recipe detail pages under `html-documents/home-cooking-recipes/`.
   - Use short stable filenames such as `1.html`, `2.html`, etc.
   - Do not use long romanized food names unless the user explicitly asks for descriptive filenames.
3. Keep recipe assets under `html-documents/home-cooking-recipes/assets/`.
   - Use short food-specific names such as `oi-naengguk.png`.
   - Keep shared recipe CSS, JavaScript, and generated images in this assets folder.
   - List cards and detail pages should reference local assets, not temporary generated-image paths.
4. Keep the standalone document registry entry in `_data/html_documents.yml`.
   - The visible document title is `레시피 리스트`.
   - Keep `_data/html_documents.yml` sorted by `date` descending.

### Source Analysis

1. Preserve the original user-provided URL.
2. For Instagram links, try to extract public metadata first:
   - Recipe title or food name.
   - Caption ingredients.
   - Caption cooking steps.
   - Public preview image or embed URL.
   - Use public preview images only to verify visible ingredients, plating, or menu identity. They are source-analysis material, not final card artwork.
3. If public metadata is blocked or incomplete, ask for caption text, screenshots, or a local video file instead of inventing details.
4. If the caption or metadata does not include enough recipe detail, analyze the video itself.
   - Prefer direct visual inspection of the reel/embed when available.
   - If the video cannot be inspected from the public page, ask the user for a screen recording, downloaded video, screenshots, or copied subtitle/caption text.
   - Extract visible ingredients, quantities, preparation actions, cooking order, cooking time hints, and plating/final state from the video.
   - Mark uncertain quantities conservatively, for example `적당량`, and mention that the amount was inferred from video when needed.
   - Do not fill missing ingredients or steps from generic recipe knowledge unless the user explicitly allows approximation.
5. Verify the cooking method against the source text or visible video when possible.
   - If only the caption is available, say the recipe is caption-based.
   - Do not claim direct video verification unless the video content was actually visible or available.
6. Keep the original Instagram embed or source link on the detail page when available, but do not make the recipe card depend on Instagram thumbnails.

### List Card Requirements

Each recipe added to `html-documents/home-cooking-recipes.html` must add one `.recipe-card` with:

1. A short detail link such as `/html-documents/home-cooking-recipes/1.html`.
2. `data-tags` with searchable recipe category tags, not menu names or ingredients.
   - Good tag types: cooking form or method such as `냉국`, `비빔`, `조림`, `찜`; season or context such as `여름`, `제철`, `도시락`; serving role such as `반찬`.
   - Do not use broad document tags like `요리`, `다이어트`, or `집밥`.
   - Do not use menu names as tags, for example `김치찜`, `비빔밥`, `부타노가쿠니`.
   - Do not use ingredients as tags, for example `돼지고기`, `묵은지`, `마늘쫑`, `오이`.
   - Normalize duplicate concepts to one canonical tag. Use `반찬`, not both `반찬` and `밥반찬`.
   - Keep tags short and few, usually 2-4 tags per recipe.
3. `data-ingredients` with meaningful food ingredients users may search by, such as `오이 양파 청양고추 냉면육수`.
   - Include primary visible or defining ingredients, not every seasoning.
   - Exclude generic seasonings and pantry items such as `간장`, `설탕`, `소금`, `물`, `식초`, `고춧가루`, `참기름`, `깨`, `기름`, `맛술`, `미림`, `꿀` unless the ingredient is the main searchable identity of the recipe.
   - Order ingredients by group: vegetables and kimchi first, aromatics and herbs next, protein next, staple or packaged base last.
   - Use one canonical ingredient name where possible, for example `청양고추` instead of mixing `고추` and `청양고추`.
   - Keep visible ingredient chips to major ingredients only; keep `searchIngredients` slightly broader only when it helps lookup.
4. A generated food image that looks appetizing and represents the food itself.
   - Generate a fresh food image with the image generation tool for each recipe before wiring the card/detail image.
   - Do not use Instagram thumbnails, source preview images, stock placeholders, or unrelated local images as the final recipe card image unless the user explicitly approves a temporary fallback.
   - Save the final selected generated image into `html-documents/home-cooking-recipes/assets/`.
   - Never reference generated images from `$CODEX_HOME/generated_images/...` directly in HTML.
5. A visible time pill such as `약 10분`.
6. A small set of visible tag pills.
7. A compact summary and major ingredient chips.
   - User-facing summary text must describe the food, flavor, texture, ingredients, or serving situation.
   - Do not describe the storage process, source-analysis process, or document state.
   - Avoid phrases such as `레시피입니다`, `정리했습니다`, `게시물의 마지막 메뉴`, `캡션 기반`, `영상 확인 필요`, `추가 확인`, or `보강해야 합니다` in visible recipe descriptions, method steps, and memos.
   - If source details are incomplete, keep the visible text conservative and food-centered rather than showing analysis notes.

The list filters are split into `태그` and `재료`. Both filter types must stay backed by `data-tags` and `data-ingredients`, and the `AND`/`OR` control applies across the selected tag and ingredient chips.

Filter UI rules:

1. Default filter logic is `OR`.
2. The tag and ingredient layer shows chips only.
   - Show a short layer title using only `태그` or `재료`.
   - Do not show a separate confirm button.
3. Users select or deselect chips, then tap the outside overlay or press Escape to close and apply.

### Detail Page Requirements

Each recipe detail page must include:

1. A back button that:
   - Calls browser history back when the user came from `home-cooking-recipes.html`.
   - Falls back to `/html-documents/home-cooking-recipes.html` when opened directly or from elsewhere.
2. A top source button, for example `Instagram에서 보기`, when a source URL exists.
3. Recipe title, short description, time, and major ingredients.
   - The short description must be about the dish itself, not the fact that it was saved or analyzed.
4. A `준비물` section where ingredients render two per row on normal/mobile layouts.
5. A `조리방법` section that matches the source as closely as possible.
6. A short memo only when useful.
   - Memos should give cooking or taste guidance. Do not use memos to explain scraping limits, source availability, or why the page was created.
7. The generated/local food image and, when available, an Instagram embed or video.
   - On detail pages, place the food image as a compact thumbnail at the top-right of the title/description area.
   - Do not render the detail food image as a large media column image.
   - If direct MP4 download is not available from public metadata, use the embed and report that local video download was unavailable.
8. A bottom-right button that scrolls to the top.

### Verification

After adding or changing a recipe, run:

```bash
scripts/verify-all.sh
```

If changing these recipe instructions, validation scripts, or harness behavior, also run:

```bash
ruby scripts/test-harness.rb
```

## Escape Room Invite Cards

Use this workflow when the user asks to create or update a 방탈출 카드, 방탈출 초대장, or 방탈출 정보 page.

### Source of Truth

1. Look up the theme on 빠방 first.
   - 빠방 primary site: `https://bbabang.net/`.
   - 빠방 service identity: `빠방 - 빠른 방탈출 예약/평점 조회`.
   - If the user gives a 빠방 link, screenshot, theme name, or reservation details, prefer that context over guessing.
   - The user may give an abbreviation, nickname, typo, partial title, or informal name. Treat the user's text as a search query, not necessarily the final theme name.
2. Pull these fields from 빠방 when available:
   - Theme name.
   - Store/branch name.
   - Area, for example `홍대`.
   - Genre.
   - Play time in minutes.
   - Difficulty.
   - Fear level.
   - Activity level.
   - Price. Display per-person prices with `각`, for example `각 33,000원`; display team/package prices with `팀`, for example `팀 180,000원`.
   - Theme description.
   - Poster image.
3. Reservation date/time usually comes from the user, not from 빠방. Convert it into:
   - `reservedYear`: concrete year as a number, such as `2026`. Include it so past or future dates do not drift when the page is opened later.
   - `reservedDate`: Korean display text such as `6월 3일 수요일`.
   - `reservedTime`: `HH:MM`.
   - The visible time range is calculated by JS from `reservedTime + playMinutes`; do not hardcode the end time in card data.
   - Reservation date/time is private by default. Hide reservation date, reservation time, and calendar on the public list and card detail unless the URL includes the private reservation query token.
   - Do not use a meaningful or shared query flag. The list page should use its own private token, and each detail card should use a different per-card token so one card URL cannot unlock another card by reusing the same suffix.
   - Keep the list-page card token map and the detail shared-script token map in sync whenever adding a card.
   - Dated card detail pages should keep the reservation-time section in static HTML with `hidden`, and the shared card script should reveal it only when that card's private token is present.
   - Dated list cards should keep date/time badges in static HTML with `hidden`, and the list script should reveal them only when the list private token is present.
   - When the list page is opened with the list private token, card links should preserve reservation visibility by linking each detail page with that card's own private token.
   - The detail page's list/back button should always navigate to the clean list URL without the private token.
   - Link-only copy and the URL line inside full-info copy should use the clean card URL by default, but include that card's private token when the detail page itself is opened with the private token.
   - Full-info copy should include the reservation line only when the detail page itself is opened with that card's private token; otherwise omit reservation date/time from copied text.
   - On the list page, triple-clicking or triple-tapping the `방탈출 정보` title should toggle the list private token.
   - On detail cards, triple-clicking or triple-tapping the theme title should toggle the same card URL between clean and that card's private-token URL.
   - Private-token title toggles should use `window.location.replace(...)`, not `assign(...)`, so toggling reservation visibility does not add a browser history entry.
   - OG/Twitter meta descriptions should not include reservation date/time because previews cannot reliably respect private query tokens.
   - List cards should still show reservation-state background colors regardless of private-token state: undated and past reservation date must share the same muted gray tone, reservation day uses the active day tone, and upcoming reservation date uses the upcoming tone. Detail cards should keep the unified coral/cream card theme.
   - If the schedule is not decided, use `reservedDate: "일정 미정"` and omit `reservedYear` and `reservedTime`.
   - Undated card detail pages must not include the reservation-time section in the static HTML. Do not leave an empty `.intro-reservation` block that depends on JavaScript hiding.
   - The shared card script also removes `.intro-reservation` when `reservedTime` is missing, but this is a fallback. The HTML itself should already avoid showing a placeholder calendar, time range, or `일정 미정` reservation box.
   - Undated cards still need every non-reservation theme field filled the same way as dated cards: genre, play time, price, difficulty, fear level, activity level, store, area, poster, map URL, and theme description.
   - Undated card static HTML should still include fallback text for those non-reservation fields, especially the header meta badges, stat pills, poster `src`/`alt`, and theme description. Only the reservation-time section is omitted.
   - List cards should be sorted by reservation state: today/future reservations first, undated cards next, and past reservations last.
4. Prefer a direct Naver Map place URL for `mapUrl`, based on the verified Naver store/branch place ID. The area badge should remain clickable.
   - Always verify the map target while creating a card. A numeric ID from a third-party directory is not automatically a Naver place ID.
   - If a direct Naver place URL cannot be verified, use an exact Naver Map search URL as a fallback rather than a guessed place entry URL.
5. Do not invent unavailable fields. Ask the user or leave a conservative value only when the user explicitly allows arbitrary content.
6. Do not show 빠방 rating, source credit, or day plan text unless the user explicitly asks for it.
7. Do not generate poster images. Save the poster found from 빠방 or another official/theme source.

### How to Collect Data from 빠방

Use this order. Fast web search is allowed for name resolution, but 빠방 remains the primary source for the card data and poster.

1. Preserve the user's raw query.
   - Example: user says `머머부`; keep `머머부` as the first search query.
   - Also preserve reservation details separately; reservation date/time usually does not come from 빠방.
2. Resolve ambiguous or abbreviated names before collecting details.
   - Search 빠방 with the raw query first because 빠방 records `nicknames` such as abbreviations and initials.
   - If there is no confident match, use web search only to identify the likely official theme/store:

     ```text
     "{raw query}" 방탈출
     "{raw query}" 방탈출 후기
     "{raw query}" 빠방
     "{raw query}" "{known area or store}" 방탈출
     ```

   - From those results, extract candidate official theme name, store/branch, and area.
   - Search 빠방 again with each candidate in this order:
     1. Raw user query.
     2. Official theme title.
     3. `official theme title + store/branch`.
     4. Distinctive title words.
     5. Known nickname, Korean initials, or English alias.
   - If multiple plausible 빠방 records remain, ask the user to choose instead of guessing.
3. Prefer 빠방's rendered UI when it is easy to operate.
   - Open `https://bbabang.net/`.
   - Search by the raw query and then by the resolved official title.
   - Confirm the matching card by title, store/branch, and area.
4. If the rendered UI is hard to inspect, use 빠방's public search index from the web bundle.
   - 빠방 is a Flutter web app; the HTML may show only the splash screen in text tools.
   - Download or inspect the app bundle in scratch space:

     ```bash
     curl -L https://bbabang.net/main.dart.js -o /tmp/bbabang-main.dart.js
     rg -n "q.keigon.net|qrooms|qstores|Authorization|Meilisearch" /tmp/bbabang-main.dart.js
     ```

   - The useful search index names are:
     - `qrooms`: theme/room records.
     - `qstores`: store records.
   - Use the public Meilisearch token found in `main.dart.js` only for the lookup command. Do not paste that token into repository files or documentation.
   - Query shape:

     ```bash
     curl -L -s 'https://q.keigon.net/indexes/qrooms/search' \
       -H 'Authorization: Bearer <public token from main.dart.js>' \
       -H 'Content-Type: application/json' \
       --data '{"q":"<raw or resolved query>","limit":5}'
     ```

   - If normal sandboxed network access fails with DNS or connection errors, retry the same lookup with explicit user approval for network access.
5. Confirm the correct 빠방 record.
   - `title` must match the resolved theme name or a known nickname match.
   - `nicknames` can validate abbreviations such as `머머부`.
   - `store_name` must match the user's store if they provided one.
   - `location` and `area` must be consistent with the user's context.
   - Ignore unrelated records even if the title is similar.
6. Extract only the fields needed by `window.escapeRoomInviteData`.
   - `title` -> theme name.
   - `store_name` -> store/branch name.
   - `location` -> display area such as `홍대` or `강남`.
   - `playtime` -> `playMinutes`.
   - `price` -> display price. Prefix per-person prices with `각`; prefix team/package prices with `팀`.
   - `description` -> theme introduction text.
   - `poster_loc` -> preferred poster path.
   - `thumb_loc` -> fallback poster path if `poster_loc` is missing or unavailable.
   - `tags` or `special_tags` may be empty; if genre is missing from 빠방, verify it from the official store page or ask the user.
   - Review ratings and aggregate score fields must not be shown unless the user explicitly asks.
7. Save the poster from 빠방.
   - Build the CDN URL from the poster path:

     ```text
     https://cdn.keigon.net/{URL-encoded poster_loc}
     ```

   - Keep `/` path separators and URL-encode spaces/non-ASCII path parts.
   - Verify the response is an image with `curl -I` or `file`.
   - Save it under `html-documents/escape-room-invite-card/assets/poster-N.ext`.
   - Use the real extension from the bytes or content type: `.jpg`, `.png`, or `.webp`.
   - Update `posterUrl` and the list page to match the real extension.
   - Do not hotlink 빠방's image URL in the HTML.
8. Create and verify a Naver Map URL for `mapUrl`.
   - Prefer a place entry URL: `https://map.naver.com/p/entry/place/{placeId}`.
   - Do not reuse numeric IDs from non-Naver sites such as `placeview.co.kr`; those IDs can look like place IDs but may point to the wrong Naver target.
   - Search the exact store name first, then the store name plus address/area:

     ```text
     "{store name}" "map.naver.com/p/entry/place"
     "{store name}" "pcmap.place.naver.com"
     "{store name}" "booking.naver.com"
     "{store name}" "네이버 방문자리뷰"
     "{store name}" "{address or area}" "이 블로그의 체크인"
     ```

   - A reliable source is the store's Naver Booking page when 빠방 exposes `store_homepage` or search finds a booking page. Inspect the HTML for `placeId`:

     ```bash
     curl -L -s '<naver booking URL>' -o /tmp/naver-booking.html
     rg -n "placeId|bookingPlace|bizName|address" /tmp/naver-booking.html
     ```

   - If search results or blog posts show a Naver check-in map, open the mobile blog post and inspect the HTML for `data-linkdata` or `__se_module_data`; Naver place IDs appear as `placeId`.
   - Useful extraction command:

     ```bash
     curl -L -s 'https://m.blog.naver.com/PostView.naver?blogId=<blogId>&logNo=<logNo>' -o /tmp/naver-blog.html
     rg -n "placeId|data-linkdata|__se_module_data|store name" /tmp/naver-blog.html
     ```

   - Convert the found ID into `https://map.naver.com/p/entry/place/{placeId}` and verify it:

     ```bash
     curl -L -I 'https://map.naver.com/p/entry/place/<placeId>'
     ```

   - A `200` response only proves the entry URL exists. Still confirm the ID came from a Naver source tied to the same store/branch, address, or booking page.
   - If no Naver place ID is available, use a search URL only as a fallback and include the exact store/branch text plus area/address:

     ```text
     https://map.naver.com/p/search/{URL-encoded exact store name and address}
     ```
9. If 빠방 blocks direct extraction, is login-gated, or the detail page cannot be reached after the search-index path:
   - Ask the user for a 빠방 screenshot/link.
   - Use the screenshot/link as the source of truth.
   - If the poster is visible only in a screenshot, ask for the original poster image or a shareable 빠방 page before using a cropped screenshot.
10. If a field is missing after 빠방 and official-store checks:
   - Do not invent it silently.
   - Ask the user, or mark it with a conservative value only when the user explicitly allows arbitrary content.

Useful fallback when external search is needed for name resolution:

```text
"약어 또는 애매한 이름" 방탈출
"약어 또는 애매한 이름" 방탈출 후기
"정식 테마명" "매장명"
```

Search-engine results may miss 빠방 because 빠방 content is rendered dynamically. A failed `site:bbabang.net` search does not mean the theme is absent from 빠방.

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
poster-2.png
poster-3.webp
```

Use the real extension from the downloaded image bytes. Do not rename a PNG/WebP file to `.jpg`.

Common CSS and JS stay shared:

```text
escape-room-card.css
escape-room-card.js
```

Do not duplicate the shared CSS/JS for each card unless the user asks for a one-off design that cannot be shared.

Do not add `html-documents/escape-room-invite-card/index.html`. Invalid or directory URLs should be left to the site's root `404.html` handling.

### Adding a New Card

1. Find the next card number by listing existing files and using the highest existing number plus one:

   ```bash
   find html-documents/escape-room-invite-card -maxdepth 1 -name '*.html' \
     | sed -E 's#.*/([0-9]+)\.html#\1#' \
     | sort -n \
     | tail -1
   ```

   If an old card was deleted and a number is missing, do not reuse the gap. Keep card URLs append-only and create the new card at `max + 1`.

2. Copy the latest card file to the next number.
   - Example: copy `1.html` to `2.html`.
   - Keep the same DOM structure.
   - Change only `window.escapeRoomInviteData` unless layout changes are requested.

3. Save the poster into `assets/poster-N.ext`.
   - Use the real extension from the downloaded image bytes.
   - Use a relative path in card data: `./assets/poster-N.ext`.
   - Never use `/Users/...` or another local absolute path.

4. Update `window.escapeRoomInviteData` in `N.html`.
   Required keys:

   ```js
   window.escapeRoomInviteData = {
     label: "방탈출 정보",
     title: "...",
     store: "...",
     area: "...",
     reservedYear: 2026,
     reservedDate: "...",
     reservedTime: "HH:MM",
     playMinutes: 80,
     genre: "...",
     difficulty: "...",
     fear: "...",
     activity: "...",
     price: "...",
     description: "...",
     posterUrl: "./assets/poster-N.ext",
     mapUrl: "..."
   };
   ```

   For an undated card, use:

   ```js
   reservedDate: "일정 미정"
   ```

   and omit `reservedYear` and `reservedTime`. Keep all other fields exactly as complete as a dated card. The card script removes the whole reservation-time section for undated cards, but the static HTML for an undated card should not include that section in the first place.

5. Update the list page `html-documents/escape-room-invite.html`.
   - Add one list item linking to `./escape-room-invite-card/N.html`.
   - Use the matching poster `./escape-room-invite-card/assets/poster-N.ext`.
   - Add a new unique private token for `N.html` to both token maps:
     - `cardReservationTokens` in `html-documents/escape-room-invite.html`.
     - `cardReservationTokens` in `html-documents/escape-room-invite-card/assets/escape-room-card.js`.
   - Do not reuse another card's token. The list private token and every detail card token must be different from each other.
   - Keep the list page as the only registered HTML document in `_data/html_documents.yml`.
   - Add `data-difficulty`, `data-fear`, and `data-activity` to the list card anchor so the list can render the same compact stat pills shown on detail cards.
   - For an undated card, set `data-reserved-date=""` and omit date/time badges from the list card. Keep only always-valid summary badges such as area.
   - The list sort policy is: today/future reservations first by nearest date, undated cards next, and past reservations last by most recent date.
   - Avoid showing the unsorted list before JavaScript finishes. The list page should hide `.card-list` only when the early `js` class is present, sort and decorate cards, then reveal it by adding `is-ready`.

6. Do not run `ruby scripts/add-html-document.rb` only to register individual card files.
   - The sync script scans only `html-documents/*.html`.
   - Individual cards intentionally stay out of `/daily/html-documents/`.
   - Run it only if the top-level list page metadata needs syncing.

7. Verify the Naver Map link before final validation.
   - For direct place links, confirm the place ID came from Naver Booking, Naver Map, or a Naver check-in source for the same store/branch.
   - Open or `curl -L -I` the final `mapUrl`.
   - If the direct place URL is uncertain, replace it with an exact Naver Map search URL instead of guessing.

8. Verify:

   ```bash
   node --check html-documents/escape-room-invite-card/assets/escape-room-card.js
   scripts/verify-all.sh
   ```

9. Report:
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
