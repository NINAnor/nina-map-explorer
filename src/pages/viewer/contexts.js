import React from "react";

export const MapContext = React.createContext({
  map: null,
  setMap: () => { },
  layers: {},
});

export const ModalContext = React.createContext({
  setNode: () => null,
});
