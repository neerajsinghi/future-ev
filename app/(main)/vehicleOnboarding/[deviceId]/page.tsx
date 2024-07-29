'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../../components/table';
import Link from 'next/link';

const VehicleData = (params: any) => {
    const {
        params: { deviceId }
    } = params;
    const [loading1, setLoading1] = useState(true);
    const [vehicleDetails, setVehicleDetails] = useState<any[]>([]);

    const fetchVehicleData = async () => {
        setLoading1(true);
        const response = await fetch(`https://futureev.trestx.com/api/v1/vehicle/data/${deviceId}`);
        const data = await response.json();
        console.log(data.data);
        setVehicleDetails(data.data);
        setLoading1(false);
    };

    useEffect(() => {
        fetchVehicleData();
    }, []);

    const bookingIdTemplate = (rowData: any) => <div>{rowData.booking.id}</div>;
    const deviceIdTemplate = (rowData: any) => <div>{rowData.DeviceId}</div>;
    const vehicleTypeIdTemplate = (rowData: any) => <div>{rowData.Type}</div>;
    const nameTemplate = (rowData: any) => <div>{rowData.Name}</div>;
    const totalDistanceTemplate = (rowData: any) => <div>{rowData.TotalDistance}</div>;
    const priceTemplate = (rowData: any) => <div>{rowData.Price}</div>;
    const PlanTypeTemplate = (rowData: any) => <div>{rowData.PlanType}</div>;
    const batteryLevelTemplate = (rowData: any) => <div>{rowData.BatteryLevel}</div>;
    const distanceCoverPerBookingTemplate = (rowData: any) => <div>{rowData.booking.TotalDistance}</div>;
    const bookingTypeTemplate = (rowData: any) => <div>{rowData.booking.BookingType}</div>;
    const carbonEmissionSavedTemplate = (rowData: any) => <div>{rowData.booking.CarbonEmissionSaved}</div>;
    const startingStationTemplate = (rowData: any) => <div>{rowData.booking.StartingStation.Name}</div>;
    const endingStationTemplate = (rowData: any) => <div>{rowData.booking.EndingStation.Name}</div>;
    const couponCodeTemplate = (rowData: any) => <div>{rowData.booking.CouponCode || 'NA'}</div>;
    const greenPointsTemplate = (rowData: any) => <div>{rowData.booking.GreenPoints}</div>;
    const carbonSavedTemplate = (rowData: any) => <div>{rowData.booking.CarbonSaved}</div>;
    const passengerNameTemplate = (rowData: any) => <div>{rowData.Profile.Name}</div>;
    const currentLocationTemplate = (rowData: any) => <Link href={`/vehicleOnboarding/${deviceId}/${rowData.Location.Coordinates}`}>{rowData.Location.Coordinates?.join(' , ')}</Link>;

    const columns = [
        { key: 'id', label: 'Booking Id', _props: { scope: 'col' }, body: bookingIdTemplate },
        { key: 'deviceId', label: 'Device Id', _props: { scope: 'col' }, body: deviceIdTemplate },
        { key: 'vehicleTypeId', label: 'Vehicle Type ID', _props: { scope: 'col' }, body: vehicleTypeIdTemplate },
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
        { key: 'passengerName', label: 'Passenger Name', _props: { scope: 'col' }, body: passengerNameTemplate }
    ];

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'VehicleData' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>

                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Device ID: {vehicleDetails[0]?.DeviceId}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Booking ID: {vehicleDetails[0]?.booking.id}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Vehicle Type: {vehicleDetails[0]?.Type}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Name: {vehicleDetails[0]?.Name}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Total Distance: {vehicleDetails[0]?.TotalDistance}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Price: {vehicleDetails[0]?.Price}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Plan Type: {vehicleDetails[0]?.PlanType}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Battery Level: {vehicleDetails[0]?.BatteryLevel}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Distance Covered Per Booking: {vehicleDetails[0]?.booking.TotalDistance}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Booking Type: {vehicleDetails[0]?.booking.BookingType}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Carbon Emission Saved: {vehicleDetails[0]?.booking.CarbonEmissionSaved}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Starting Station: {vehicleDetails[0]?.booking.StartingStation.Name}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Ending Station: {vehicleDetails[0]?.booking.EndingStation.Name}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Coupon Code: {vehicleDetails[0]?.booking.CouponCode || 'NA'}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Green Points: {vehicleDetails[0]?.booking.GreenPoints}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Carbon Saved: {vehicleDetails[0]?.booking.CarbonSaved}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>Passenger Name: {vehicleDetails[0]?.Profile.Name}</p>
                        </div>
                        <div className="col-12 md:col-6 lg:col-4">
                            <p>
                                Current Location: <Link href={`/vehicleOnboarding/${deviceId}/${vehicleDetails[0]?.Location.Coordinates}`}>{vehicleDetails[0]?.Location.Coordinates?.join(' , ')}</Link>
                            </p>
                        </div>
                    </div>
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
