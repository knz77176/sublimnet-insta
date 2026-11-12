#!/bin/bash
# RGB frames -> BT.709 (tagged) H.264, so phones/TikTok show the true colours
D=$1; R=$2; cd $D
ffmpeg -v error -y -framerate 30 -i f$R/f%05d.png -i mix$R.wav -filter_complex "[0:v]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v];[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[au]" -map "[v]" -map "[au]" -c:v libx264 -preset slow -crf 19 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart -c:a aac -b:a 192k -ar 48000 -shortest final$R.mp4
echo "enc $R done"
