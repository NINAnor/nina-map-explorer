# generate_pmtiles
# Converts a GeoPackage file to PMTiles
# Output PMTiles file can be checked here: https://pmtiles.io/
# Arguments:
#   $1: Path to input GeoPackage file
#   $2: Path to output PMTiles file
#   $3: Minimum zoom level (e.g. 9)
#   $4: Maximum zoom level (e.g. 15, larger than 15 is not recommended)
#   $5: Run in Docker container (YES/NO, default: NO)
#   $6: Path to data directory (default: $PWD)
# Usage: generate_pmtiles /path/to/input.gpkg /path/to/output.pmtiles 12 15 YES /path/to/data
generate_pmtiles () {
    local input=$1
    local output=$2
    local minzoom=$3
    local maxzoom=$4
    local docker=${5:-NO}
    local datadir=${6:-$PWD}

    if [ "$docker" = "YES" ]
    then
        # Run ogr2ogr in a Docker container
        echo "Running generate_pmtiles in a Docker container"
        docker run --rm -v $PWD:/data osgeo/gdal:alpine-ultrasmall-latest \
            ogr2ogr -skipfailures -f PMTiles "/data/$output" "/data/$input" -dsco MAXZOOM="$maxzoom" -dsco MINZOOM="$minzoom"
    else
        # Run ogr2ogr directly
        ogr2ogr -skipfailures -f PMTiles "$output" "$input" -dsco MAXZOOM="$maxzoom" -dsco MINZOOM="$minzoom"
    fi
}