#!/bin/bash
# usage: enc_full.sh <v3dir> <R> <framesdir> <out>
D=$1; R=$2; F=$3; O=$4; cd $D
ffmpeg -v error -y -framerate 30 -i $F/f%05d.png -i mix$R.wav -filter_complex "[0:v]format=yuv420p,noise=c0s=3:c0f=t+u[v];[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[au]" -map "[v]" -map "[au]" -c:v libx264 -preset slow -crf 19 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ar 48000 -shortest $O
echo "encfull $R done"
