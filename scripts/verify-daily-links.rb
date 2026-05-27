#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "psych"
require "uri"
require "time"

ROOT = Pathname.new(__dir__).join("..").expand_path

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
rescue Psych::SyntaxError => e
  fail_with("#{path.relative_path_from(ROOT)} has invalid front matter: #{e.message}")
end

def slug_from(path)
  path.basename(path.extname).to_s
end

def page_url(path, front_matter)
  permalink = front_matter["permalink"]
  return permalink if permalink && !permalink.empty?

  "/daily/#{slug_from(path)}/"
end

def local_path_for(url)
  clean_url = url.split("#", 2).first.split("?", 2).first
  return nil if clean_url.empty?

  if clean_url.end_with?("/")
    ROOT.join(clean_url.delete_prefix("/"), "index.html")
  else
    ROOT.join(clean_url.delete_prefix("/"))
  end
end

def assert_asset_exists!(source_path, url)
  return if url.start_with?("http://", "https://", "mailto:", "tel:", "{{")

  path = local_path_for(url)
  return if path.nil?
  return if path.exist?

  fail_with("#{source_path.relative_path_from(ROOT)} links to missing local asset: #{url}")
end

daily_files = ROOT.join("_daily").glob("*.{md,markdown,html}").sort
fail_with("no _daily files found") if daily_files.empty?

seen_urls = {}
daily_files.each do |path|
  front_matter, body = read_front_matter(path)
  url = page_url(path, front_matter)

  fail_with("#{path.relative_path_from(ROOT)} is missing layout") unless front_matter["layout"]
  fail_with("#{path.relative_path_from(ROOT)} is missing title") unless front_matter["title"]
  if front_matter["date"].respond_to?(:to_time) && front_matter["date"].to_time > Time.now
    fail_with("#{path.relative_path_from(ROOT)} has a future date and will be listed but not written by Jekyll: #{front_matter["date"]}")
  end
  fail_with("#{path.relative_path_from(ROOT)} url must start with /daily/: #{url}") unless url.start_with?("/daily/")
  fail_with("#{path.relative_path_from(ROOT)} url must end with /: #{url}") unless url.end_with?("/")

  if seen_urls[url]
    fail_with("#{path.relative_path_from(ROOT)} duplicates #{seen_urls[url].relative_path_from(ROOT)} at #{url}")
  end
  seen_urls[url] = path

  body.scan(/(?:href|src)=["']([^"']+)["']/).flatten.each do |raw_url|
    assert_asset_exists!(path, raw_url)
  end
end

psp = ROOT.join("_daily/2026-05-27-psp-problems.markdown")
if psp.exist?
  front_matter, body = read_front_matter(psp)
  fail_with("PSP daily post must keep a stable permalink") unless front_matter["permalink"] == "/daily/psp-problems/"
  fail_with("PSP daily post must link to the source HTML") unless body.include?("html-documents/psp-problems.html")
  fail_with("PSP source HTML is missing") unless ROOT.join("html-documents/psp-problems.html").exist?
end

puts "OK: verified #{daily_files.length} daily post(s) and #{seen_urls.length} daily URL(s)."
