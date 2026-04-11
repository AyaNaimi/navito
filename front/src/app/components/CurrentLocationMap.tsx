import { useEffect, useMemo, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type MapMarkerData = {
  id: string | number;
  lat: number;
  lng: number;
  label: string;
  type?: 'current' | 'place';
};

interface CurrentLocationMapProps {
  center: [number, number];
  label?: string;
  markers?: MapMarkerData[];
}

function MapEvents({ center }: { center: [number, number] }) {
  const map = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (map.current) {
      map.current.setView(center, map.current.getZoom());
    }
  }, [center]);
  
  return null;
}

export default function CurrentLocationMap({ center, label, markers }: CurrentLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  const validMarkers = useMemo(() => {
    if (markers && markers.length > 0) return markers;
    return [{ 
      id: 'default-center', 
      lat: center[0], 
      lng: center[1], 
      label: label || 'Current Location', 
      type: 'current' as const 
    }];
  }, [markers, center, label]);

  useEffect(() => {
    setMounted(true);
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: center,
        zoom: 14,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current);
    }

    mapInstanceRef.current.setView(center, 14);
  }, [center, mounted]);

  useEffect(() => {
    if (!mapInstanceRef.current || !validMarkers.length) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    validMarkers.forEach((marker) => {
      const circle = L.circleMarker([marker.lat, marker.lng], {
        radius: marker.type === 'current' ? 10 : 8,
        pathOptions: {
          fillColor: marker.type === 'current' ? '#171717' : '#FFFFFF',
          fillOpacity: 1,
          color: '#171717',
          weight: 2,
        },
      });

      circle.bindPopup(`<div class="p-1 px-2 text-[11px] font-bold uppercase tracking-wider text-[#171717]">${marker.label}</div>`);
      circle.addTo(mapInstanceRef.current!);
    });
  }, [validMarkers]);

  if (!mounted) {
    return <div className="h-full w-full bg-[#F5F5F7] animate-pulse" />;
  }

  return (
    <div ref={mapRef} className="h-full w-full relative" />
  );
}