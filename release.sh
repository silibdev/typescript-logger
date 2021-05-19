#!/usr/bin/env bash

echo "Release script"

echo "New version:"
read version

echo "Building library and docs with new version"
npm run clean
npm run docs
npm run build

git add .
git commit -m "Building library and docs for v${version}"

npm version ${version}
