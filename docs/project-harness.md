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
| `_data/html_documents.yml` | Registry for standalone HTML documents published from `daily-assets/`. |
| `index.html` | Home page. Lists `_posts` via `paginator.posts`. |
| `daily.html` | Daily landing page. Lists `site.daily` entries. |
| `about.html`, `tags.html`, `404.html`, `offline.html` | Static Jekyll pages. |
| `category/` | One page per blog tag. Each page uses `layout: tag` and points at a matching tag name. |
| `css/`, `less/`, `js/`, `fonts/`, `img/` | Theme styles, source Less files, scripts, fonts, and shared images. |
| `img/in-post/` | Images used inside blog posts. |
| `daily-assets/` | Standalone assets embedded by daily posts, such as full HTML study notes. |
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
   - For standalone HTML documents: read `_data/html_documents.yml`, `_daily/2026-05-27-html-documents.markdown`, and the target file in `daily-assets/`.
   - For navigation or layout: read `_includes/nav.html`, `_layouts/default.html`, and the specific layout.
   - For assets: inspect how existing posts reference `img/in-post` or `daily-assets`.

3. Choose the smallest compatible change.
   - Follow existing front matter style and indentation.
   - Prefer explicit `permalink` when a user-facing URL must be stable.
   - Use `relative_url` or `site.baseurl` for local links inside generated pages.
   - Keep standalone HTML/CSS isolated when it could collide with the blog theme.
   - For uploaded HTML documents, place the HTML in `daily-assets/`, add an entry to `_data/html_documents.yml`, and let `/daily/html-documents/` be the visible Daily entry point.
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
| Registered HTML asset missing | The list links to an HTML file that was moved or not committed. | `verify-html-documents.rb` checks every registered `/daily-assets/*.html` file exists. |
| Hidden compatibility page exposed | A direct compatibility page is generated but should not appear in the Daily list. | `verify-built-site.rb` checks generated Daily output after `jekyll build`. |
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
```

Add a standalone HTML document:

1. Put the file under `daily-assets/`, for example `daily-assets/example.html`.
2. Add a matching entry to `_data/html_documents.yml`.
3. Run `scripts/verify-all.sh`.
4. Open `/daily/html-documents/` and use the generated link to reach the HTML page.

When the user says they are adding an HTML file or asks to publish an HTML document:

1. Treat it as a standalone HTML document unless they explicitly ask for a normal blog post.
2. Copy or create the HTML under `daily-assets/` with a stable, lowercase, hyphenated filename.
3. Register it in `_data/html_documents.yml` with `title`, `description`, `path`, `date`, and optional `tags`.
4. Do not embed it with an iframe in a Daily post by default.
5. Use `/daily/html-documents/` as the visible Daily entry point.
6. Preserve or create a direct Daily compatibility page only when there is already a shared URL or the user asks for one.
7. Run `scripts/verify-all.sh` and `ruby scripts/test-harness.rb`.
8. Stop before commit and report the changed files and verification output.

Harness self-tests:

```bash
ruby scripts/test-harness.rb
```

The self-test copies the repository to a temporary directory and verifies that known-bad cases fail without modifying the real working tree.

The harness is intentionally local and dependency-light. It catches the common mistakes that caused 404s here: missing front matter, unstable daily permalinks, missing category pages, missing local assets, and local links that point nowhere.
