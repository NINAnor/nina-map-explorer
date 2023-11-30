import { Pool, fromUrl, rgb } from 'geotiff';
import { encode } from 'fast-png';

/**
 * transform x/y/z to webmercator-bbox
 * @param x
 * @param y
 * @param z
 * @returns {number[]} [minx, miny, maxx, maxy]
 */
function merc(x, y, z) {
  // Source: https://qiita.com/MALORGIS/items/1a9114dd090e5b891bf7
  const GEO_R = 6378137;
  const orgX = -1 * ((2 * GEO_R * Math.PI) / 2);
  const orgY = (2 * GEO_R * Math.PI) / 2;
  const unit = (2 * GEO_R * Math.PI) / Math.pow(2, z);
  const minx = orgX + x * unit;
  const maxx = orgX + (x + 1) * unit;
  const miny = orgY - (y + 1) * unit;
  const maxy = orgY - y * unit;
  return [minx, miny, maxx, maxy];
};

// source: https://gist.github.com/craigsc/fdb867f8971ff5b4ae42de4e0d7c229e
const meters2Degrees= function(x, y) {
  let lon = x *  180 / 20037508.34 ;
  let lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90; 
  return [lon, lat];
}

// source: https://gist.github.com/craigsc/fdb867f8971ff5b4ae42de4e0d7c229e
const bboxMeters2Degrees = function(bbox) {
  let swLatLng = meters2Degrees(bbox[0], bbox[1]);
  let neLatLng = meters2Degrees(bbox[2], bbox[3]);
  return [swLatLng[0], swLatLng[1], neLatLng[0], neLatLng[1]];
}

// source: https://gist.github.com/craigsc/fdb867f8971ff5b4ae42de4e0d7c229e
const getBboxInWebMercator = async function(firstTile) {
  const bbox = firstTile.getBoundingBox();
  return bboxMeters2Degrees(bbox);
};

function toUrlAndBBox(url) {
  const re = new RegExp(/(cogs?:\/\/.+)\/(\d+)\/(\d+)\/(\d+)/);
  const result = url.match(re);

  let bbox = merc(
    Number(result[3]), 
    Number(result[4]),
    Number(result[2]), 
  )

  return [
    result[1], 
    bbox,
  ]
}

class COG {
  constructor(url) {
    this.url = url;
    this.internal_url = this.url.replace(/^cog/, 'http');
    this.tiff = null;
    this.width = 0;
    this.height = 0;
  }

  load = async () => {
    let response = await fromUrl(this.internal_url);
    this.tiff = response;
    let image = await this.tiff.getImage();
    this.height = image.getTileHeight();
    this.width = image.getTileWidth();
    this.bbox = await getBboxInWebMercator(image);
    this.bandsCount = image.getSamplesPerPixel();
    if (this.bandsCount !== 4) {
      throw Error(`Only 4 bands (RGBA) GEOTiffs are supported`);
    }
    return this;
  }
}

export default class COGProtocol {

  constructor() {
    this.pool = new Pool();
    this.tiles = new Map();
  }

  // TODO: handle cancel
  tile = (params, callback) => {
    if (params.type === "json") {
      // if the tile is a json load the GEOTiff header
      // this serves only to setup the layer
      let url = params.url;
      let instance = this.tiles.get(url);
      if (!instance) {
        instance = new COG(url);
        this.tiles.set(url, instance)
      }
      instance.load().then(cog => {
        // add a new tile of type image to the map
        const tilejson = {
          tiles: [cog.url + "/{z}/{x}/{y}/"],
          minzoom: 0,
          maxzoom: 24,
          bounds: instance.bbox,
        };
        callback(null, tilejson, null, null);
      }).catch(e => {
        callback(e, null, null, null);
      })

      return { cancel: () => {} };
    } else {
      // if it is an image, perform the actual fetch of the image portion
      let [httpUrl, bbox] = toUrlAndBBox(params.url);
      let instance = this.tiles.get(httpUrl);

      const controller = new AbortController();
      const signal = controller.signal;
      let cancel = () => {
        controller.abort();
      };

      instance.tiff.readRasters({
        bbox,
        // bands: []
        width: instance.width,
        height: instance.height,
        interleave: true,
        fillValue: NaN,
        pool: this.pool,
        signal,
      }).then((data) => {
        const png = encode({
          data: new Uint8ClampedArray(data, 
            data.width,
            data.height,
          ),
          width: data.width,
          height: data.height,
          channels: 4,
        });
        callback(null, png, null, null);
      }).catch(e => {
        if (e.name !== "AbortError") {
          callback(e, null, null, null);
        }
      });

      return { cancel };
    }
    return { cancel: () => { } };
  }
}