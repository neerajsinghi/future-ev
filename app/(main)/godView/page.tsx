'use client';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { getCity } from '@/app/api/services'; // Ensure this import path is correct

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 28.6139,
    lng: 77.209
};

type cityType = {
    id: string;
    name: string;
    active: boolean;
    numberOfStations: undefined;
    numberOfVehicles: undefined;
    locationPolygon: {
        type: string;
        coordinates: [number, number][][];
    };
};

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [cities, setCities] = useState<cityType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCity(); // Assuming getCity fetches all city data
                if (response.success && response.data) {
                    setCities(response.data); // Assuming response.data is an array of cities
                }
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        fetchData();
    }, []);

    const onEdit = useCallback((e: any, cityIndex: number, polygonIndex: number) => {
        const newPath = e
            .getPath()
            .getArray()
            .map((latlng: { lat(): () => number; lng(): () => number }) => ({
                lat: latlng.lat(),
                lng: latlng.lng()
            }));

        setCities((prevCities) => {
            const updatedCities = [...prevCities];
            updatedCities[cityIndex].locationPolygon.coordinates[polygonIndex][0] = newPath;
            return updatedCities;
        });
    }, []);

    return isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
            {cities.map((city, cityIndex) =>
                city.locationPolygon.coordinates.map((polygon, polygonIndex) => (
                    <Polygon
                        key={`${city.id}_${polygonIndex}`}
                        paths={polygon[0].map((coord: any) => ({
                            lat: coord[1],
                            lng: coord[0]
                        }))}
                        editable={true}
                        draggable={true}
                        onMouseUp={(e) => onEdit(e, cityIndex, polygonIndex)}
                        options={{
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                            strokeWeight: 2
                        }}
                    />
                ))
            )}
        </GoogleMap>
    ) : (
        <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
    );
};

export default MapComponent;
