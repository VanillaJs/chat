VM: vjs.cloudapp.net
```
apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
mkdir /brew
git clone https://github.com/Homebrew/linuxbrew.git /brew

export PATH="/brew/bin:$PATH"
export MANPATH="/brew/share/man:$MANPATH"
export INFOPATH="/brew/share/info:$INFOPATH"

brew install node

cd /vjs/chat/tools && ls /vjs/chat/tools/ | xargs chmod +x
crontab: * * * * * /vjs/chat/tools/checkIfNewRevision.sh && /vjs/chat/tools/reBuildProject.sh
```
