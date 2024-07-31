'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../../components/table';
import Link from 'next/link';
import { getBikeByDevice } from '@/app/api/iotBikes';

const VehicleData = (params: any) => {
    const {
        params: { deviceId }
    } = params;
    const [loading1, setLoading1] = useState(true);
    const [upperUserData, setUpperUserData] = useState<any>([]); // Initialize as null

    const [vehicleDetails, setVehicleDetails] = useState<any>(null); // Initialize as null

    const fetchVehicleData = async () => {
        setLoading1(true);
        try {
            const response = await fetch(`https://futureev.trestx.com/api/v1/vehicle/data/${deviceId}`);
            const data = await response.json();
            if (data.data) {
                setVehicleDetails(data.data);
            } else {
                setVehicleDetails([]); // Set to empty array if data.data is null
            }
        } catch (error) {
            console.error('Error fetching vehicle data:', error);
            setVehicleDetails([]);
        } finally {
            setLoading1(false);
        }
    };

    const fetchUpperUserDetails = async () => {
        const response = await getBikeByDevice(deviceId);
        if (response.success && response.data) {
            console.log(response.data);
            setUpperUserData(response.data);
        }
    };

    useEffect(() => {
        fetchVehicleData();
        fetchUpperUserDetails();
    }, [deviceId]);

    if (loading1) return <h1>Loading...</h1>; // Show loading message while fetching data
    if (vehicleDetails?.length === 0 && upperUserData?.length === 0) return <h1>No Vehicle Details Available</h1>; // Handle no data case

    const bookingIdTemplate = (rowData: any) => <div>{rowData?.booking.id}</div>;
    const deviceIdTemplate = (rowData: any) => <div>{rowData?.DeviceId}</div>;
    const vehicleTypeIdTemplate = (rowData: any) => <div>{rowData?.Type}</div>;
    const nameTemplate = (rowData: any) => <div>{rowData?.Name}</div>;
    const totalDistanceTemplate = (rowData: any) => <div>{rowData?.TotalDistance}</div>;
    const priceTemplate = (rowData: any) => <div>{rowData?.Price}</div>;
    const PlanTypeTemplate = (rowData: any) => <div>{rowData?.PlanType}</div>;
    const batteryLevelTemplate = (rowData: any) => <div>{rowData?.BatteryLevel}</div>;
    const distanceCoverPerBookingTemplate = (rowData: any) => <div>{rowData?.booking.TotalDistance}</div>;
    const bookingTypeTemplate = (rowData: any) => <div>{rowData?.booking.BookingType}</div>;
    const carbonEmissionSavedTemplate = (rowData: any) => <div>{rowData?.booking.CarbonEmissionSaved}</div>;
    const startingStationTemplate = (rowData: any) => <div>{rowData?.booking.StartingStation.Name}</div>;
    const endingStationTemplate = (rowData: any) => <div>{rowData?.booking.EndingStation.Name}</div>;
    const couponCodeTemplate = (rowData: any) => <div>{rowData?.booking.CouponCode || 'NA'}</div>;
    const greenPointsTemplate = (rowData: any) => <div>{rowData?.booking.GreenPoints}</div>;
    const carbonSavedTemplate = (rowData: any) => <div>{rowData?.booking.CarbonSaved}</div>;
    const passengerNameTemplate = (rowData: any) => <div>{rowData?.Profile.Name}</div>;
    const currentLocationTemplate = (rowData: any) => <Link href={`/vehicleOnboarding/${deviceId}/${rowData?.Location.Coordinates}`}>{rowData?.Location.Coordinates?.join(' , ')}</Link>;

    const columns = [
        { key: 'id', label: 'Booking Id', _props: { scope: 'col' }, body: bookingIdTemplate },
        { key: 'currentLocation', label: 'Current Location', _props: { scope: 'col' }, body: currentLocationTemplate },
        { key: 'name', label: 'Name', _props: { scope: 'col' }, body: nameTemplate },
        { key: 'totalDistance', label: 'Total Distance', _props: { scope: 'col' }, body: totalDistanceTemplate },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, body: priceTemplate },
        { key: 'planType', label: 'Plan Type', _props: { scope: 'col' }, body: PlanTypeTemplate },
        { key: 'batteryLevel', label: 'Battery Level', _props: { scope: 'col' }, body: batteryLevelTemplate },
        { key: 'distanceCoverPerBooking', label: 'Distance Covered Per Booking', _props: { scope: 'col' }, body: distanceCoverPerBookingTemplate },
        { key: 'bookingType', label: 'Booking Type', _props: { scope: 'col' }, body: bookingTypeTemplate },
        { key: 'carbonEmissionSaved', label: 'Carbon Emission Saved', _props: { scope: 'col' }, body: carbonEmissionSavedTemplate },
        { key: 'startingStation', label: 'Starting Station', _props: { scope: 'col' }, body: startingStationTemplate },
        { key: 'endingStation', label: 'Ending Station', _props: { scope: 'col' }, body: endingStationTemplate },
        { key: 'couponCode', label: 'Coupon Code', _props: { scope: 'col' }, body: couponCodeTemplate },
        { key: 'greenPoints', label: 'Green Points', _props: { scope: 'col' }, body: greenPointsTemplate },
        { key: 'carbonSaved', label: 'Carbon Saved', _props: { scope: 'col' }, body: carbonSavedTemplate },
        { key: 'passengerName', label: 'Passenger Name', _props: { scope: 'col' }, body: passengerNameTemplate },
        { key: 'deviceId', label: 'Device Id', _props: { scope: 'col' }, body: deviceIdTemplate },
        { key: 'vehicleTypeId', label: 'Vehicle Type ID', _props: { scope: 'col' }, body: vehicleTypeIdTemplate }
    ];

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'VehicleData' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>

                <div className="col-12">
                    {upperUserData && upperUserData.length > 0 ? (
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Device ID: {upperUserData[0]?.deviceId}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Booking ID: {vehicleDetails[0]?.booking.id || 'No Booking Yet'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Vehicle Type: {upperUserData[0]?.vehicleType?.name}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Bike Name: {upperUserData[0]?.deviceData.name}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Total Distance: {upperUserData[0]?.deviceData?.totalDistance || 0}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Daily Distance: {upperUserData[0]?.deviceData?.daily_distance || 0}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Price: {upperUserData[0]?.vehicleType?.price}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Plan Type: {vehicleDetails[0]?.PlanType || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Battery Level: {upperUserData[0]?.deviceData?.batteryLevel || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>harsh Braking History: {upperUserData[0]?.deviceData?.harshBrakingHistory?.join(',') || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>harsh Acceleration History: {upperUserData[0]?.deviceData?.harshAccelerationHistory?.join(',') || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Distance Covered Per Booking: {vehicleDetails[0]?.booking.TotalDistance}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Booking Type: {upperUserData[0]?.deviceData?.type}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Carbon Emission Saved: {vehicleDetails[0]?.booking.CarbonEmissionSaved}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Station: {upperUserData[0]?.station.name}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Station Address: {upperUserData[0]?.station.address.address}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Station City: {upperUserData[0]?.station.address?.city}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>
                                    Station Location:
                                    {/* <Link href={`/vehicleOnboarding/${deviceId}/${upperUserData[0]?.station?.location?.coordinates?.join(' , ')}`}>{upperUserData[0]?.station?.location?.coordinates?.join(' , ')}</Link> */}
                                    {upperUserData[0]?.station?.location?.coordinates?.join(' , ')}
                                </p>
                            </div>

                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Coupon Code: {vehicleDetails[0]?.booking.CouponCode || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Green Points: {vehicleDetails[0]?.booking.GreenPoints || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Carbon Saved: {vehicleDetails[0]?.booking.CarbonSaved || 'NA'}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>Passenger Name: {vehicleDetails[0]?.Profile.Name}</p>
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <p>
                                    Current Location:{' '}
                                    <Link
                                        href={`/vehicleOnboarding/${deviceId}/${upperUserData[0]?.deviceData?.longitude},${upperUserData[0]?.deviceData?.latitude}`}
                                    >{`${upperUserData[0]?.deviceData?.latitude},${upperUserData[0]?.deviceData?.longitude}`}</Link>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <h1>No Vehicle Details Available</h1>
                    )}
                </div>

                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={vehicleDetails} loading1={loading1} />{' '}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleData;
