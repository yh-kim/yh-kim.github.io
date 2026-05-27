#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"
require "find"

ROOT = Pathname.new(__dir__).join("..").expand_path
SITE = ROOT.join("_site")

SOURCE_FORBIDDEN = [
  "Yonghoon",
  "yonghoon",
  "김용훈",
  "side-avatar-yonghoon",
  "yonghoon.kim",
  "btc_yh"
].freeze

VISIBLE_FORBIDDEN = [
  "href=\"/about",
  "href=\"/portfolio",
  "href=\"/feed.xml",
  "facebook.com",
  "github.com/yh-kim",
  "fa-rss",
  "fa-facebook",
  "fa-github",
  "side-avatar-yonghoon",
  "Yonghoon",
  "yonghoon",
  "김용훈"
].freeze

SOURCE_SKIP_DIRS = %w[.git _site .jekyll-cache node_modules scripts docs].freeze
SOURCE_SKIP_FILES = %w[LICENSE].freeze

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def source_files
  files = []
  Find.find(ROOT.to_s) do |entry|
    path = Pathname.new(entry)
    if path.directory? && SOURCE_SKIP_DIRS.include?(path.basename.to_s)
      Find.prune
    end

    next if path.directory?
    next if SOURCE_SKIP_FILES.include?(path.basename.to_s)
    next if [".jpg", ".png", ".ico"].include?(path.extname)

    files << path
  end
  files
end

source_files.each do |path|
  text = path.read
  SOURCE_FORBIDDEN.each do |pattern|
    fail_with("#{path.relative_path_from(ROOT)} contains personal marker: #{pattern}") if text.include?(pattern)
  end
end

if SITE.directory?
  fail_with("_site/about should not be built") if SITE.join("about").exist? || SITE.join("about.html").exist?
  fail_with("_site/portfolio should not be built") if SITE.join("portfolio").exist? || SITE.join("portfolio.html").exist?

  SITE.glob("**/*.html").each do |path|
    text = path.read
    VISIBLE_FORBIDDEN.each do |pattern|
      fail_with("#{path.relative_path_from(ROOT)} exposes hidden personal/social link: #{pattern}") if text.include?(pattern)
    end
  end
end

puts "OK: privacy exposure checks passed."
