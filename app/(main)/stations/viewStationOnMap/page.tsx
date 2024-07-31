'use client';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import { getStations } from '@/app/api/iotBikes';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const ViewStations = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [stationsData, setStationsData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStations();

                setStationsData(response.data);
            } catch (error) {
                console.error('Error fetching station data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const geoJsonData = {
        type: 'FeatureCollection',
        features: stationsData.map((station: any) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: station.location.coordinates
            },
            properties: { id: station.id, name: station.name }
        }))
    };

    const defaultCenter = {
        lat: stationsData.length ? stationsData[0].location.coordinates[1] : 0,
        lng: stationsData.length ? stationsData[0].location.coordinates[0] : 0
    };

    return (
        <div>
            <h1>Stations</h1>
            {isLoaded ? (
                <GoogleMap
                    options={{
                        gestureHandling: 'greedy'
                    }}
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={12}
                >
                    <Data
                        options={{
                            controlPosition: window.google.maps.ControlPosition.TOP_LEFT,
                            map: new google.maps.Map(document.createElement('div')),

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
                        onLoad={(data) => {
                            data.addGeoJson(geoJsonData);
                        }}
                    />
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default ViewStations;
