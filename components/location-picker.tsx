'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for missing marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

// Component to handle marker updates
function DraggableMarker({ position, onDragEnd }: { position: { lat: number, lng: number }, onDragEnd: (pos: { lat: number, lng: number }) => void }) {
    const markerRef = useRef<L.Marker>(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker) {
                    onDragEnd(marker.getLatLng())
                }
            },
        }),
        [onDragEnd],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
        </Marker>
    )
}

export default function LocationPicker({
    position,
    onChange
}: {
    position: { lat: number, lng: number } | null
    onChange: (pos: { lat: number, lng: number }) => void
}) {
    // Default to Nairobi if no position selected
    const center = position || { lat: -1.2921, lng: 36.8219 }

    // Hack to default leaflet icons
    useEffect(() => {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, [])

    return (
        <div className="h-[300px] w-full rounded-md overflow-hidden border">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker
                    position={center}
                    onDragEnd={(pos) => onChange(pos)}
                />
            </MapContainer>
        </div>
    )
}
