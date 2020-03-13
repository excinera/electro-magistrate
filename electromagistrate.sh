#/bin/bash
while true
do date >> /home/x/electromagistrate/data/logs/run.log
cd /home/x/electromagistrate
node /home/x/electromagistrate/index.js -e -l -m $@ >> /home/x/electromagistrate/data/logs/run.log
sleep 3
done
