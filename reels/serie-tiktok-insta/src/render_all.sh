#!/bin/bash
# usage: render_all.sh <scratch> <port> reel...
S=$1; PORT=$2; shift 2
for R in "$@"; do
  DUR=$(python3 -I -c "import json;print(json.load(open('$S/b2/t$R.json'))['duration'])")
  N=$(python3 -I -c "print(round($DUR*30))")
  rm -rf $S/frames$R; mkdir -p $S/frames$R
  q=$(( (N + 3) / 4 ))
  for i in 0 1 2 3; do
    a=$(( i * q )); b=$(( (i + 1) * q )); [ $b -gt $N ] && b=$N
    node $S/scripts/render.js http://127.0.0.1:$PORT/reel$R.html $S/frames$R all 30 $DUR $a $b > $S/render$R_$i.log 2>&1 &
  done
  wait
  echo "$R done $(ls $S/frames$R | wc -l)/$N"
done
