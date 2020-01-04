#!/usr/bin/env bash

echo "Release script"

echo "New version:"
read version

echo "Building library and docs with new version"
npm run build
npm run docs

git add .
git commit -m "Building library and docs for v${version}"

npm version ${version}
