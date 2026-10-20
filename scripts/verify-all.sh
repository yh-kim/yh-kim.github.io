#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

ruby scripts/verify-project-structure.rb
ruby scripts/verify-daily-links.rb
ruby scripts/verify-html-documents.rb
ruby scripts/verify-content-links.rb

if [[ -f Gemfile ]] && command -v bundle >/dev/null 2>&1; then
  bundle exec jekyll build
  ruby scripts/verify-built-site.rb
elif command -v jekyll >/dev/null 2>&1; then
  jekyll build
  ruby scripts/verify-built-site.rb
else
  jekyll_executable="$(ruby -e 'print Gem.bin_path("jekyll", "jekyll")' 2>/dev/null || true)"
  if [[ -n "$jekyll_executable" && -x "$jekyll_executable" ]]; then
    "$jekyll_executable" build
    ruby scripts/verify-built-site.rb
  else
    printf '%s\n' 'SKIP: Jekyll is unavailable; build and built-site checks were not run.'
  fi
fi

ruby scripts/verify-privacy.rb
