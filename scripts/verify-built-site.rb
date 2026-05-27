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
html_documents = SITE.join("daily/html-documents/index.html")
fail_with("_site/daily/index.html is missing") unless daily_index.file?
fail_with("_site/daily/html-documents/index.html is missing") unless html_documents.file?

daily_index_html = daily_index.read

ROOT.join("_daily").glob("*.{md,markdown}").each do |path|
  front_matter, = read_front_matter(path)
  url = page_url(path, front_matter)
  built_path = built_path_for(url)

  fail_with("daily page was not written: #{url}") unless built_path.file?

  if front_matter["hidden"] == true && daily_index_html.include?("href=\"#{url}\"")
    fail_with("hidden daily page is linked from daily index: #{url}")
  end
end

documents = Psych.safe_load(ROOT.join("_data/html_documents.yml").read, aliases: true) || []
html_documents_html = html_documents.read

documents.each do |document|
  path = document["path"].to_s
  fail_with("registered HTML document missing from _site: #{path}") unless built_path_for(path).file?
  fail_with("HTML document list does not link to #{path}") unless html_documents_html.include?("href=\"#{path}\"")
end

puts "OK: built site verified."
