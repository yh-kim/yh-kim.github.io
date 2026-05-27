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
   - For navigation or layout: read `_includes/nav.html`, `_layouts/default.html`, and the specific layout.
   - For assets: inspect how existing posts reference `img/in-post` or `daily-assets`.

3. Choose the smallest compatible change.
   - Follow existing front matter style and indentation.
   - Prefer explicit `permalink` when a user-facing URL must be stable.
   - Use `relative_url` or `site.baseurl` for local links inside generated pages.
   - Keep standalone HTML/CSS isolated when it could collide with the blog theme.

4. Review the result against the request.
   - Confirm the changed files match the requested area.
   - Confirm generated URLs are predictable.
   - Confirm links and embedded assets point to existing files.
   - Confirm there are no unrelated edits.

5. Run the harness.
   - `scripts/verify-all.sh`
   - If Jekyll is available, the harness also runs `jekyll build`.
   - If Jekyll is not available, install project dependencies before doing release-level verification.

6. Summarize the change.
   - Mention changed files.
   - Mention the expected URL if a page was added.
   - Include the verification output and any skipped checks.

## Test Harness

Run all checks:

```bash
scripts/verify-all.sh
```

Individual checks:

```bash
ruby scripts/verify-project-structure.rb
ruby scripts/verify-daily-links.rb
ruby scripts/verify-content-links.rb
```

The harness is intentionally local and dependency-light. It catches the common mistakes that caused 404s here: missing front matter, unstable daily permalinks, missing category pages, missing local assets, and local links that point nowhere.
