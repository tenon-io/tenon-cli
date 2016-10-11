#!/usr/bin/env bash

# Tag the current commit
export REPO_TAG=$CURR_VER #-$TRAVIS_BUILD_NUMBER
export GITHUB_USER=tenon-io
export GITHUB_REPO=tenon-cli
git tag $REPO_TAG $TRAVIS_COMMIT -m "Tagging $GITHUB_USER/$GITHUB_REPO at $REPO_TAG"
git push --tags
sleep 3 # this is to make sure the tag is created properly as there is a slight delay

# Package for deployment
rm -rf node_modules
npm install --no-optional --production
tar czvf /tmp/$GITHUB_REPO-$REPO_TAG.tar.gz bin bower_components client configuration lib \
         node_modules util *.json config.js tenon.js

# Download the github release binary
wget https://github.com/aktau/github-release/releases/download/v0.6.2/linux-amd64-github-release.tar.bz2
tar xvjf linux-amd64-github-release.tar.bz2

# Create a release
bin/linux/amd64/github-release release \
    --user $GITHUB_USER \
    --repo $GITHUB_REPO \
    --tag "${GITHUB_REPO}-${REPO_TAG}"\
    --name "${GITHUB_REPO}-${REPO_TAG}" \

# Publish the tar file to the repository
bin/linux/amd64/github-release upload \
    --user $GITHUB_USER \
    --repo $GITHUB_REPO \
    --tag "${GITHUB_REPO}-${REPO_TAG}"\
    --name "${GITHUB_REPO}-${REPO_TAG}.tar.gz" \
    --file /tmp/$GITHUB_REPO-$REPO_TAG.tar.gz
