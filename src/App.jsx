import Layers from "./components/Layers";
import Map from "./components/Map";
import MapContextProvider from "./components/MapContextProvider";
import Metadata from "./components/Metadata";

export default function App() {

  return (
    <MapContextProvider>
      <div id="app-wrap" style={{ display: 'flex' }}>
        <div id="sidebar">
          <Metadata />
          <Layers />
        </div>
        <Map />
      </div>
    </MapContextProvider>
  );
}