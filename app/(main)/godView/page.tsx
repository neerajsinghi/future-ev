'use client';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import { getCity } from '@/app/api/services'; // Ensure this import path is correct
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

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
    numberOfStations: null | undefined;
    numberOfVehicles: null | undefined;
    locationPolygon: {
        type: string;
        coordinates: [number, number][][] | [number, number][][][];
    };
};

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'
    });

    const [cities, setCities] = useState<cityType[]>([]);
    const [city, setCity] = useState('');
    const [selectedCity, setSelectedCity] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCity(); // getCity fetches all city data
                if (response.success && response.data) {
                    setCities(response.data); // response.data is an array of cities
                }
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        fetchData();
    }, []);

    const cityObject = cities.find((place) => place.name === city);

    return city ? (
        isLoaded ? (<>
            <div className="card">
                <div className="card-header">
                    <div className="grid">
                        <div className="col-10">
                            <h1>Map</h1>
                        </div>
                        <Button onClick={() => setCity("")} type={"button"} label="Select City" className="col-1 m-3" style={{ padding: "0px" }} />
                    </div>
                </div>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
                    {cityObject && (
                        <Data
                            options={{
                                map: new google.maps.Map(document.createElement('div')), // Create a new Map object
                                style: {
                                    fillColor: '#FF0000',
                                    strokeColor: '#FF0000',
                                    strokeWeight: 2
                                }
                            }}
                            onAddFeature={(e) => {
                                e.feature.toGeoJson((geoJson) => {

                                });
                            }}
                            onLoad={(data) => {
                                data.addGeoJson({
                                    type: 'Feature',
                                    geometry: cityObject.locationPolygon,
                                    properties: { id: cityObject.id },
                                    Options: { fillColor: 'red' }
                                });
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </>
        ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
        )
    ) : (
        <SelectCityDialog cities={cities} selectedCity={selectedCity} city={city} setCity={setCity} setSelectedCity={setSelectedCity} />
    );
};

export default MapComponent;

function SelectCityDialog({ selectedCity, setSelectedCity, cities, city, setCity }: { city: string; setCity: (value: string) => void; selectedCity: boolean; setSelectedCity: (value: boolean) => void; cities: any[] }) {
    const options = cities.map((item) => item.name);
    const headerElement = (
        <div className="w-full w-[300px]">
            <h2>Select a city</h2>
            <Dropdown value={city} onChange={(e) => setCity(e.value)} options={options} optionLabel="name" placeholder="Select a City" className="w-full" />
        </div>
    );

    return (
        <div className="w-[300px]">
            <Dialog
                className="w-[300px]"
                visible={selectedCity}
                modal
                header={headerElement}
                style={{ width: '50rem' }}
                onHide={() => {
                    if (!selectedCity) return;
                    setSelectedCity(false);
                }}
            ></Dialog>
        </div>
    );
}
