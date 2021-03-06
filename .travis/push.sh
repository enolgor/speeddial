#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout master
  git add .
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin-pages https://${GH_TOKEN}@github.com/enolgor/speeddial.git > /dev/null 2>&1
  git push origin-pages --delete gh-pages
  git subtree push --prefix docs origin-pages gh-pages
}

setup_git
commit_website_files
upload_files
