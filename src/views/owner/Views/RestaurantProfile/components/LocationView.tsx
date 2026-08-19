import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import { TbMapPin, TbNavigation, TbCurrentLocation } from 'react-icons/tb'
import Button from '@/components/ui/Button'

// Dynamically import Leaflet to avoid SSR issues
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Notification, toast } from '@/components/ui'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom restaurant marker icon
const restaurantIcon = new L.Icon({
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

// Component to handle map view and fly to location
function MapController({
    lat,
    lng,
    zoom = 15,
}: {
    lat: number
    lng: number
    zoom?: number
}) {
    const map = useMap()

    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], zoom, {
                duration: 1.5,
                easeLinearity: 0.25,
            })
        }
    }, [lat, lng, zoom, map])

    return null
}

interface LocationViewProps {
    latitude: number | string
    longitude: number | string
    restaurantName?: string
    address?: string
    showDirections?: boolean
}

const LocationView = ({
    latitude,
    longitude,
    restaurantName = 'Restaurant Location',
    address = '',
    showDirections = true,
}: LocationViewProps) => {
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude
    const lng =
        typeof longitude === 'string' ? parseFloat(longitude) : longitude
    const defaultCenter = { lat: 16.8661, lng: 96.1951 } // Yangon, Myanmar

    // Check if coordinates are valid
    const hasValidCoordinates =
        !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

    // Get directions URL (Google Maps)
    const getDirections = () => {
        if (hasValidCoordinates) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
            window.open(url, '_blank')
        }
    }

    // Get current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${position.coords.latitude},${position.coords.longitude}&destination=${lat},${lng}`
                    window.open(url, '_blank')
                },
                (error) => {
                    console.error('Error getting location:', error)
                    alert(
                        'Unable to get your location. Please check your browser permissions.',
                    )
                    // Fallback: just open destination
                    getDirections()
                },
            )
        } else {
            alert('Geolocation is not supported by your browser')
            toast.push(
                <Notification title="Error">
                    Geolocation is not supported by your browser
                </Notification>,
            )
            getDirections()
        }
    }

    if (!hasValidCoordinates) {
        return (
            <Card>
                <h4 className="mb-4 flex items-center gap-2 text-primary">
                    <TbMapPin />
                    Location
                </h4>
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <TbMapPin className="mx-auto text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500">
                        Location information not available
                    </p>
                    {address && (
                        <p className="text-sm text-gray-400 mt-2">{address}</p>
                    )}
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h4 className="mb-4 flex items-center gap-2 text-primary">
                <TbMapPin />
                Location
            </h4>

            {/* Address Information */}
            {address && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Address:</span>{' '}
                        {address}
                    </p>
                </div>
            )}

            {/* Map Container */}
            <div className="relative rounded-lg overflow-hidden shadow-md">
                <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    style={{ height: '400px', width: '100%', zIndex: 0 }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController lat={lat} lng={lng} zoom={15} />
                    <Marker position={[lat, lng]} icon={restaurantIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>{restaurantName}</strong>
                                {address && (
                                    <p className="text-sm mt-1">{address}</p>
                                )}
                                <div className="mt-2">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 text-sm hover:underline"
                                    >
                                        View on Google Maps →
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Floating Action Buttons */}
                {showDirections && (
                    <div className="absolute bottom-3 right-3 z-0 flex gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="default"
                            icon={<TbNavigation />}
                            className="shadow-lg bg-white dark:bg-gray-800 z-400"
                            onClick={getDirections}
                        >
                            Directions
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="default"
                            icon={<TbCurrentLocation />}
                            className="shadow-lg bg-white dark:bg-gray-800 z-400"
                            onClick={getCurrentLocation}
                        >
                            My Location
                        </Button>
                    </div>
                )}
            </div>

            {/* Coordinates Display */}
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span>📍 Latitude: {lat.toFixed(6)}</span>
                <span>📍 Longitude: {lng.toFixed(6)}</span>
            </div>

            {/* External Map Links */}
            <div className="mt-3 flex gap-3 justify-center">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                >
                    Open in Google Maps →
                </a>
                <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                >
                    Open in OpenStreetMap →
                </a>
            </div>
        </Card>
    )
}

export default LocationView
