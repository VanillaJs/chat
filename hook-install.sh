if [ ! -f .git/hooks/pre-commit ];
then
    cp ./pre-commit.sample ./.git/hooks/pre-commit
fi
