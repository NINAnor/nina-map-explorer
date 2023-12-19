generate_cog () {
    local MASK=$(mktemp .cog.XXXXXXX.tif -p .)
    local NORMALIZED=$(mktemp .cog.XXXXXXX.tif -p .)
    local RGBA=$(mktemp .cog.XXXXXXX.tif -p .)

    gdal_translate -co NUM_THREADS=ALL_CPUS -scale 1 4 255 255 $1 $MASK
    gdal_translate -co NUM_THREADS=ALL_CPUS -scale 1 4 0 255 $1 $NORMALIZED
    gdal_merge.py -separate -o $RGBA -of GTiff -co NUM_THREADS=ALL_CPUS $NORMALIZED $NORMALIZED $NORMALIZED $MASK
    gdal_translate $RGBA $1.cog -of COG -co NUM_THREADS=ALL_CPUS -co TARGET_SRS=EPSG:3857 -co ADD_ALPHA=NO -co COMPRESS=LZW -co LEVEL=9
    rm $MASK $NORMALIZED $RGBA
}

generate_color_cog () {
    local RGBA=$(mktemp .cog.XXXXXXX.tif -p .)

    gdaldem color-relief $1 $2 $RGBA -alpha
    gdal_translate $RGBA $1.cog -of COG -co TARGET_SRS=EPSG:3857 -co ADD_ALPHA=NO -co COMPRESS=LZW -co LEVEL=9
    rm $RGBA
}
