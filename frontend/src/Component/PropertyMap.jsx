import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import Button from './ui/Button'

const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const NEARBY_BY_CITY = {
  Goa: ['Baga Beach — 0.3 km', 'Calangute Market — 1.2 km', 'Nightlife Street — 0.8 km'],
  Lonavala: ['Tiger Point — 2 km', 'Bhushi Dam — 4 km', 'Local Food Stalls — 1 km'],
  Udaipur: ['Lake Pichola — 0.5 km', 'City Palace — 2 km', 'Jagdish Temple — 1.5 km'],
  Bangalore: ['Indiranagar Metro — 0.4 km', 'Restaurants & Cafes — 0.2 km', 'Shopping District — 1 km'],
  Mumbai: ['Bandra Station — 0.6 km', 'Linking Road — 1 km', 'Sea Link Viewpoint — 3 km'],
  Manali: ['Old Manali Market — 0.5 km', 'Hadimba Temple — 2 km', 'River View Point — 1 km'],
  Pune: ['Koregaon Park — 0.3 km', 'Restaurants — 0.5 km', 'Bund Garden — 2 km'],
  Jaipur: ['Pink City Bazaar — 0.2 km', 'Hawa Mahal — 1 km', 'City Palace — 1.5 km'],
}

const DEFAULT_NEARBY = [
  'Local restaurants within 1 km',
  'Public transport nearby',
  'Markets and shopping areas',
]

function PropertyMap({ latitude, longitude, title, address, city }) {
  const lat = Number(latitude) || 20.5937
  const lng = Number(longitude) || 78.9629
  const hasCoords = latitude && longitude && Number(latitude) !== 0

  const nearby = NEARBY_BY_CITY[city] || DEFAULT_NEARBY
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  // Offset markers for nearby attractions (demo positions around property)
  const nearbyCoords = [
    [lat + 0.003, lng + 0.002],
    [lat - 0.002, lng + 0.004],
    [lat + 0.001, lng - 0.003],
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-brand-dark text-lg">Where you&apos;ll be</h3>
      {address && <p className="text-brand-gray text-sm">{address}</p>}
      {hasCoords && (
        <p className="text-xs text-brand-muted">
          Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      )}

      <div className="rounded-2xl overflow-hidden border border-brand-border h-[300px] md:h-[400px]">
        <MapContainer center={[lat, lng]} zoom={hasCoords ? 14 : 5} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hasCoords && (
            <>
              <Marker position={[lat, lng]} icon={icon}>
                <Popup>{title}</Popup>
              </Marker>
              {nearbyCoords.map((pos, i) => (
                <CircleMarker
                  key={i}
                  center={pos}
                  radius={6}
                  pathOptions={{ color: '#e91e63', fillColor: '#e91e63', fillOpacity: 0.6 }}
                >
                  <Popup>{nearby[i]}</Popup>
                </CircleMarker>
              ))}
            </>
          )}
        </MapContainer>
      </div>

      <Button variant="secondary" onClick={() => window.open(googleMapsUrl, '_blank')}>
        Open in Google Maps
      </Button>

      <div className="bg-brand-light rounded-xl p-4">
        <h4 className="font-medium text-brand-dark mb-2">Nearby attractions</h4>
        <ul className="text-sm text-brand-gray space-y-1">
          {nearby.map((place) => (
            <li key={place}>• {place}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PropertyMap
