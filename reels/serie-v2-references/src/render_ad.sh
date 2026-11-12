#!/bin/bash
# usage: render_ad.sh <v3dir> <port> <page> <w> <h> <outdir> <dur>
D=$1; PORT=$2; PAGE=$3; W=$4; H=$5; OUT=$6; DUR=$7
N=$(python3 -I -c "print(round($DUR*30))"); rm -rf $OUT; mkdir -p $OUT; q=$(( (N + 3) / 4 ))
for i in 0 1 2 3; do a=$(( i * q )); b=$(( (i + 1) * q )); [ $b -gt $N ] && b=$N
  node $D/render2.js http://127.0.0.1:$PORT/$PAGE $OUT $W $H all 30 $DUR $a $b > $OUT.log$i 2>&1 & done
wait; echo "$PAGE $(ls $OUT | wc -l)/$N"
