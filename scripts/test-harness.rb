#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "open3"
require "pathname"
require "tmpdir"

ROOT = Pathname.new(__dir__).join("..").expand_path
IGNORED = %w[.git _site .jekyll-cache node_modules].freeze

def fail_with(message)
  warn "FAIL: #{message}"
  exit 1
end

def copy_repo_to(path)
  ROOT.children.each do |entry|
    next if IGNORED.include?(entry.basename.to_s)

    FileUtils.cp_r(entry, path)
  end
end

def run_in(path, command)
  Open3.capture3(*command, chdir: path.to_s)
end

def expect_success(path, command, label)
  stdout, stderr, status = run_in(path, command)
  return if status.success?

  fail_with("#{label} should pass\nSTDOUT:\n#{stdout}\nSTDERR:\n#{stderr}")
end

def expect_failure(path, command, label, expected_message)
  stdout, stderr, status = run_in(path, command)
  fail_with("#{label} should fail") if status.success?

  combined = "#{stdout}\n#{stderr}"
  return if combined.include?(expected_message)

  fail_with("#{label} failed for the wrong reason. Expected #{expected_message.inspect}\n#{combined}")
end

def with_temp_repo
  Dir.mktmpdir("yh-blog-harness-") do |dir|
    path = Pathname.new(dir)
    copy_repo_to(path)
    yield path
  end
end

with_temp_repo do |repo|
  expect_success(repo, ["ruby", "scripts/verify-project-structure.rb"], "project structure check")
  expect_success(repo, ["ruby", "scripts/verify-daily-links.rb"], "daily link check")
  expect_success(repo, ["ruby", "scripts/verify-html-documents.rb"], "HTML documents check")
  expect_success(repo, ["ruby", "scripts/verify-content-links.rb"], "content link check")
  expect_success(repo, ["ruby", "scripts/verify-privacy.rb"], "privacy check")
end

with_temp_repo do |repo|
  source = repo.join("tmp-html-source.html")
  source.write("<!doctype html><html><head><title>Temp</title></head><body>Temp</body></html>\n")
  repo.join("html-documents/folder-added.html").write("<!doctype html><html><head><title>Folder Added</title></head><body>Folder</body></html>\n")

  expect_success(
    repo,
    ["ruby", "scripts/add-html-document.rb"],
    "sync HTML documents script"
  )
  expect_success(repo, ["ruby", "scripts/verify-html-documents.rb"], "HTML documents check after sync script")

  fail_with("sync HTML documents script should register files already in html-documents") unless repo.join("_data/html_documents.yml").read.include?("/html-documents/folder-added.html")

  expect_success(
    repo,
    [
      "ruby",
      "scripts/add-html-document.rb",
      "tmp-html-source.html",
      "--title",
      "Temp HTML",
      "--description",
      "Harness generated HTML",
      "--slug",
      "temp-html",
      "--date",
      "2026-05-27",
      "--tags",
      "Test,HTML"
    ],
    "add HTML document script"
  )
  expect_success(repo, ["ruby", "scripts/verify-html-documents.rb"], "HTML documents check after script")

  fail_with("add HTML document script should copy the source file") unless repo.join("html-documents/temp-html.html").file?
  fail_with("add HTML document script should register the new file") unless repo.join("_data/html_documents.yml").read.include?("/html-documents/temp-html.html")
end

with_temp_repo do |repo|
  post = repo.join("_daily/2026-05-27-psp-problems.markdown")
  text = post.read.sub(/^date:.*$/, "date:       2999-01-01 00:00:00")
  post.write(text)

  expect_failure(
    repo,
    ["ruby", "scripts/verify-daily-links.rb"],
    "future daily date check",
    "has a future date"
  )
end

with_temp_repo do |repo|
  FileUtils.rm_f(repo.join("html-documents/psp-problems.html"))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "missing PSP asset check",
    "points to missing HTML asset"
  )
end

with_temp_repo do |repo|
  FileUtils.rm_f(repo.join("category/Git.html"))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-project-structure.rb"],
    "missing category check",
    "missing category page for post tag: Git"
  )
end

with_temp_repo do |repo|
  data = repo.join("_data/html_documents.yml")
  text = data.read.sub("/html-documents/psp-problems.html", "/psp-problems.html")
  data.write(text)

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "HTML document path scope check",
    "path must start with /html-documents/"
  )
end

with_temp_repo do |repo|
  post = repo.join("_daily/2026-05-27-html-documents.markdown")
  personal_name = "Yong" + "hoon"
  post.write(post.read.sub("author:     \"Pimi\"", "author:     \"#{personal_name}\""))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-privacy.rb"],
    "personal name privacy check",
    "contains personal marker"
  )
end

puts "OK: harness self-tests passed."
