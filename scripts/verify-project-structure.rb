#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "psych"

ROOT = Pathname.new(__dir__).join("..").expand_path

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def relative(path)
  Pathname.new(path).relative_path_from(ROOT).to_s
end

def read_front_matter(path)
  text = Pathname.new(path).read
  return {} unless text.start_with?("---\n")

  parts = text.split(/^---\s*$/, 3)
  Psych.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
rescue Psych::SyntaxError => e
  fail_with("#{relative(path)} has invalid front matter: #{e.message}")
end

def normalize_tags(tags)
  Array(tags).flatten.map(&:to_s)
end

required_files = %w[
  _config.yml
  index.html
  daily.html
  note.html
  dev.html
  category/index.html
  _layouts/default.html
  _layouts/page.html
  _layouts/post.html
  _layouts/tag.html
  _includes/head.html
  _includes/nav.html
  _includes/footer.html
]

required_dirs = %w[
  _posts
  _daily
  _layouts
  _includes
  _data
  category
  css
  js
  img
]

required_files.each do |path|
  fail_with("required file missing: #{path}") unless ROOT.join(path).file?
end

required_dirs.each do |path|
  fail_with("required directory missing: #{path}") unless ROOT.join(path).directory?
end

config = Psych.safe_load(ROOT.join("_config.yml").read, aliases: true) || {}
fail_with("_config.yml must define site title") if config["title"].to_s.strip.empty?
fail_with("_config.yml must define url") if config["url"].to_s.strip.empty?

daily_config = config.dig("collections", "daily")
fail_with("_config.yml must define collections.daily") unless daily_config.is_a?(Hash)
fail_with("collections.daily.output must be true") unless daily_config["output"] == true
fail_with("collections.daily.permalink must start with /:collection") unless daily_config["permalink"].to_s.start_with?("/:collection")

top_pages = %w[index.html daily.html note.html dev.html category/index.html]
top_pages.each do |path|
  front_matter = read_front_matter(ROOT.join(path))
  fail_with("#{path} must have front matter") if front_matter.empty?
  fail_with("#{path} must define layout") if front_matter["layout"].to_s.strip.empty?
end

post_tags = []
post_files = ROOT.join("_posts").glob("*.{md,markdown}").sort
fail_with("_posts must contain at least one post") if post_files.empty?

post_files.each do |path|
  filename = path.basename.to_s
  fail_with("#{relative(path)} filename must start with YYYY-MM-DD-") unless filename.match?(/\A\d{4}-\d{2}-\d{2}-.+\.(md|markdown)\z/)

  front_matter = read_front_matter(path)
  %w[layout title date].each do |key|
    fail_with("#{relative(path)} missing front matter key: #{key}") if front_matter[key].to_s.strip.empty?
  end

  tags = front_matter["tags"]
  fail_with("#{relative(path)} tags must be an array") unless tags.is_a?(Array)
  post_tags.concat(normalize_tags(tags))
end

daily_files = ROOT.join("_daily").glob("*.{md,markdown}").sort
fail_with("_daily must contain at least one daily post") if daily_files.empty?

daily_files.each do |path|
  filename = path.basename.to_s
  fail_with("#{relative(path)} filename must start with YYYY-MM-DD-") unless filename.match?(/\A\d{4}-\d{2}-\d{2}-.+\.(md|markdown)\z/)

  front_matter = read_front_matter(path)
  %w[layout title date].each do |key|
    fail_with("#{relative(path)} missing front matter key: #{key}") if front_matter[key].to_s.strip.empty?
  end
end

post_tags.uniq.sort.each do |tag|
  category_file = ROOT.join("category", "#{tag}.html")
  fail_with("missing category page for post tag: #{tag}") unless category_file.file?

  front_matter = read_front_matter(category_file)
  fail_with("#{relative(category_file)} must use layout: tag") unless front_matter["layout"] == "tag"
  fail_with("#{relative(category_file)} tag must match filename") unless front_matter["tag"].to_s == tag
end

puts "OK: project structure verified (#{post_files.length} post(s), #{daily_files.length} daily post(s), #{post_tags.uniq.length} category tag(s))."
