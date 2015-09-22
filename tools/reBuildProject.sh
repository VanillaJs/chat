#!/usr/bin/env bash

export PATH="/brew/bin:$PATH"
export MANPATH="/brew/share/man:$MANPATH"
export INFOPATH="/brew/share/info:$INFOPATH"

cd ../
npm install
npm clean
npm build
cd ./server
ps -ax | grep 'mongod' | grep -v grep | awk '{print $1}' | xargs kill -9
mongod --dbpath db/ &
ps -ax | grep 'node' | grep -v grep | awk '{print $1}' | xargs kill -9
cd ../ && npm start
