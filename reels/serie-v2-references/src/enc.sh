#!/bin/bash
# usage: enc.sh <v3dir> <R>
D=$1; R=$2; cd $D
ffmpeg -v error -y -framerate 30 -i s$R/f%05d.png -i ov$R.png -i mix$R.wav -filter_complex "[0:v]format=gbrp,split[a][b];[b]scale=270:480,gblur=sigma=7,curves=all='0/0 0.62/0.04 1/0.9',scale=1080:1920:flags=bilinear[g];[a][g]blend=all_mode=screen:all_opacity=0.5,vignette=angle=0.5,format=yuv420p,noise=c0s=6:c0f=t+u:c1s=2:c1f=t+u:c2s=2:c2f=t+u[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[out];[2:a]loudnorm=I=-14:TP=-1.5:LRA=11[au]" -map "[out]" -map "[au]" -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ar 48000 -shortest final$R.mp4
echo "enc $R done"
