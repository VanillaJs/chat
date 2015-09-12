export PATH="/brew/bin:$PATH"
export MANPATH="/brew/share/man:$MANPATH"
export INFOPATH="/brew/share/info:$INFOPATH"
cd ../server &&
npm install &&
cd ../web &&
npm install &&
cd ../web &&
rm -rf build &&
gulp build &&
ps -ax | grep 'node app.js\|node server.js' | grep -v grep | awk '{print $1}' | xargs kill -9 &&
cd ../server && node app.js