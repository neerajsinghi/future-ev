'use client';
import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const ViewAllBooking = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc' // Replace with your actual Google Maps API key
    });

    const [geoJsonData, setGeoJsonData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://15.207.88.89:1995/api/v1/rides/ongoing?userId=66975e7513d5062f6048fbcc&bookingId=669771d213d5062f6048fbfd`);
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
                    {geoJsonData.map((booking, index) => {
                        if (booking.booking.bikeWithDevice?.location) {
                            return (
                                <Data
                                    key={index}
                                    options={{
                                        controlPosition: window.google.maps.ControlPosition.TOP_LEFT,
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

export default ViewAllBooking;
