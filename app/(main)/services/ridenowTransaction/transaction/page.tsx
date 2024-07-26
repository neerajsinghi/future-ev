'use client';
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import './plan.css';
import { useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';
import Image from 'next/image';

const containerStyle = {
    width: '100%',
    height: '75vh'
};

const previewMapContainer = {
    width: '100%',
    height: '250px'
};

const ViewAllBooking = () => {
    const searchParams = useSearchParams();
    const profileId = searchParams.get('profileId');
    const userId = searchParams.get('userId');

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [staticMapUrl, setStaticMapUrl] = useState('');
    const [geoJsonData, setGeoJsonData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://futureev.trestx.com/api/v1/rides/ongoing?userID=${profileId}&bookingId=${userId}`);
                const data = await response.json();

                if (Array.isArray(data.data) && data.data.length > 0) {
                    setGeoJsonData(data.data);
                    console.log(data.data);
                    setLoading(false);
                } else {
                    console.error('No ongoing ride data found.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [profileId, userId]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const defaultCenter =
        geoJsonData.length > 0
            ? {
                lat: geoJsonData[0].booking?.bikeWithDevice?.location.coordinates[1],
                lng: geoJsonData[0].booking?.bikeWithDevice?.location.coordinates[0]
            }
            : { lat: 0, lng: 0 };

    return (
        <div>
            {/* <div className="flex gap-3 my-2"></div> */}
            {loading ? (
                <p>Loading map...</p>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={15}
                    options={{
                        gestureHandling: 'greedy'
                    }}
                >
                    {geoJsonData.map(
                        (booking: any, index: number) =>
                            booking.booking.bikeWithDevice?.location && (
                                <Data
                                    key={index}
                                    options={{
                                        controlPosition: window.google.maps.ControlPosition.TOP_LEFT,
                                        map: new google.maps.Map(document.createElement('div')),
                                        style: (feature) => {
                                            if (feature.getProperty('id') === 'start') {
                                                return {
                                                    icon: {
                                                        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                                    }
                                                };
                                            }
                                            return {};
                                        }
                                    }}
                                    onAddFeature={(e) => {
                                        e.feature.toGeoJson((geoJson) => {
                                            console.log('Added Feature:', geoJson);
                                        });
                                    }}
                                    onLoad={(data) => {
                                        if (booking.booking.startingStation) {
                                            data.addGeoJson({
                                                type: 'FeatureCollection',
                                                features: [
                                                    {
                                                        type: 'Feature',
                                                        geometry: {
                                                            type: 'Point',
                                                            coordinates: booking.booking.bikeWithDevice.location.coordinates
                                                        },
                                                        properties: {
                                                            id: booking.booking.startingStation.id,
                                                            name: booking.booking.startingStation.name
                                                        }
                                                    }
                                                ]
                                            });
                                        }
                                        console.log('Data Loaded:', data);
                                    }}
                                />
                            )
                    )}
                </GoogleMap>
            )}
        </div>
    );
};

export default ViewAllBooking;
