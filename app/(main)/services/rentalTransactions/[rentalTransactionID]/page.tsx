'use client';
import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const RentalBooking = ({ params }: { params: any }) => {
    console.log(params);
    const transactionId = params.transactionID.split('%20');
    console.log(transactionId);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc' // Replace with your actual Google Maps API key
    });

    const [geoJsonData, setGeoJsonData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://futureev.trestx.com/api/v1/rides/ongoing?userID=${transactionId[0]}&bookingId=${transactionId[1]}`);
                const data = await response.json();
                console.log(data.data);

                if (Array.isArray(data.data) && data.data.length > 0) {
                    console.log(data.data);
                    setGeoJsonData(data.data);
                    setLoading(false);
                } else {
                    console.error('No ongoing ride data found.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const defaultCenter =
        geoJsonData.length > 0
            ? {
                lat: geoJsonData[0].booking.bikeWithDevice.location.coordinates[1],
                lng: geoJsonData[0].booking.bikeWithDevice.location.coordinates[0]
            }
            : { lat: 0, lng: 0 };

    return (
        <div>
            <h1>Ongoing Rides</h1>
            {loading ? (
                <p>Loading map...</p>
            ) : (
                <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={15}>
                    {geoJsonData.map((booking: any, index: number) => {
                        if (booking.booking.bikeWithDevice?.location) {
                            return (
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
                            );
                        }
                    })}
                </GoogleMap>
            )}
        </div>
    );
};

export default RentalBooking;
