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
  repo.join("p/folder-added").mkpath
  repo.join("p/folder-added/index.html").write("<!doctype html><html><head><title>Folder Added</title></head><body>Folder</body></html>\n")

  expect_success(
    repo,
    ["ruby", "scripts/add-html-document.rb"],
    "sync HTML documents script"
  )
  expect_success(repo, ["ruby", "scripts/verify-html-documents.rb"], "HTML documents check after sync script")

  fail_with("sync HTML documents script should register files already in p") unless repo.join("_data/html_documents.yml").read.include?("/p/folder-added/")

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
      "동물"
    ],
    "add HTML document script"
  )
  expect_success(repo, ["ruby", "scripts/verify-html-documents.rb"], "HTML documents check after script")

  fail_with("add HTML document script should copy the source file") unless repo.join("p/temp-html/index.html").file?
  fail_with("add HTML document script should register the new file") unless repo.join("_data/html_documents.yml").read.include?("/p/temp-html/")
end

with_temp_repo do |repo|
  source = repo.join("tmp-html-source.html")
  source.write("<!doctype html><html><head><title>Temp</title></head><body>Temp</body></html>\n")

  expect_failure(
    repo,
    [
      "ruby",
      "scripts/add-html-document.rb",
      "tmp-html-source.html",
      "--title",
      "Temp HTML",
      "--tags",
      "Study"
    ],
    "add HTML document script unsupported tag check",
    "unsupported HTML document tag"
  )
end

with_temp_repo do |repo|
  data = repo.join("_data/html_documents.yml")
  data.write(data.read.sub("- 동물", "- Study"))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "unsupported HTML document tag check",
    "has unsupported HTML document tag"
  )
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
  FileUtils.rm_f(repo.join("p/psp/index.html"))

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
  text = data.read.sub("/p/psp/", "/psp/")
  data.write(text)

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "HTML document path scope check",
    "path must start with /p/"
  )
end

with_temp_repo do |repo|
  html = repo.join("p/psp/index.html")
  html.write(html.read.sub("</body>", '<a href="#exam">시험 정보</a></body>'))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "HTML document hash anchor navigation check",
    "must use data-scroll-target instead of hash anchor navigation"
  )
end

with_temp_repo do |repo|
  recipes = repo.join("p/recipes/assets/recipes.js")
  recipes.write(recipes.read.sub('tags: ["냉국", "여름", "반찬"]', 'tags: ["냉국", "집밥", "반찬"]'))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "recipe broad recipe tag check",
    "recipe tag must be category-like"
  )
end

with_temp_repo do |repo|
  recipes = repo.join("p/recipes/assets/recipes.js")
  recipes.write(recipes.read.sub('searchIngredients: ["오이", "양파", "청양고추", "냉면육수"]', 'searchIngredients: ["오이", "간장", "청양고추", "냉면육수"]'))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "recipe generic seasoning ingredient check",
    "search ingredient must not include generic seasoning"
  )
end

with_temp_repo do |repo|
  recipes = repo.join("p/recipes/assets/recipes.js")
  recipes.write(recipes.read.sub("오이와 냉면육수가 만드는 차갑고 새콤한 냉국", "더운 날에 바로 꺼내기 좋은 레시피입니다"))

  expect_failure(
    repo,
    ["ruby", "scripts/verify-html-documents.rb"],
    "recipe display text should describe food",
    "display text must describe the food"
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
