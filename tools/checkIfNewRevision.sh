#!/usr/bin/env bash

if [[ -z $(ps -ax | 'grep' 'reBuildProject' | grep -v grep) ]];
	then
		echo No reBuild Processes

		git rev-parse HEAD > /tmp/.githead
		git pull
		echo Repo Pulled

		if [[  `cat /tmp/.githead` != `git rev-parse HEAD`  ]] || [[ -z $(pgrep "node") ]];
			then
				echo Either new revision or No Node Processes
				exit 0
			else
				echo no new version and process runs
				exit 1
			fi
	else
		echo Already building
		exit 1
fi
