'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'

// Fix for missing marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
})

type PlotLocation = {
    id: string
    title: string
    price_kes: number
    latitude: number
    longitude: number
}

// Helper to update map view when markers change
function MapController({ bounds }: { bounds: L.LatLngBounds | null }) {
    const map = useMap()
    useEffect(() => {
        if (bounds && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [bounds, map])
    return null
}

export default function MapViewer({ plots }: { plots: PlotLocation[] }) {
    // Default center to Kenya (Nairobi ish) or the first plot
    const center = plots.length > 0
        ? { lat: plots[0].latitude, lng: plots[0].longitude }
        : { lat: -1.2921, lng: 36.8219 }

    const bounds = plots.length > 0
        ? L.latLngBounds(plots.map(p => [p.latitude, p.longitude]))
        : null

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
        <div className="h-[600px] w-full rounded-md overflow-hidden border">
            <MapContainer
                center={center}
                zoom={plots.length > 0 ? 10 : 6}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController bounds={bounds} />
                {plots.map(plot => (
                    <Marker key={plot.id} position={[plot.latitude, plot.longitude]}>
                        <Popup>
                            <div className="text-sm">
                                <strong className="block mb-1">{plot.title}</strong>
                                <span className="text-indigo-600 font-bold block mb-2">KES {plot.price_kes.toLocaleString()}</span>
                                <Link href={`/plots/${plot.id}`} className="text-blue-500 hover:underline">
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
