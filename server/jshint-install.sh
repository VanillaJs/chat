npm install jshint --save &&
jshint --config ../.jshintrc &&
cd .. &&
if [ ! -f ./.git/pre-commit ];
then
    cp ./pre-commit.sample ./.git/pre-commit
fi 
