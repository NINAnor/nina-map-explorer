import React from "react";

const MapContext = React.createContext({
  map: null,
  setMap: () => { },
  layers: {},
});

export default MapContext;
