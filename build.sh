echo "Start build" &&

cd  ./tools/ &&

./checkIfNewRevision.sh &&

./reBuildProject.sh &&

echo "Build finished"
