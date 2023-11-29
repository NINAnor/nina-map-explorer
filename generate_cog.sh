#!/bin/bash

set -ex

export MASK=$(mktemp .cog.XXXXXXX.tif -p .)
export NORMALIZED=$(mktemp .cog.XXXXXXX.tif -p .)
export RGBA=$(mktemp .cog.XXXXXXX.tif -p .)

gdal_translate -scale 0 1 255 255 $1 $MASK
gdal_translate -scale 0 1 0 255 $1 $NORMALIZED
gdal_merge.py -separate -o $RGBA -of GTiff $NORMALIZED $NORMALIZED $NORMALIZED $MASK
gdal_translate $RGBA $2 -of COG -co TARGET_SRS=EPSG:3857 -co ADD_ALPHA=NO -co COMPRESS=LZW -co LEVEL=9
rm $MASK $NORMALIZED $RGBA;
