#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "psych"

ROOT = Pathname.new(__dir__).join("..").expand_path
SITE = ROOT.join("_site")

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def read_front_matter(path)
  text = path.read
  return [{}, text] unless text.start_with?("---\n")

  parts = text.split(/^---\s*$/, 3)
  front_matter = Psych.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
  [front_matter, parts[2] || ""]
end

def slug_from(path)
  path.basename(path.extname).to_s.sub(/\A\d{4}-\d{2}-\d{2}-/, "")
end

def page_url(path, front_matter)
  permalink = front_matter["permalink"].to_s
  return permalink unless permalink.empty?

  "/daily/#{slug_from(path)}/"
end

def built_path_for(url)
  clean = url.delete_prefix("/")
  if clean.end_with?("/")
    SITE.join(clean, "index.html")
  elsif clean.end_with?(".html")
    SITE.join(clean)
  else
    SITE.join(clean, "index.html")
  end
end

fail_with("_site is missing. Run jekyll build first.") unless SITE.directory?

daily_index = SITE.join("daily/index.html")
note_index = SITE.join("note/index.html")
dev_index = SITE.join("dev/index.html")
html_documents = SITE.join("daily/html-documents/index.html")
home_html = SITE.join("index.html").read
pickth_css = SITE.join("css/pickth.css").read
fail_with("_site/daily/index.html is missing") unless daily_index.file?
fail_with("_site/note/index.html is missing") unless note_index.file?
fail_with("_site/dev/index.html is missing") unless dev_index.file?
fail_with("_site/daily/html-documents/index.html is missing") unless html_documents.file?
fail_with("home should keep the welcome copy") unless home_html.include?("hello.")
fail_with("home should include ripple canvas") unless home_html.include?("data-ripple-canvas")
fail_with("home should include pointer ripple behavior") unless home_html.include?("pointermove")
fail_with("home should prevent page scroll") unless home_html.include?("overflow: hidden")
fail_with("home should prevent mobile text selection") unless home_html.include?("-webkit-user-select: none") && home_html.include?("-webkit-touch-callout: none") && home_html.include?("::selection")
fail_with("home should lift the mobile welcome text slightly") unless home_html.include?("padding-top: 42vh")
fail_with("home should not add bottom safe-area padding over Safari controls") if home_html.include?("padding-bottom: max(40px, env(safe-area-inset-bottom))")
fail_with("home should match the mobile safe area") unless home_html.include?("viewport-fit=cover") && home_html.include?("#050917")
fail_with("home should use the cosmic background asset") unless home_html.include?("cosmic-space-bg.png")
fail_with("home should use cosmic display typography") unless home_html.include?("--cosmic-display-font") && home_html.include?("font-weight: 300")
fail_with("home should draw a meteor cursor trail") unless home_html.include?("quadraticCurveTo") && home_html.include?("drawMeteorTail")
fail_with("home meteor cursor should use additive light blending") unless home_html.include?("globalCompositeOperation = 'lighter'")
fail_with("home meteor cursor should keep old trail segments dim") unless home_html.include?("tailSegmentFade") && home_html.include?("maxTailSegments")
fail_with("home meteor cursor should draw a bright head glow") unless home_html.include?("createRadialGradient") && home_html.include?("headGlow")
fail_with("home cursor trail should use a stable tail") unless home_html.include?("tailLength")
fail_with("home cursor trail should stay responsive") unless home_html.include?("lerp")
fail_with("home should include a background-only cosmic asset") unless home_html.include?("/img/cosmic-space-bg.png")
fail_with("home starfield should not use a repeated grid") if home_html.include?("110px 110px") || home_html.include?("170px 170px")
fail_with("home cursor trail should suppress slow-move flashing") unless home_html.include?("movementEnergy") && home_html.include?("slowSpeedLimit")
fail_with("home cursor trail should stay visible a little longer") unless home_html.include?("tailLength = 34") && home_html.include?("drawEnergy *= 0.982")
fail_with("home cursor trail should support touch input") unless home_html.include?("touchmove") && home_html.include?("touchstart")
fail_with("mobile navigation should handle iPhone taps") unless home_html.include?("touchend") && home_html.include?("lastTouchToggle") && home_html.include?("$toggle.contains")
fail_with("home should not list dev posts") if home_html.include?('class="post-preview"')
fail_with("home should not show featured tags") if home_html.include?("FEATURED TAGS")
fail_with("home should not use the generic page header") if home_html.include?('class="site-heading"')
fail_with("home should not use the generic post list container") if home_html.include?('class="postlist-container"')

nav_expected = [
  'href="/">home</a>',
  'href="/note">note</a>',
  'href="/dev">dev</a>'
]
nav_expected.each do |snippet|
  fail_with("home navigation missing #{snippet}") unless home_html.include?(snippet)
end
fail_with("header navigation and title should not be text-selectable") unless home_html.include?(".navbar-custom *") && home_html.include?(".intro-header *") && home_html.include?("user-select: none")
fail_with("post detail title should remain text-selectable") unless home_html.include?("body.layout-post .intro-header .post-heading h1") && home_html.include?("user-select: text")

daily_index_html = daily_index.read
note_index_html = note_index.read
dev_index_html = dev_index.read
cosmic_asset = SITE.join("img/cosmic-space-bg.png")
fail_with("cosmic background asset is missing from _site") unless cosmic_asset.file?
png_signature = File.binread(cosmic_asset.to_s, 8)
fail_with("cosmic background should be a PNG asset") unless png_signature == "\x89PNG\r\n\x1A\n".b

theme_color = '<meta name="theme-color" content="#050917">'
safe_area_snippets = [
  "ios-safe-area-bg",
  "env(safe-area-inset-top)",
  "background: #050917",
  "z-index: 2"
]
fixed_nav_snippets = [
  ".navbar-custom.is-fixed",
  "rgba(5, 9, 23, .94)",
  "border-bottom-color: rgba(255, 255, 255, .08)"
]
hamburger_snippets = [
  ".navbar-default .navbar-toggle .icon-bar",
  "height: 1px",
  "width: 21px",
  "margin-top: 5px"
]
content_background_snippets = [
  'class="layout-',
  'class="site-main"',
  "background: #ffffff",
  "background-color: #050917",
  "background-image: linear-gradient(180deg, #050917 0, #050917 140px, #ffffff 140px, #ffffff 100%)",
  "background-size: 100% 100%",
  "background-color: transparent",
  "body.layout-home .site-main",
  "body.layout-home",
  "min-height: 100vh"
]
mobile_menu_snippets = [
  "#huxblog_navbar .navbar-collapse",
  ".navbar-custom.is-fixed #huxblog_navbar .navbar-collapse a",
  "box-shadow: 0 10px 26px rgba(0, 0, 0, .24)"
]
cosmic_typography_snippets = [
  "--cosmic-display-font",
  "font-size: 16px",
  "font-size: 15px",
  "text-transform: none",
  "text-rendering: geometricPrecision",
  ".intro-header .site-heading h1",
  ".intro-header.space-header .site-heading h1",
  ".intro-header .post-heading h1"
]
horizontal_overflow_snippets = [
  "overflow-x: hidden",
  "max-width: 100vw",
  "overflow-wrap: anywhere",
  "overflow: visible"
]
{
  "home" => home_html,
  "daily" => daily_index_html,
  "note" => note_index_html,
  "dev" => dev_index_html
}.each do |label, html|
  safe_area_snippets.each do |snippet|
    fail_with("#{label} page should render the iPhone notch safe-area background") unless html.include?(snippet)
  end
  content_background_snippets.each do |snippet|
    fail_with("#{label} page should keep page content separate from the notch background") unless html.include?(snippet)
  end
  fixed_nav_snippets.each do |snippet|
    fail_with("#{label} page should keep the fixed top navigation in the space theme") unless html.include?(snippet)
  end
  hamburger_snippets.each do |snippet|
    fail_with("#{label} page should keep the mobile hamburger icon thin") unless html.include?(snippet)
  end
  mobile_menu_snippets.each do |snippet|
    fail_with("#{label} page should keep scrolled mobile menu labels visible") unless html.include?(snippet)
  end
  cosmic_typography_snippets.each do |snippet|
    fail_with("#{label} page should use the cosmic typography style") unless html.include?(snippet)
  end
  horizontal_overflow_snippets.each do |snippet|
    fail_with("#{label} page should prevent horizontal swipe whitespace") unless html.include?(snippet)
  end
  fail_with("#{label} page should not include the old repeated star grid") if html.include?("background-size: 110px 110px")
end
fail_with("daily page should use the space mobile theme color") unless daily_index_html.include?(theme_color)
fail_with("note page should use the space mobile theme color") unless note_index_html.include?(theme_color)
fail_with("dev page should use the space mobile theme color") unless dev_index_html.include?(theme_color)
fail_with("daily compatibility page should link to note") unless daily_index_html.include?('href="/note/"')
fail_with("note page should list daily posts") unless note_index_html.include?("post-preview")
fail_with("dev page should hide old dev posts") if dev_index_html.include?('class="post-preview"')
fail_with("note page should use the space header") unless note_index_html.include?("space-header")
fail_with("dev page should use the space header") unless dev_index_html.include?("space-header")
fail_with("note page should not include cursor canvas") if note_index_html.include?("data-ripple-canvas")
fail_with("dev page should not include cursor canvas") if dev_index_html.include?("data-ripple-canvas")

list_style_snippets = [
  ".layout-page .post-preview",
  "border-radius: 8px",
  "box-shadow: 0 14px 42px",
  ".layout-page .post-preview > .post-meta",
  ".layout-page .postlist-container > hr"
]
list_style_snippets.each do |snippet|
  fail_with("list pages should use the refined list styling") unless pickth_css.include?(snippet)
end

html_document_style_snippets = [
  ".post-container .html-document-list",
  ".post-container .html-document-item",
  "grid-template-columns: minmax(0, 1fr) auto",
  ".post-container .html-document-meta"
]
html_document_style_snippets.each do |snippet|
  fail_with("HTML document post should use compact document list styling") unless pickth_css.include?(snippet)
end

space_header_snippets = [
  "cosmic-space-bg.png",
  ".intro-header:before",
  ".intro-header:after"
]

(ROOT.join("_posts").glob("*.{md,markdown}") + ROOT.join("_daily").glob("*.{md,markdown}")).each do |path|
  front_matter, = read_front_matter(path)
  built_path = built_path_for(page_url(path, front_matter))
  next unless built_path.file?

  html = built_path.read
  space_header_snippets.each do |snippet|
    fail_with("post page should use the global space header: #{built_path}") unless html.include?(snippet)
  end
end

ROOT.join("_daily").glob("*.{md,markdown}").each do |path|
  front_matter, = read_front_matter(path)
  url = page_url(path, front_matter)
  built_path = built_path_for(url)

  fail_with("daily page was not written: #{url}") unless built_path.file?

  if front_matter["hidden"] == true && note_index_html.include?("href=\"#{url}\"")
    fail_with("hidden daily page is linked from note index: #{url}")
  end
end

feed_html = SITE.join("feed.xml").read
category_index_html = SITE.join("category/index.html").read
tag_cloud_html = category_index_html[/<div id='tag_cloud' class="tags">(.*?)<\/div>/m, 1].to_s
ROOT.join("_posts").glob("*.{md,markdown}").each do |path|
  front_matter, = read_front_matter(path)
  title = front_matter["title"].to_s
  tags = [front_matter["tags"]].flatten.compact.map(&:to_s)
  fail_with("old dev post should be marked hidden: #{path}") unless front_matter["hidden"] == true
  fail_with("hidden dev post is linked from dev page: #{title}") if dev_index_html.include?(title)
  fail_with("hidden dev post is exposed in feed: #{title}") if feed_html.include?(title)
  tags.each do |tag|
    fail_with("category index exposes hidden dev tag: #{tag}") if tag_cloud_html.include?("/category/#{tag}")
  end
end

documents = Psych.safe_load(ROOT.join("_data/html_documents.yml").read, aliases: true) || []
html_documents_html = html_documents.read
fail_with("HTML document list post should use compact list markup") unless html_documents_html.include?("html-document-list") && html_documents_html.include?("html-document-item")
fail_with("HTML document list post should not render document items as large markdown headings") if html_documents_html.include?("<h3")

documents.each do |document|
  path = document["path"].to_s
  fail_with("registered HTML document missing from _site: #{path}") unless built_path_for(path).file?
  fail_with("HTML document list does not link to #{path}") unless html_documents_html.include?("href=\"#{path}\"")
end

puts "OK: built site verified."
