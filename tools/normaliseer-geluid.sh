#!/bin/sh
# Brengt de piek van elk mp3-bestand in art/geluid/ (of de opgegeven bestanden) naar ongeveer -3 dB.
# Gebruik: sh tools/normaliseer-geluid.sh [bestand.mp3 ...]
set -e
cd "$(dirname "$0")/.."
for f in "${@:-art/geluid/*.mp3}"; do
  for g in $f; do
    piek=$(ffmpeg -v info -i "$g" -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \(-*[0-9.]*\) dB/\1/p')
    winst=$(echo "-3 - ($piek)" | bc)
    ffmpeg -v error -y -i "$g" -af "volume=${winst}dB" -codec:a libmp3lame -b:a 128k "$g.tmp.mp3" && mv "$g.tmp.mp3" "$g"
    echo "$g: piek $piek dB, +$winst dB"
  done
done
