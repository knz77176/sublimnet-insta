#!/bin/bash
# usage: grid.sh out.jpg cols w h img...
out=$1; cols=$2; w=$3; h=$4; shift 4
args=""; n=0; for f in "$@"; do args="$args -i $f"; n=$((n+1)); done
fc=""; for i in $(seq 0 $((n-1))); do fc="$fc[$i]scale=$w:$h[s$i];"; done
lay=""; for i in $(seq 0 $((n-1))); do c=$((i % cols)); r=$((i / cols)); lay="$lay|$((c*w))_$((r*h))"; done; lay=${lay:1}
ins=""; for i in $(seq 0 $((n-1))); do ins="$ins[s$i]"; done
ffmpeg -v error -y $args -filter_complex "$fc${ins}xstack=inputs=$n:layout=$lay:fill=black" -q:v 3 $out
