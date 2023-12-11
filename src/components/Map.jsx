import { useRef, useEffect, useContext } from 'react';
import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';

import * as pmtiles from 'pmtiles';
import { ProtocolV3 } from '@ninanor/maplibre-gl-cog';

import MapContext from '../contexts/map';
import useMetadata from '../hooks/useMetadata';


let protocol = new pmtiles.Protocol();
let cogProtocol = new ProtocolV3()
maplibregl.addProtocol('pmtiles', protocol.tile);
maplibregl.addProtocol('cog', cogProtocol.tile);

const geocoderApi = {
    forwardGeocode: async (config) => {
      const features = [];
      try {
        const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson`;
        const response = await fetch(request);
        const geojson = await response.json();
        for (const feature of geojson.features) {
          features.push({
            type: "Feature",
            geometry: feature.geometry,
            place_name: feature.properties.display_name,
            properties: feature.properties,
            text: feature.properties.display_name,
            place_type: ["place"],
          });
        }
      } catch (e) {
        console.error(`Failed to forwardGeocode with error: ${e}`);
      }

      return {
        features,
      };
    },
  };

export default function Map() {
  const mapContainer = useRef(null);
  const { map, setMap } = useContext(MapContext);
  const { data } = useMetadata();

  useEffect(() => {
    if (data && !map) {
        let m = new maplibregl.Map({
            container: mapContainer.current,
            style: data.style,
        });

        setMap(m);

        m.addControl(new maplibregl.NavigationControl(), 'top-right');
        m.addControl(
            new MaplibreGeocoder(geocoderApi, {
              "maplibregl": maplibregl,
              "placeholder": "Søk",
            }),
            "top-left",
          );

    }
  }, [data, map]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
