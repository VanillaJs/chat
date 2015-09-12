VM: vjs.cloudapp.net

apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
mkdir /brew
git clone https://github.com/Homebrew/linuxbrew.git /brew

export PATH="/brew/bin:$PATH"
export MANPATH="/brew/share/man:$MANPATH"
export INFOPATH="/brew/share/info:$INFOPATH"

brew install node

crontab: * * * * * cd /vjs/chat && git pull && cd /vjs/chat/server && npm install && cd /vjs/chat/web && npm install

