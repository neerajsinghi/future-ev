'use client';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import { getStationsByID } from '@/app/api/iotBikes';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const ViewStation = ({ params }: { params: any }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [stationData, setStationData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStationsByID(params.stationId);
                setStationData(response);
            } catch (error) {
                console.error('Error fetching station data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.stationId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    //! even if invalid id it returns success true but no data so validate accordingly
    if (!stationData || Object.keys(stationData.data).length <= 1) {
        return <div style={{ textAlign: 'center' }}>Invalid ID, No Station found with this ID</div>;
    }

    const stationLocation = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: stationData.data.location.coordinates
        },
        properties: { id: stationData.data.id, name: stationData.data.name }
    };

    const defaultCenter = {
        lat: stationData.data.location.coordinates[1],
        lng: stationData.data.location.coordinates[0]
    };

    return (
        <div>
            <h1>Station: {stationData.data.name}</h1>
            {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={15}>
                    <Data
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
                        onLoad={(data) => {
                            data.addGeoJson(stationLocation);
                        }}
                    />
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default ViewStation;
