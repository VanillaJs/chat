# YaShri2015Airport serverside 4 proxy queries

* sudo npm install
* npm install forever -g

crontab -e

  * * * * *  cd /ya/YaShri2015Airport && git pull && gulp build
  0 12 * * * cd /ya/YaShri2015Airport/server && curl -v  -X GET "https://api.flightstats.com/flex/airports/rest/v1/json/active?appId=01e8e01e&appKey=1d0c14aeebb6875e849b703c8863c724" > models/airports.json

/etc/rc.local

export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
cd /ya/YaShri2015Airport/server && forever stopall && forever --watch --watchDirectory ./  start -c 'node --harmony' app.js