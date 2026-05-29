#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "psych"

ROOT = Pathname.new(__dir__).join("..").expand_path
DATA_FILE = ROOT.join("_data/html_documents.yml")
LIST_POST = ROOT.join("_daily/2026-05-27-html-documents.markdown")

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

seen_paths = {}
documents.each_with_index do |document, index|
  label = "_data/html_documents.yml[#{index}]"
  fail_with("#{label} must be a map") unless document.is_a?(Hash)

  title = document["title"].to_s.strip
  path = document["path"].to_s.strip
  fail_with("#{label} missing title") if title.empty?
  fail_with("#{label} missing path") if path.empty?
  fail_with("#{label} path must start with /html-documents/: #{path}") unless path.start_with?("/html-documents/")
  fail_with("#{label} path must end with .html: #{path}") unless path.end_with?(".html")

  if seen_paths[path]
    fail_with("#{label} duplicates #{seen_paths[path]} at #{path}")
  end
  seen_paths[path] = label

  asset = ROOT.join(path.delete_prefix("/"))
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

  if document["date"]
    begin
      Date.iso8601(document["date"].to_s)
    rescue Date::Error
      fail_with("#{label} date must use YYYY-MM-DD: #{document["date"]}")
    end
  end
end

ROOT.join("html-documents").glob("**/*.html").sort.each do |asset|
  public_path = "/html-documents/#{asset.relative_path_from(ROOT.join("html-documents"))}"
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
end

front_matter, body = read_front_matter(LIST_POST)
fail_with("HTML documents daily post must keep /daily/html-documents/ permalink") unless front_matter["permalink"] == "/daily/html-documents/"
fail_with("HTML documents daily post must render site.data.html_documents") unless body.include?("site.data.html_documents")

puts "OK: verified #{documents.length} HTML document(s)."
