#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "psych"

ROOT = Pathname.new(__dir__).join("..").expand_path
DATA_FILE = ROOT.join("_data/html_documents.yml")
LIST_POST = ROOT.join("_daily/2026-05-27-html-documents.markdown")
RECIPE_DATA_FILE = ROOT.join("p/recipes/assets/recipes.js")

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def relative(path)
  Pathname.new(path).relative_path_from(ROOT).to_s
end

def read_front_matter(path)
  text = path.read
  return [{}, text] unless text.start_with?("---\n")

  parts = text.split(/^---\s*$/, 3)
  front_matter = Psych.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
  [front_matter, parts[2] || ""]
rescue Psych::SyntaxError => e
  fail_with("#{relative(path)} has invalid front matter: #{e.message}")
end

fail_with("_data/html_documents.yml is missing") unless DATA_FILE.file?
fail_with("_daily/2026-05-27-html-documents.markdown is missing") unless LIST_POST.file?

documents = Psych.safe_load(DATA_FILE.read, aliases: true) || []
fail_with("_data/html_documents.yml must be a list") unless documents.is_a?(Array)
fail_with("_data/html_documents.yml must contain at least one document") if documents.empty?

allowed_tags = %w[동물 다이어트 방탈출 맞춤법 요리]
seen_paths = {}

def document_asset_for(path)
  clean = path.delete_prefix("/")
  return ROOT.join(clean, "index.html") if path.end_with?("/")

  ROOT.join(clean)
end

documents.each_with_index do |document, index|
  label = "_data/html_documents.yml[#{index}]"
  fail_with("#{label} must be a map") unless document.is_a?(Hash)

  title = document["title"].to_s.strip
  path = document["path"].to_s.strip
  fail_with("#{label} missing title") if title.empty?
  fail_with("#{label} missing path") if path.empty?
  fail_with("#{label} path must start with /p/: #{path}") unless path.start_with?("/p/")
  fail_with("#{label} path must end with /: #{path}") unless path.end_with?("/")

  if seen_paths[path]
    fail_with("#{label} duplicates #{seen_paths[path]} at #{path}")
  end
  seen_paths[path] = label

  asset = document_asset_for(path)
  fail_with("#{label} points to missing HTML asset: #{path}") unless asset.file?

  html = asset.read
  preview_snippets = [
    '<link rel="shortcut icon" href="/img/favicon.ico">',
    '<meta property="og:site_name" content="Pimi',
    '<meta property="og:url" content="https://blog.pickth.com',
    '<meta property="og:image" content="https://blog.pickth.com/img/og-image.png">',
    '<meta property="og:image:width" content="512">',
    '<meta property="og:image:height" content="512">',
    '<meta name="twitter:card" content="summary">'
  ]
  preview_snippets.each do |snippet|
    fail_with("#{label} HTML asset missing link preview metadata: #{path}") unless html.include?(snippet)
  end

  html.scan(/href=["'](#.*?)["']/).flatten.each do |anchor|
    fail_with("#{label} must use data-scroll-target instead of hash anchor navigation: href=\"#{anchor}\"")
  end

  if document["date"]
    begin
      Date.iso8601(document["date"].to_s)
    rescue Date::Error
      fail_with("#{label} date must use YYYY-MM-DD: #{document["date"]}")
    end
  end

  tags = Array(document["tags"]).flatten.compact.map(&:to_s)
  tags.each do |tag|
    fail_with("#{label} has unsupported HTML document tag: #{tag}") unless allowed_tags.include?(tag)
  end
end

ROOT.join("p").glob("**/*.html").sort.each do |asset|
  relative_path = asset.relative_path_from(ROOT.join("p")).to_s
  public_path = relative_path.end_with?("/index.html") ? "/p/#{relative_path.delete_suffix("index.html")}" : "/p/#{relative_path}"
  html = asset.read
  preview_snippets = [
    '<link rel="shortcut icon" href="/img/favicon.ico">',
    '<meta property="og:site_name" content="Pimi',
    '<meta property="og:url" content="https://blog.pickth.com',
    '<meta property="og:image" content="https://blog.pickth.com/img/og-image.png">',
    '<meta property="og:image:width" content="512">',
    '<meta property="og:image:height" content="512">',
    '<meta name="twitter:card" content="summary">'
  ]
  preview_snippets.each do |snippet|
    fail_with("#{public_path} missing link preview metadata") unless html.include?(snippet)
  end

  html.scan(/href=["'](#.*?)["']/).flatten.each do |anchor|
    fail_with("#{public_path} must use data-scroll-target instead of hash anchor navigation: href=\"#{anchor}\"")
  end
end

if RECIPE_DATA_FILE.file?
  recipe_data = RECIPE_DATA_FILE.read
  banned_recipe_tags = %w[요리 다이어트 집밥 한그릇 밥반찬 돼지고기 묵은지 마늘쫑 오이 김치찜 비빔밥 부타노가쿠니 삼겹김치찜]
  banned_search_ingredients = %w[간장 설탕 소금 물 식초 양조식초 양조간장 고춧가루 참기름 깨 통깨 기름 맛술 미림 꿀 흑설탕 흰설탕 다진마늘]
  banned_display_phrases = [
    "레시피입니다",
    "정리했습니다",
    "저장했습니다",
    "저장한",
    "게시물의 마지막",
    "캡션 기반",
    "캡션 기준",
    "영상 확인",
    "자막 확인",
    "추가 확인",
    "보강해야"
  ]

  recipe_data.scan(/tags:\s*\[(.*?)\]/m).flatten.each do |raw_tags|
    raw_tags.scan(/"([^"]+)"/).flatten.each do |tag|
      fail_with("recipe tag must be category-like, not broad/menu/ingredient: #{tag}") if banned_recipe_tags.include?(tag)
    end
  end

  recipe_data.scan(/searchIngredients:\s*\[(.*?)\]/m).flatten.each do |raw_ingredients|
    raw_ingredients.scan(/"([^"]+)"/).flatten.each do |ingredient|
      if banned_search_ingredients.include?(ingredient)
        fail_with("recipe search ingredient must not include generic seasoning: #{ingredient}")
      end
    end
  end

  recipe_data.scan(/(?:description|memo):\s*"([^"]*)"/).flatten.each do |text|
    banned_display_phrases.each do |phrase|
      fail_with("recipe display text must describe the food, not source/workflow state: #{phrase}") if text.include?(phrase)
    end
  end

  recipe_data.scan(/steps:\s*\[(.*?)\]/m).flatten.each do |raw_steps|
    raw_steps.scan(/"([^"]+)"/).flatten.each do |step|
      banned_display_phrases.each do |phrase|
        fail_with("recipe method text must describe cooking, not source/workflow state: #{phrase}") if step.include?(phrase)
      end
    end
  end
end

front_matter, body = read_front_matter(LIST_POST)
fail_with("HTML documents daily post must keep /daily/p/ permalink") unless front_matter["permalink"] == "/daily/p/"
fail_with("HTML documents daily post must render site.data.html_documents") unless body.include?("site.data.html_documents")

puts "OK: verified #{documents.length} HTML document(s)."
