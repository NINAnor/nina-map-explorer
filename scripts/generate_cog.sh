# Converts a raster to COG using a specific method
# Default: Creates a COG with overviews
# No overview: Creates a COG without overviews 
# Remove artifacts: Creates a COG by resampling the raster to 400% and then back to the original size. 
# This method can be used to remove edge-artifacts from the raster. Compute-intensive.
# Note that resampling can change raster values and pixel sizes
# Arguments:
#   $1: input raster file
#   $2: conversion method ("default", "no_overview", or "remove_artifacts")
# Usage:
#   to_cog raster.tif default
#   to_cog raster.tif no_overview
#   to_cog raster.tif remove_artifacts
to_cog () {
  local input_file="$1"
  local method="$2"
  
  set -o xtrace

  case "$method" in
    ("default")
      gdal_translate "$input_file" "$input_file.cog" -co NUM_THREADS=ALL_CPUS -co TILING_SCHEME=GoogleMapsCompatible -of COG
      ;;
    ("no_overview")
      gdal_translate "$input_file" "$input_file.cog" -co NUM_THREADS=ALL_CPUS -co TILING_SCHEME=GoogleMapsCompatible -co OVERVIEWS=NONE -of COG
      ;;
    ("remove_artifacts")
      gdal_translate "$input_file" "$input_file.up" -co NUM_THREADS=ALL_CPUS -outsize 400% 400% -of GTiff && \
      gdal_translate "$input_file.up" "$input_file.cog" -co NUM_THREADS=ALL_CPUS -co TILING_SCHEME=GoogleMapsCompatible -co OVERVIEWS=IGNORE_EXISTING -co RESAMPLING=average -of COG
      rm "$input_file.up"
      ;;
    (*)
      echo "Invalid method. Please use 'default', 'no_overview', or 'remove_artifacts'."
      return 1
      ;;
  esac

  set +o xtrace
}

#!/bin/bash
# generate_hillshade_cog
# Gonverts a DEM/DTM to a hillshade
# Compresses to JPEG and converts to COG
# Arguments:
#   $1: input raster file with elevation data
# Usage:
#   generate_hillshade_cog raster.tif 25833
generate_hillshade_cog() {
    local filename="${1%.*}"
    local HILLSHADE_TMP=$(mktemp .hillshade.XXXXXX.tif -p .)  

    gdaldem hillshade $1 $HILLSHADE_TMP
    gdal_translate $HILLSHADE_TMP $filename.hillshade.cog -co NUM_THREADS=ALL_CPUS -co TILING_SCHEME=GoogleMapsCompatible -of COG
    rm $HILLSHADE_TMP
}

# generate_rgb_cog  
# resample ortofoto to $variable
# Compresses to DEFLATE and converts to COG
# Arguments:
#   $1: input raster file with RGB data
#   $2: resample value (optional)
# Usage:
#   generate_rgb_cog raster.tif 25833 1
generate_rgb_cog() {
    local filename="${1%.*}"
    local RGB_TMP=$(mktemp .rgb.XXXXXX.tif -p .)  

    # Get file size in bytes
    file_size_bytes=$(stat -c%s "$1")

    # Convert file size to GB
    file_size_gb=$(echo "$file_size_bytes / 1024 / 1024 / 1024" | bc)

    # Check if file size is greater than 2 GB
    if [ $file_size_gb -gt 2 ]
    then
        BLOCKSIZE=512
        BIGTIFF=YES
        echo "File size > 2 GB: Using BLOCKSIZE=512 and BIGTIFF=YES"
    else
        BLOCKSIZE=256
        BIGTIFF=NO
        echo "File size <= 2 GB: Using BLOCKSIZE=256 and BIGTIFF=NO"
    fi

    if [ -z "$2" ]; then
        gdal_translate $1 $filename.cog -a_srs EPSG:$epsg -of COG -co BLOCKSIZE=$BLOCKSIZE -co OVERVIEW_RESAMPLING=BILINEAR -co COMPRESS=DEFLATE -co NUM_THREADS=ALL_CPUS -co BIGTIFF=$BIGTIFF
    else
        gdalwarp -tr $2 $2 -r bilinear $1 $RGB_TMP
        echo "Resampling to $2"
        gdal_translate $RGB_TMP $filename.cog -a_srs EPSG:$epsg -of COG -co BLOCKSIZE=$BLOCKSIZE -co OVERVIEW_RESAMPLING=BILINEAR -co COMPRESS=DEFLATE -co NUM_THREADS=ALL_CPUS -co BIGTIFF=$BIGTIFF
    fi
    rm $RGB_TMP
}