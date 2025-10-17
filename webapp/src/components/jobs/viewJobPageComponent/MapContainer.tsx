import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@mui/material";

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const MapContainer: React.FC<MapProps> = ({
  latitude,
  longitude,
  zoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const MAPLIBRE_KEY = process.env.NEXT_PUBLIC_MAPLIBRE_KEY;

  // Initialize map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPLIBRE_KEY}`,
      center: [longitude, latitude],
      zoom,
    });

    new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Update center dynamically
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter([longitude, latitude]);
    }
  }, [latitude, longitude]);

  return (
    <Box
      ref={mapContainerRef}
      style={{
        height: "450px",
        width: "100%",
        border: "1px solid #ccc",
        marginTop: "10px",
      }}
    />
  );
};

export default MapContainer;
