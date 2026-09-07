import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { TbMapPin, TbCurrentLocation } from 'react-icons/tb'
import Button from '@/components/ui/Button'
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { RestaurantFormInput } from '@/@types/restaurant.type'

// Dynamically import Leaflet to avoid SSR issues
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

interface LocationSectionProps {
    control: Control<RestaurantFormInput>
    errors: FieldErrors<RestaurantFormInput>
    isNew?: boolean
    setValue: UseFormSetValue<RestaurantFormInput>
    disabled?: boolean
}

// Component to handle map clicks
function LocationMarker({ setPosition, position, disabled }: any) {
    useMapEvents({
        click(e) {
            if (disabled) return
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            })
        },
    })
    return position ? <Marker position={[position.lat, position.lng]} /> : null
}

const LocationSection = ({
    control,
    errors,
    isNew = false,
    setValue,
    disabled = false,
}: LocationSectionProps) => {
    // const [mapPosition, setMapPosition] = useState<{
    //     lat: number
    //     lng: number
    // } | null>(null)
    const [searchAddress, setSearchAddress] = useState('')
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
        lat: 16.8661,
        lng: 96.1951,
    })

    // Get current form values - Hook up single source of truth monitoring using the official useWatch api
    const watchedLatitude = control._getWatch('latitude')
    const watchedLongitude = control._getWatch('longitude')

    // Create a computed map positioning token directly out of form tracking state
    const mapPosition =
        watchedLatitude && watchedLongitude
            ? { lat: Number(watchedLatitude), lng: Number(watchedLongitude) }
            : null

    // Initialize map position from existing data (for edit mode)
    useEffect(() => {
        if (
            !isNew &&
            watchedLatitude &&
            watchedLongitude &&
            Number(watchedLatitude) !== 0 &&
            Number(watchedLongitude) !== 0
        ) {
            const position = {
                lat: Number(watchedLatitude),
                lng: Number(watchedLongitude),
            }
            // setMapPosition(position)
            setMapCenter(position)
        }
    }, [isNew, watchedLatitude, watchedLongitude])

    // Update location coordinates from interactive actions cleanly
    const updateCoordinates = (pos: { lat: number; lng: number }) => {
        // Enforce maximum precision mapping (up to 14 decimal digits)
        setValue('latitude', parseFloat(pos.lat.toFixed(14)), {
            shouldValidate: true,
        })
        setValue('longitude', parseFloat(pos.lng.toFixed(14)), {
            shouldValidate: true,
        })
        setMapCenter(pos)
    }

    // Get current location
    const getCurrentLocation = () => {
        if (disabled) return
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    // setMapPosition(newPosition)
                    updateCoordinates(newPosition)
                    setMapCenter(newPosition)
                },
                (error) => {
                    console.error('Error getting location:', error)
                    alert(
                        'Unable to get your location. Please check your browser permissions.',
                    )
                },
            )
        } else {
            alert('Geolocation is not supported by your browser')
        }
    }

    // Geocode address to coordinates
    const searchLocation = async () => {
        if (disabled) return
        if (!searchAddress) return
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1`,
            )
            const data = await response.json()
            if (data && data.length > 0) {
                const newPosition = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                }
                // setMapPosition(newPosition)
                setMapCenter(newPosition)
            } else {
                alert('Location not found. Please try a different address.')
            }
        } catch (error) {
            console.error('Geocoding error:', error)
            alert('Error searching for location')
        }
    }

    return (
        <Card>
            <h4 className="mb-4">Location</h4>
            <div className="space-y-4">
                {/* Search Address */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Search address..."
                        value={searchAddress}
                        className="flex-1"
                        onKeyPress={(e) =>
                            e.key === 'Enter' && searchLocation()
                        }
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                    <Button type="button" onClick={searchLocation}>
                        Search
                    </Button>
                </div>

                {/* Map */}
                <div className="relative">
                    <MapContainer
                        key={`${mapCenter.lat}-${mapCenter.lng}`}
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={13}
                        style={{
                            height: '400px',
                            width: '100%',
                            borderRadius: '8px',
                            zIndex: 0,
                        }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            setPosition={updateCoordinates}
                            disabled={disabled}
                            // setPosition={(pos: {
                            //     lat: number
                            //     lng: number
                            // }) => {
                            //     setMapPosition(pos)
                            //     setMapCenter(pos)
                            // }}
                            position={mapPosition}
                        />
                    </MapContainer>
                    <Button
                        type="button"
                        size="sm"
                        icon={<TbCurrentLocation />}
                        className="absolute bottom-3 right-3 z-1000 shadow-lg"
                        onClick={getCurrentLocation}
                    >
                        My Location
                    </Button>
                </div>

                {/* Coordinate Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => (
                            <FormItem
                                label="Latitude"
                                invalid={!!errors.latitude}
                                errorMessage={errors.latitude?.message}
                            >
                                <Input
                                    {...field}
                                    type="number"
                                    step="any"
                                    value={
                                        mapPosition?.lat ??
                                        (field.value as
                                            | string
                                            | number
                                            | undefined) ??
                                        ''
                                    }
                                    placeholder="Latitude"
                                    onChange={(e) => {
                                        const val = e.target.value
                                        const newLat =
                                            val === null
                                                ? ''
                                                : parseFloat(e.target.value)
                                        field.onChange(newLat)
                                        if (newLat && !isNaN(newLat)) {
                                            setMapCenter((prev) => ({
                                                ...prev,
                                                lat: newLat,
                                            }))
                                        }
                                        // if (mapPosition) {
                                        //     setMapPosition({
                                        //         ...mapPosition,
                                        //         lat: newLat,
                                        //     })
                                        // } else {
                                        //     setMapPosition({
                                        //         lat: newLat,
                                        //         lng: 0,
                                        //     })
                                        // }
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => (
                            <FormItem
                                label="Longitude"
                                invalid={!!errors.longitude}
                                errorMessage={errors.longitude?.message}
                            >
                                <Input
                                    {...field}
                                    type="number"
                                    step="any"
                                    value={
                                        mapPosition?.lng ??
                                        (field.value as
                                            | string
                                            | number
                                            | undefined) ??
                                        ''
                                    }
                                    placeholder="Longitude"
                                    onChange={(e) => {
                                        const val = e.target.value
                                        const newLng =
                                            val === ''
                                                ? null
                                                : parseFloat(e.target.value)
                                        field.onChange(newLng)

                                        if (newLng && !isNaN(newLng)) {
                                            setMapCenter((prev) => ({
                                                ...prev,
                                                lng: newLng,
                                            }))
                                        }

                                        // if (mapPosition) {
                                        //     setMapPosition({
                                        //         ...mapPosition,
                                        //         lng: newLng,
                                        //     })
                                        // } else {
                                        //     setMapPosition({
                                        //         lat: 0,
                                        //         lng: newLng,
                                        //     })
                                        // }
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                </div>

                {mapPosition && (
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <TbMapPin />
                        <span>Click on map to change location</span>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default LocationSection
