JSHINT=./node_modules/.bin/jshint
npm install jshint --save &&
$JSHINT --config ../.jshintrc &&
cd .. &&
if [ ! -f ./.git/pre-commit ];
then
    cp ./pre-commit.sample ./.git/pre-commit
fi
