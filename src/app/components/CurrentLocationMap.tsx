import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

type CurrentLocationMapProps = {
  center: [number, number];
  label: string;
};

export default function CurrentLocationMap({ center, label }: CurrentLocationMapProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-72 w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={center} radius={14} pathOptions={{ color: '#0D9488', fillColor: '#14B8A6', fillOpacity: 0.85 }}>
          <Popup>{label}</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
