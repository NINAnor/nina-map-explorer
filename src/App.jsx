import Layers from "./components/Layers";
import Map from "./components/Map";
import MapContextProvider from "./components/MapContextProvider";
import Metadata from "./components/Metadata";

export default function App() {

  return (
    <MapContextProvider>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '350px' }}>
          <Metadata />
          <Layers />
        </div>
        <Map />
      </div>
    </MapContextProvider>
  );
}