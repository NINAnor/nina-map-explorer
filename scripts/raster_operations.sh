#!/bin/bash

# mosaic_rasters
# Mosaics multiple rasters into a single raster 
# Arguments:
#   $1: input directory with rasters
#   $2: output mosaiced raster
# Usage: 
#   mosaic_rasters input_dir/ output.tif
mosaic_rasters() {
    local input_dir=$1
    local output=$2
    local files=$(ls $input_dir/*.tif)
    local input_files=""
    for file in $files
    do
        # Only process .tif files
        if [[ $file == *.tif ]]; then
            input_files="$input_files $file"
        fi
    done
    gdal_merge.py -o $output -of GTiff $input_files
}

# clip_raster
# Clips the raster to the extent of a feature layer in a GeoPackage file
# Arguments:
#   $1: input raster file
#   $2: input gpkg file
#   $3: input layer name
#   $4: output clipped raster file
#   $5: nodata value (optional, default: -9999)
#   $6: coordinate system (optional, default: 25833)
# Usage:
#   clip_raster input.tif input.gpkg study_area output.tif -9999 25833    
clip_raster() {
    local input_raster=$1
    local input_gpkg=$2
    local layer_name=$3
    local output_raster=$4
    local nodata=${5:--9999}
    local crs=${6:-25833}

    # Create a virtual raster (VRT) that includes the vector layer as a mask
    gdalwarp -cutline $input_gpkg -cl $layer_name -crop_to_cutline -dstnodata $nodata -t_srs EPSG:$crs $input_raster $output_raster
}