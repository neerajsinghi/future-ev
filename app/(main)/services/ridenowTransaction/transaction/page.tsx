'use client';
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';
import { useMapInstance } from '@/app/api/hooks';
import { baseUrl } from '@/app/api/common';

const containerStyle = {
    width: '100%',
    height: '75vh'
};

const previewMapContainer = {
    width: '100%',
    height: '250px'
};

const ViewAllBooking = ({ params }: { params: any }) => {
    const searchParams = useSearchParams();
    const profileId = searchParams.get('profileId');
    const userId = searchParams.get('userId');
    const [staticMapUrl, setStaticMapUrl] = useState('');

    const invoiceRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState(false);

    const isLoaded = useMapInstance();


    const [geoJsonData, setGeoJsonData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl + `rides/ongoing?userID=${profileId}&bookingId=${userId}`);
                const data = await response.json();

                if (Array.isArray(data.data) && data.data.length > 0) {
                    setGeoJsonData(data.data);
                    setLoading(false);
                    generateStaticMapUrl(data.data);
                } else {
                    console.error('No ongoing ride data found.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [profileId, userId]);

    const generateStaticMapUrl = (data: any) => {
        const markers = data.map((booking: any) => `${booking.booking.bikeWithDevice.location.coordinates[1]},${booking.booking.bikeWithDevice.location.coordinates[0]}`).join('|');

        console.log(markers);

        const markerStyles = 'color:green|label:S';
        const url = `https://maps.googleapis.com/maps/api/staticmap?size=1200x600&scale=2&markers=${markerStyles}|${markers}&key=AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc`;
        console.log(url);
        setStaticMapUrl(url);
    };

    const downloadInvoice = async () => {
        if (invoiceRef.current) {
            try {
                const canvas = await html2canvas(invoiceRef.current);
                console.log('Canvas:', canvas);
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'invoice.png';
                link.click();
            } catch (error) {
                console.error('Error capturing invoice:', error);
            }
        } else {
            console.error('Invoice ref is null');
        }
    };

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

    function formatTimestampToDate(timestamp: number) {
        // Convert the timestamp from seconds to milliseconds
        const date = new Date(timestamp * 1000);

        // Format options
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        // Return the formatted date
        return date.toLocaleDateString('en-US', options);
    }
    return (
        <div>
            <div className='card'>
                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                    <div className="field col-6">
                        <label>Booking ID</label>
                        <p>{geoJsonData[0]?.booking?.id}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Time</label>
                        <p>{formatTimestampToDate(geoJsonData[0]?.booking?.startTime)}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Time</label>
                        <p>{geoJsonData[0]?.booking?.endTime}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Station</label>
                        <p>{geoJsonData[0]?.booking?.startingStation.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Point</label>
                        <p>{geoJsonData[0]?.booking?.endingStation?.name || 'NA'}</p>
                    </div>
                    <div className="field col-6">
                        <label>Total Distance</label>
                        <p>{geoJsonData[0]?.booking?.totalDistance}</p>
                    </div>
                    <div className="field col-6">
                        <label>Green Points</label>
                        <p>{geoJsonData[0]?.booking?.greenPoints}</p>
                    </div>
                    <div className="field col-6">
                        <label>Carbon Saved</label>
                        <p>{geoJsonData[0]?.booking?.carbonSaved}</p>
                    </div>
                    <div className="col-6">
                        <label>Start Address</label>
                        <p>{geoJsonData[0]?.booking?.startingStation.address.address}</p>
                    </div>
                    <div className="col-6">
                        <label>End Address</label>
                        <p>{geoJsonData[0]?.booking?.endingStation?.address.address || 'NA'}</p>
                    </div>
                </div>
                <div className="w-full">
                    <Button className="font-bold mx-auto" onClick={downloadInvoice}>
                        Download Invoice
                    </Button>
                </div>
            </div>
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
                    {geoJsonData.map((booking: any, index: number) => {
                        console.log(booking);
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
            <Dialog header="Invoice" visible={preview} onHide={() => setPreview(false)} className="w-[50vw]" style={{ width: '50svw' }}>
                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                    <div className="field col-6">
                        <label>Booking ID</label>
                        <p>{geoJsonData[0]?.booking?.id}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Time</label>
                        <p>{formatTimestampToDate(geoJsonData[0]?.booking?.startTime)}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Time</label>
                        <p>{geoJsonData[0]?.booking?.endTime}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Station</label>
                        <p>{geoJsonData[0]?.booking?.startingStation.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Point</label>
                        <p>{geoJsonData[0]?.booking?.endingStation?.name || 'NA'}</p>
                    </div>
                    <div className="field col-6">
                        <label>Total Distance</label>
                        <p>{geoJsonData[0]?.booking?.totalDistance}</p>
                    </div>
                    <div className="field col-6">
                        <label>Green Points</label>
                        <p>{geoJsonData[0]?.booking?.greenPoints}</p>
                    </div>
                    <div className="field col-6">
                        <label>Carbon Saved</label>
                        <p>{geoJsonData[0]?.booking?.carbonSaved}</p>
                    </div>
                    <div className="col-6">
                        <label>Start Address</label>
                        <p>{geoJsonData[0]?.booking?.startingStation.address.address}</p>
                    </div>
                    <div className="col-6">
                        <label>End Address</label>
                        <p>{geoJsonData[0]?.booking?.endingStation?.address.address || 'NA'}</p>
                    </div>
                    <div className="w-full h-[300px]">{loading ? <p>Loading map...</p> : <Image width={200} height={200} objectFit="cover" style={{ objectFit: 'cover' }} className="w-full object-conver" src={staticMapUrl} alt="Map" />}</div>
                </div>
                <div className="w-full">
                    <Button className="font-bold mx-auto" onClick={downloadInvoice}>
                        Download Invoice
                    </Button>
                </div>
            </Dialog>

        </div>
    );
};

export default ViewAllBooking;
