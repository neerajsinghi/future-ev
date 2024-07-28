'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/table';

const Page = (params: any) => {
    const {
        params: { userId }
    } = params;

    console.log(userId);

    const [userData, setUserData] = useState<any[]>([]);
    const [loading1, setLoading1] = useState(false);

    const fetchUserDetails = async () => {
        setLoading1(true);
        const response = await fetch(`https://futureev.trestx.com/api/v1/wallet/${userId}`);
        const data = await response.json();
        console.log(data);
        setUserData(data.data.Wallets);
        setLoading1(false);
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const idTemplate = (rowData: any) => <div>{rowData.id}</div>;
    const userIdTemplate = (rowData: any) => <div>{rowData.userId}</div>;
    const bookingIdTemplate = (rowData: any) => <div>{rowData.booking?.id}</div>;
    const planIdTemplate = (rowData: any) => <div>{rowData.booking?.plan?.id}</div>;
    const planTemplate = (rowData: any) => <div>{rowData?.booking?.plan?.type ?? 'N/A'}</div>;
    const statusTemplate = (rowData: any) => <div>{rowData?.status}</div>;
    const profileIdTemplate = (rowData: any) => <div>{rowData.booking?.profileId}</div>;
    const deviceIdTemplate = (rowData: any) => <div>{rowData.booking?.deviceId}</div>;
    const startTimeTemplate = (rowData: any) => <div>{new Date(rowData.booking?.startTime * 1000).toLocaleString()}</div>;
    const endTimeTemplate = (rowData: any) => <div>{rowData.booking?.endTime ? new Date(rowData.booking?.endTime * 1000).toLocaleString() : 'N/A'}</div>;
    const startKmTemplate = (rowData: any) => <div>{rowData.booking?.startKm}</div>;
    const endKmTemplate = (rowData: any) => <div>{rowData.booking?.endKm}</div>;
    const totalDistanceTemplate = (rowData: any) => <div>{rowData.booking?.totalDistance}</div>;
    const priceTemplate = (rowData: any) => <div>{rowData.booking?.plan?.price ?? 'N/A'}</div>;
    const bookingStatusTemplate = (rowData: any) => <div>{rowData.booking?.status}</div>;
    const vehicleTypeTemplate = (rowData: any) => <div>{rowData.booking?.vehicleType}</div>;
    const bookingTypeTemplate = (rowData: any) => <div>{rowData.booking?.bookingType}</div>;
    const cityTemplate = (rowData: any) => <div>{rowData.booking?.plan?.city ?? 'N/A'}</div>;
    const createdTimeTemplate = (rowData: any) => <div>{new Date(rowData.booking?.createdTime).toLocaleString() || 'NA'}</div>;
    const carbonEmissionSavedTemplate = (rowData: any) => <div>{rowData.booking?.carbonEmissionSaved}</div>;

    const columns = [
        { key: 'id', label: 'ID', _props: { scope: 'col' }, body: idTemplate },
        { key: 'userId', label: 'User ID', _props: { scope: 'col' }, body: userIdTemplate },
        { key: 'bookingId', label: 'Booking ID', _props: { scope: 'col' }, body: bookingIdTemplate },
        { key: 'planId', label: 'Plan ID', _props: { scope: 'col' }, body: planIdTemplate },
        { key: 'plan', label: 'Plan', _props: { scope: 'col' }, body: planTemplate },
        { key: 'status', label: 'Status', _props: { scope: 'col' }, body: statusTemplate },
        { key: 'profileId', label: 'Profile ID', _props: { scope: 'col' }, body: profileIdTemplate },
        { key: 'deviceId', label: 'Device ID', _props: { scope: 'col' }, body: deviceIdTemplate },
        { key: 'startTime', label: 'Start Time', _props: { scope: 'col' }, body: startTimeTemplate },
        { key: 'endTime', label: 'End Time', _props: { scope: 'col' }, body: endTimeTemplate },
        { key: 'startKm', label: 'Start KM', _props: { scope: 'col' }, body: startKmTemplate },
        { key: 'endKm', label: 'End KM', _props: { scope: 'col' }, body: endKmTemplate },
        { key: 'totalDistance', label: 'Total Distance', _props: { scope: 'col' }, body: totalDistanceTemplate },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, body: priceTemplate },
        { key: 'bookingStatus', label: 'Booking Status', _props: { scope: 'col' }, body: bookingStatusTemplate },
        { key: 'vehicleType', label: 'Vehicle Type', _props: { scope: 'col' }, body: vehicleTypeTemplate },
        { key: 'bookingType', label: 'Booking Type', _props: { scope: 'col' }, body: bookingTypeTemplate },
        { key: 'city', label: 'City', _props: { scope: 'col' }, body: cityTemplate },
        { key: 'createdTime', label: 'Created Time', _props: { scope: 'col' }, body: createdTimeTemplate },
        { key: 'carbonEmissionSaved', label: 'Carbon Emission Saved', _props: { scope: 'col' }, body: carbonEmissionSavedTemplate }
    ];

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'User Details' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <h1></h1>
            </div>
            <div className="col-12 m-10">
                <div className="card">
                    <CustomTable mapNavigatePath="/users" editMode={undefined} columns2={[]} columns={columns} items={userData} loading1={loading1} />
                </div>
            </div>
        </div>
    );
};

export default Page;
