'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Data, Marker } from '@react-google-maps/api';
import { getCity } from '@/app/api/services';
import { getBikes, getStations } from '@/app/api/iotBikes';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

type cityType = {
    id: string;
    name: string;
    active: boolean;
    numberOfStations: null | undefined;
    numberOfVehicles: null | undefined;
    locationPolygon: {
        type: string;
        coordinates: [number, number][][] | [number, number][][][];
    };
};

type stationType = {
    id: string;
    name: string;
    description: string;
    shortName: string;
    address: {
        address: string;
        country: string;
        pin: string;
        city: string;
        state: string;
    };
    location: {
        type: string;
        coordinates: [number, number];
    };
    active: boolean;
    group: string;
    supervisorID: string;
    stock: number;
    public: boolean;
    status: string;
    servicesAvailable: string[];
    createdTime: string;
};

type bikeType = {
    alarm: string | null;
    batteryLevel: number;
    course: string;
    dealer: string;
    deviceFixTime: string;
    deviceId: number;
    deviceImei: string;
    harshAccelerationHistory: any[];
    harshBrakingHistory: any[];
    ignition: string;
    lastUpdate: string;
    latitude: string;
    longitude: string;
    location: { type: string; coordinates: [number, number] };
    name: string;
    phone: string;
    posId: number;
    speed: string;
    status: string;
    totalDistance: string;
    type: string;
    valid: number;
};

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [cities, setCities] = useState<cityType[]>([]);
    const [stations, setStations] = useState<stationType[]>([]);
    const [bikes, setBikes] = useState<bikeType[]>([]);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 });
    const [zoom, setZoom] = useState<number>(6);
    const dataLayerRef = useRef<any>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getCity();
                if (response.success && response.data) {
                    setCities(response.data);
                }
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await getStations();
                if (response.success && response.data) {
                    setStations(response.data);
                }
            } catch (error) {
                console.error('Error fetching station data:', error);
            }
        };

        fetchStations();
    }, []);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await getBikes();
                if (response.success && response.data) {
                    setBikes(response.data);
                }
            } catch (error) {
                console.error('Error fetching bike data:', error);
            }
        };

        fetchBikes();
    }, []);

    useEffect(() => {
        if (dataLayerRef.current && cities.length > 0) {
            dataLayerRef.current.forEach((feature: any) => {
                dataLayerRef.current.remove(feature);
            });

            cities.forEach((city) => {
                if (city.locationPolygon.coordinates.length > 0) {
                    dataLayerRef.current.addGeoJson({
                        type: 'Feature',
                        geometry: city.locationPolygon,
                        properties: { id: city.id }
                    });
                }
            });
        }
    }, [cities]);

    return (
        <div>
            {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
                    <Data
                        onLoad={(data) => {
                            dataLayerRef.current = data;
                            if (cities.length > 0) {
                                cities.forEach((city) => {
                                    if (city.locationPolygon.coordinates.length > 0) {
                                        data.addGeoJson({
                                            type: 'Feature',
                                            geometry: city.locationPolygon,
                                            properties: { id: city.id }
                                        });
                                    }
                                });
                            }
                        }}
                        options={{
                            controlPosition: window.google.maps.ControlPosition.TOP_LEFT,
                            style: {
                                fillColor: '#FF0000',
                                strokeColor: '#FF0000',
                                strokeWeight: 2
                            }
                        }}
                        onAddFeature={(e) => {
                            e.feature.toGeoJson((geoJson) => {
                                console.log('Added Feature:', geoJson);
                            });
                        }}
                        onSetFeature={(e: any) => {
                            e.feature.toGeoJson((geoJson: any) => {
                                console.log('Set Feature:', geoJson);
                            });
                        }}
                    />
                    {stations.map((station) => (
                        <Marker
                            key={station.id}
                            position={{
                                lat: station.location.coordinates[1],
                                lng: station.location.coordinates[0]
                            }}
                            title={station.name}
                        />
                    ))}
                    {bikes.map((bike) => (
                        <Marker
                            key={bike.deviceId}
                            position={{
                                lat: parseFloat(bike.latitude),
                                lng: parseFloat(bike.longitude)
                            }}
                            title={bike.name}
                            icon={{
                                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            }}
                        />
                    ))}
                </GoogleMap>
            ) : (
                <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
            )}
        </div>
    );
};

export default MapComponent;
