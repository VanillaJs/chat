#!/usr/bin/env bash

export PATH="/brew/bin:$PATH"
export MANPATH="/brew/share/man:$MANPATH"
export INFOPATH="/brew/share/info:$INFOPATH"

npm install
npm run clean
npm run build
ps -ax | grep 'mongod' | grep -v grep | awk '{print $1}' | xargs kill -9
mongod --dbpath ./server/db/ &
ps -ax | grep 'node' | grep -v grep | awk '{print $1}' | xargs kill -9
npm run server:prod
