'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Data, Marker } from '@react-google-maps/api';
import { getCity } from '@/app/api/services';
import { getBikes, getStations } from '@/app/api/iotBikes';
import { Dropdown } from 'primereact/dropdown';
import Link from 'next/link';
import useIsAccessible from '@/app/hooks/isAccessible';
import { useMapInstance } from '@/app/api/hooks';

const containerStyle = {
    width: '100%',
    height: '65vh'
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
    supervisor: {
        name: string;
        phone: string;
        email: string;
    };
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
    const isLoaded = useMapInstance();

    const isAccessible = useIsAccessible('godView');

    const [cities, setCities] = useState<cityType[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>({});
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

    if (isAccessible === 'None') {
        return <h1>You Dont have Access To This Page</h1>;
    }

    return (
        <div className="card">
            {(isAccessible === 'View' || isAccessible === 'Edit') && (
                <>
                    <div className="card-header mb-3">
                        <div className="card-title">Map</div>
                        <div className="grid">
                            <div className="col-12 lg:col-10 "> </div>

                            <Dropdown
                                filter
                                placeholder="Select City"
                                optionLabel="name"
                                optionValue="id"
                                options={cities}
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.value);
                                    const selectedCityObject = cities.find((place: { name: any }) => place.name === e.value.name);
                                    if (selectedCityObject && selectedCityObject.locationPolygon.coordinates.length > 0) {
                                        const coordinates = selectedCityObject.locationPolygon.coordinates[0];
                                        let centerCoordinates: any | undefined;

                                        // Handle different structures of coordinates (single set or nested arrays)
                                        if (Array.isArray(coordinates[0])) {
                                            centerCoordinates = coordinates[0][0]; // Assuming the first set of coordinates
                                        } else {
                                            centerCoordinates = coordinates[0];
                                        }

                                        if (centerCoordinates) {
                                            setCenter({ lat: centerCoordinates[1], lng: centerCoordinates[0] });
                                            setZoom(11); // Adjust zoom level as needed
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="card-body">
                        {isLoaded ? (
                            <GoogleMap
                                options={{
                                    gestureHandling: 'greedy'
                                }}
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={zoom}
                            >
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
                                        map: new google.maps.Map(document.createElement('div')), // Create a new map object
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
                                />
                                {stations.map((station) => (
                                    <Marker
                                        key={station.id}
                                        position={{
                                            lat: station.location.coordinates[1],
                                            lng: station.location.coordinates[0]
                                        }}
                                        onClick={() => {
                                            // Optional: If you have any actions to perform before navigation
                                            window.location.href = `/stations?stationId=${station.id}`;
                                        }}
                                        title={
                                            'id: ' +
                                            station.id +
                                            '\nName: ' +
                                            station.name +
                                            '\nAddress: ' +
                                            station.address.address +
                                            '\nStock: ' +
                                            station.stock +
                                            '\nStatus: ' +
                                            station.status +
                                            '\nServices Available: ' +
                                            station.servicesAvailable.join(', ') +
                                            '\nSupervisor Name: ' +
                                            station.supervisor.name
                                        }
                                    />
                                ))}
                                {bikes.map((bike) => {
                                    return (
                                        <Marker
                                            key={bike.deviceId}
                                            position={{
                                                lat: bike.location.coordinates[1],
                                                lng: bike.location.coordinates[0]
                                            }}
                                            title={'id: ' + bike.deviceId + '\nName: ' + bike.name + '\nBattery: ' + bike.batteryLevel + '\nSpeed: ' + bike.speed + '\nTotal Distance: ' + bike.totalDistance}
                                            icon={{
                                                url: 'https://futev.s3.ap-south-1.amazonaws.com/car-front-svgrepo-com+(2).svg',
                                                scaledSize: new google.maps.Size(25, 25),
                                                // Remove the infoWindowAnchor property
                                            }}
                                            onClick={() => {
                                                // Optional: If you have any actions to perform before navigation
                                                window.location.href = `/vehicleOnboarding/${bike.deviceId}`;
                                            }}
                                        ></Marker>
                                    );
                                })}
                            </GoogleMap>
                        ) : (
                            <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MapComponent;
