# NINA map explorer

NINA map explorer is an experimental web application which renders maps defined by a [MapLibre](https://maplibre.org/maplibre-style-spec/) style, with the addition of [ProtoMaps Tiles](https://protomaps.com/docs/pmtiles) to serve complex spatial data as a single web-optimized file.

## datasets folder

Each dataset is a folder within `datasets`.
Each dataset folder should contain a `metadata.json` file, which contains information on where to find the style file for the map, the original file for downloads, and some additional information about the dataset. Both `style` and `source` are relative to the folder where the metadata file is located.

See `datasets/example` for an example.

## PMTiles conversion

`PMTiles` is a valid output format only for GDAL >= 3.8.

Here is an example of how to convert a GeoPackage file to PMTiles.

```bash
docker run --rm -ti -v $PWD:/host --workdir /host ghcr.io/osgeo/gdal \
    ogr2ogr -skipfailures -f PMTiles converted.pmtiles original.gpkg -dsco MAXZOOM=15
```

Full documentation is available at [gdal.org/drivers/vector/pmtiles.html](https://gdal.org/drivers/vector/pmtiles.html).

## Running the webapp

The only requirement is having a web server which supports HTTP bytes serving/ranged requests, such as NGINX.

```bash
docker run --rm -p 8000:80 -v $PWD:/usr/share/nginx/html:ro nginx
```

Then, the application can be seen by visiting [http://localhost:8000/#example](http://localhost:8000/#example). The text after the hash symbol specifies which dataset should be loaded, which match the name of the folder.
