#!/bin/sh
git checkout hanshan
git pull
cp -rf src/* ../has/

git checkout huangshan
git pull
cp -rf src/* ../hus/
