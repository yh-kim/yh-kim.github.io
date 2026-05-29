#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "cgi"
require "fileutils"
require "optparse"
require "pathname"
require "psych"

ROOT = Pathname.new(__dir__).join("..").expand_path
DATA_FILE = ROOT.join("_data/html_documents.yml")
TARGET_DIR = ROOT.join("html-documents")

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def usage
  <<~TEXT
    Usage:
      ruby scripts/add-html-document.rb
      ruby scripts/add-html-document.rb SOURCE.html --title "Title" [options]

    Options:
      --sync                   Sync _data/html_documents.yml from html-documents/. This is the default when SOURCE.html is omitted.
      --slug SLUG              Output filename without .html. Defaults to source filename.
      --description TEXT       Description shown in /daily/html-documents/.
      --date YYYY-MM-DD        Document date. Defaults to today.
      --tags TAG1,TAG2         Comma-separated tags.
      --force                  Replace an existing file and registry entry for the same path.

    Example:
      ruby scripts/add-html-document.rb
      ruby scripts/add-html-document.rb ~/Downloads/note.html --title "시험 정리" --slug exam-note --tags Study,HTML
  TEXT
end

def slugify(value)
  slug = value.to_s.downcase
              .gsub(/\.html\z/i, "")
              .gsub(/[^a-z0-9가-힣]+/, "-")
              .gsub(/\A-+|-+\z/, "")
  slug.empty? ? nil : slug
end

def load_documents
  return [] unless DATA_FILE.file?

  documents = Psych.safe_load(DATA_FILE.read, aliases: true) || []
  fail_with("_data/html_documents.yml must be a list") unless documents.is_a?(Array)

  documents
end

def dump_documents(documents)
  yaml = Psych.dump(documents, line_width: -1)
  yaml = yaml.sub(/\A---\n/, "")
  DATA_FILE.write(yaml)
end

def title_from_html(path)
  text = path.read
  match = text.match(%r{<title[^>]*>(.*?)</title>}im)
  title = match && match[1].gsub(/\s+/, " ").strip
  return title unless title.to_s.empty?

  path.basename(".html").to_s.split(/[-_]+/).map(&:capitalize).join(" ")
end

def description_from_html(path)
  text = path.read
  match = text.match(%r{<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>}im)
  match && match[1].gsub(/\s+/, " ").strip
end

def ensure_link_preview_metadata(path, public_path, title:, description:)
  text = path.read
  return unless text.match?(%r{</head>}i)

  changed = false
  additions = []
  clean_title = CGI.escapeHTML(title.to_s.strip.empty? ? title_from_html(path) : title.to_s.strip)
  clean_description = CGI.escapeHTML(description.to_s.strip.empty? ? (description_from_html(path) || "Pimi's Blog") : description.to_s.strip)
  clean_url = "https://blog.pickth.com#{public_path}"

  unless text.include?('href="/img/favicon.ico"')
    additions << '  <link rel="shortcut icon" href="/img/favicon.ico">'
    changed = true
  end

  unless text.include?('property="og:image"') && text.include?("https://blog.pickth.com/img/og-image.png")
    additions.concat([
      '  <meta property="og:type" content="website">',
      '  <meta property="og:site_name" content="Pimi\'s Blog">',
      "  <meta property=\"og:title\" content=\"#{clean_title}\">",
      "  <meta property=\"og:description\" content=\"#{clean_description}\">",
      "  <meta property=\"og:url\" content=\"#{clean_url}\">",
      '  <meta property="og:image" content="https://blog.pickth.com/img/og-image.png">',
      '  <meta property="og:image:secure_url" content="https://blog.pickth.com/img/og-image.png">',
      '  <meta property="og:image:type" content="image/png">',
      '  <meta property="og:image:width" content="512">',
      '  <meta property="og:image:height" content="512">',
      '  <meta property="og:image:alt" content="Pimi\'s Blog space icon">',
      '  <meta name="twitter:card" content="summary">',
      "  <meta name=\"twitter:title\" content=\"#{clean_title}\">",
      "  <meta name=\"twitter:description\" content=\"#{clean_description}\">",
      '  <meta name="twitter:image" content="https://blog.pickth.com/img/og-image.png">'
    ])
    changed = true
  end

  return unless changed

  path.write(text.sub(%r{</head>}i, "#{additions.join("\n")}\n</head>"))
end

def sync_documents
  TARGET_DIR.mkpath
  DATA_FILE.dirname.mkpath

  TARGET_DIR.glob("**/*.html").sort.each do |file|
    relative_path = file.relative_path_from(TARGET_DIR).to_s
    public_path = "/html-documents/#{relative_path}"
    ensure_link_preview_metadata(
      file,
      public_path,
      title: title_from_html(file),
      description: description_from_html(file).to_s
    )
  end

  existing_documents = load_documents
  existing_by_path = existing_documents.each_with_object({}) do |document, index|
    next unless document.is_a?(Hash)

    path = document["path"].to_s
    index[path] = document if path.start_with?("/html-documents/") && path.end_with?(".html")
  end

  documents = TARGET_DIR.glob("*.html").sort.map do |file|
    path = "/html-documents/#{file.basename}"
    existing = existing_by_path[path] || {}
    entry = {
      "title" => existing["title"].to_s.empty? ? title_from_html(file) : existing["title"],
      "description" => existing["description"].to_s,
      "path" => path,
      "date" => existing["date"].to_s.empty? ? Date.today.iso8601 : existing["date"].to_s
    }
    entry["tags"] = existing["tags"] if existing["tags"].is_a?(Array) && !existing["tags"].empty?
    entry
  end

  fail_with("html-documents/ must contain at least one .html file") if documents.empty?

  dump_documents(documents)

  puts "OK: synced #{documents.length} HTML document(s)."
  puts "List page: /daily/html-documents/"
end

options = {
  date: Date.today.iso8601,
  description: "",
  tags: [],
  force: false,
  sync: false
}

parser = OptionParser.new do |opts|
  opts.banner = usage
  opts.on("--sync") { options[:sync] = true }
  opts.on("--slug SLUG") { |value| options[:slug] = value }
  opts.on("--title TITLE") { |value| options[:title] = value }
  opts.on("--description TEXT") { |value| options[:description] = value }
  opts.on("--date DATE") { |value| options[:date] = value }
  opts.on("--tags TAGS") do |value|
    options[:tags] = value.split(",").map(&:strip).reject(&:empty?)
  end
  opts.on("--force") { options[:force] = true }
  opts.on("-h", "--help") do
    puts usage
    exit 0
  end
end

parser.parse!

source_arg = ARGV.shift
if options[:sync] || source_arg.nil?
  sync_documents
  exit 0
end

source = Pathname.new(source_arg).expand_path
fail_with("source file does not exist: #{source}") unless source.file?
fail_with("source file must end with .html: #{source}") unless source.extname.downcase == ".html"

title = options[:title].to_s.strip
fail_with("--title is required") if title.empty?

begin
  Date.iso8601(options[:date])
rescue Date::Error
  fail_with("--date must use YYYY-MM-DD: #{options[:date]}")
end

slug = slugify(options[:slug] || source.basename.to_s)
fail_with("could not create a slug. Pass --slug explicitly.") unless slug

TARGET_DIR.mkpath
DATA_FILE.dirname.mkpath

target = TARGET_DIR.join("#{slug}.html")
path = "/html-documents/#{slug}.html"

documents = load_documents
existing_index = documents.index { |document| document.is_a?(Hash) && document["path"].to_s == path }

if existing_index && !options[:force]
  fail_with("#{path} is already registered. Use --force to replace it.")
end

same_file = target.exist? && source.realpath == target.realpath

if target.exist? && !options[:force] && !same_file
  fail_with("#{target.relative_path_from(ROOT)} already exists. Use --force to replace it.")
end

FileUtils.cp(source, target) unless same_file
ensure_link_preview_metadata(target, path, title: title, description: options[:description].to_s)

entry = {
  "title" => title,
  "description" => options[:description].to_s,
  "path" => path,
  "date" => options[:date].to_s
}
entry["tags"] = options[:tags] unless options[:tags].empty?

if existing_index
  documents[existing_index] = entry
else
  documents << entry
end

dump_documents(documents)

puts "OK: added #{path}"
puts "List page: /daily/html-documents/"
