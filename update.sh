#!/bin/sh
git checkout hanshan
git pull origin hanshan
cp -rf src/* ../has/

git checkout huangshan
git pull origin huangshan
cp -rf src/* ../hus/
