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
    "category/*.html",
    "p/**/*.html"
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

def target_exists?(url, source_path)
  clean = url.split("#", 2).first.split("?", 2).first
  return true if clean.empty?

  root_relative = clean.start_with?("/")
  clean = clean.delete_prefix("/")
  base = root_relative ? ROOT : source_path.dirname
  target = base.join(clean).cleanpath
  return false unless target == ROOT || target.to_s.start_with?("#{ROOT}#{File::SEPARATOR}")

  without_trailing_slash = target.to_s.delete_suffix("/")
  return true if target.exist?
  return true if target.join("index.html").exist?
  return true if Pathname.new("#{target}.html").exist?
  return true if Pathname.new("#{without_trailing_slash}.html").exist?

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
    fail_with("#{relative(path)} links to missing local target: #{url}") unless target_exists?(url, path)
  end
end

puts "OK: verified #{checked} local content link(s)."
