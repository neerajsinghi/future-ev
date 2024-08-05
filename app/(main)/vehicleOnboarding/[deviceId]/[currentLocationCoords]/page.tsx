'use client';
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useMapInstance } from '@/app/api/hooks';

const containerStyle = {
    width: '100%',
    height: '75vh'
};

const BikeCurrentLocation = (params: any) => {
    const {
        params: { currentLocationCoords }
    } = params;

    const coords = currentLocationCoords?.split('%2C').map((coord: any) => parseFloat(coord));

    const isLoaded = useMapInstance();


    const defaultCenter = {
        lat: coords[1],
        lng: coords[0]
    };

    return (
        <div>
            <h1>Bike Current Location</h1>
            {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
                    <Marker position={defaultCenter} />
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default BikeCurrentLocation;
