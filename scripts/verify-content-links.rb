#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"
require "uri"

ROOT = Pathname.new(__dir__).join("..").expand_path

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def relative(path)
  Pathname.new(path).relative_path_from(ROOT).to_s
end

def source_files
  patterns = [
    "*.html",
    "_posts/*.{md,markdown}",
    "_daily/*.{md,markdown}",
    "_layouts/*.html",
    "_includes/**/*.html",
    "category/*.html"
  ]
  patterns.flat_map { |pattern| ROOT.glob(pattern) }.uniq.sort
end

def local_target?(url)
  return false if url.nil? || url.empty?
  return false if url.start_with?("#", "@", "mailto:", "tel:", "javascript:", "data:", "//")
  return false if url.include?("{{") || url.include?("{%")

  uri = URI.parse(url)
  uri.scheme.nil? && uri.host.nil?
rescue URI::InvalidURIError
  false
end

def target_exists?(url)
  clean = url.split("#", 2).first.split("?", 2).first
  return true if clean.empty?

  clean = clean.delete_prefix("/")
  without_trailing_slash = clean.delete_suffix("/")

  return true if ROOT.join(clean).exist?
  return true if ROOT.join(clean, "index.html").exist?
  return true if ROOT.join("#{clean}.html").exist?
  return true if ROOT.join("#{without_trailing_slash}.html").exist?

  false
end

def extract_urls(text)
  text = text.gsub(/<!--.*?-->/m, "")
  text = text.gsub(/```.*?```/m, "")
  text = text.gsub(/`[^`\n]+`/, "")
  urls = []
  urls.concat(text.scan(/(?:href|src)=["']([^"']+)["']/).flatten)
  urls.concat(text.scan(/\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/).flatten)
  urls
end

checked = 0
source_files.each do |path|
  text = path.read
  extract_urls(text).each do |url|
    next unless local_target?(url)

    checked += 1
    fail_with("#{relative(path)} links to missing local target: #{url}") unless target_exists?(url)
  end
end

puts "OK: verified #{checked} local content link(s)."
