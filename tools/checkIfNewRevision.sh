set -e

cd /vjs/chat && git rev-parse HEAD > /vjs/.githead && git pull && [ `cat /vjs/.githead` != `git rev-parse HEAD` ]