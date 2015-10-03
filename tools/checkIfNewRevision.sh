#!/usr/bin/env bash

git rev-parse HEAD > /tmp/.githead
echo Repo Pulled
if [[  `cat /tmp/.githead` != `git rev-parse HEAD`  ]] || [[ -z $(pgrep "node") ]];
	then
		echo Either new revision or No Node Processes
 		if [[ -z $(ps -ax | 'grep' 'reBuildProject' | grep -v grep) ]];
			then
				echo No reBuild Processes
				exit 0
			else
				echo Already building
				exit 1
			fi
	else
		echo no new version
		exit 1
fi
