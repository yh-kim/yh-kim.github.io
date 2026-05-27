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
  FileUtils.rm_f(repo.join("daily-assets/psp-problems.html"))

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
  text = data.read.sub("/daily-assets/psp-problems.html", "/psp-problems.html")
  data.write(text)

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "HTML document path scope check",
    "path must start with /daily-assets/"
  )
end

puts "OK: harness self-tests passed."
