'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import React, { useEffect, useRef, useState } from 'react';
import CustomTable from '../../components/table';
import '../plan.css';
import { useRouter } from 'next/navigation';
import { Image } from 'primereact/image';
import { set } from 'date-fns';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';
import Link from 'next/link';

const Page = (params: any) => {
    const {
        params: { userId }
    } = params;

    const [userWalletData, setUserWalletData] = useState<any>(null); // Initialize as null
    const [userData, setUserData] = useState<any>(null); // Initialize as null
    const [bookings, setBookings] = useState<any>(null); // Initialize as null
    const [loading1, setLoading1] = useState(true);// Start as true to show loading state
    const [plans, setPlans] = useState<any>(null);
    const [bookingData, setBookingData] = useState<any>(null);
    const [planData, setPlanData] = useState<any>(null);

    const router = useRouter();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState(false);
    const [previewPlan, setPreviewPlan] = useState(false);
    const fetchUserDetails = async () => {
        setLoading1(true);
        try {
            const response = await fetch(`https://futureev.trestx.com/api/v1/wallet/${userId}`);
            const data = await response.json();
            const nonPlan: any[] = [];
            const plan: any[] = [];
            for (let i: number = 0; i < data.data.Wallets.length; i++) {
                if (data.data.Wallets[i].planId) {
                    plan.push(data.data.Wallets[i]);
                } else {
                    nonPlan.push(data.data.Wallets[i]);
                }
            }
            setPlans(plan);
            debugger
            setUserWalletData(nonPlan);
            const response2 = await fetch(`https://futureev.trestx.com/api/v1/users/${userId}`);
            const data2 = await response2.json();
            setUserData(data2.data);
            const response3 = await fetch(`https://futureev.trestx.com/api/v1/bookings/my/${userId}`);
            const data3 = await response3.json();
            setBookings(data3.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setUserWalletData(null); // Set to null on error
        } finally {
            setLoading1(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [userId]); // Added dependency on userId to refetch data if userId changes

    if (!userWalletData) return <h1>No User Profile Data Available</h1>; // Handle no data case

    const idTemplate = (rowData: any) => <div onClick={() => {

        setBookingData({ ...rowData });
        setPreview(true);
    }}>{rowData.id}</div>;
    const idPlanTemplate = (rowData: any) => <div onClick={() => {

        setPlanData({ ...rowData });
        setPreviewPlan(true);
    }}>{rowData.id}</div>;
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'depositedMoney', label: 'Deposit', _props: { scope: 'col' } },
        { key: 'paymentId', label: 'Payment ID', _props: { scope: 'col' } },
        { key: 'usedMoney', label: 'Used', _props: { scope: 'col' } },
        { key: 'bookingId', label: 'Booking ID', _props: { scope: 'col' } },
        { key: 'createdTime', label: 'Created Time', _props: { scope: 'col' } }
    ];
    const columnsPlan = [
        { key: 'id', label: 'Id', _props: { scope: 'col' }, body: idPlanTemplate },
        { key: 'usedMoney', label: 'Used', _props: { scope: 'col' } },
        { key: 'planId', label: 'Plan ID', _props: { scope: 'col' } },
        { key: "plan.name", label: "Rental Name", _props: { scope: 'col' } },
        { key: "plan.city", label: "Rent City", _props: { scope: 'col' } },
        { key: "plan.validity", label: "Rental Plan Validity", _props: { scope: 'col' } },
        { key: "plan.price", label: "Rental Plan Price", _props: { scope: 'col' } },
        { key: 'createdTime', label: 'Rental Started Time', _props: { scope: 'col' } }
    ];
    const ViewStationOnMap = (rowData: any) => {
        return <i onClick={(e) => router.push(`/services/ridenowTransaction/transaction?profileId=${rowData.profileId}&userId=${rowData.id}`)} className="pi pi-map-marker map-icon" style={{ fontSize: '1.5em' }}></i>;
    };
    const columnsBooking: any[] = [
        { key: 'id', label: 'Id', _props: { scope: 'col' }, body: idTemplate },
        { key: 'viewOnMap', label: 'ViewMap', _props: { scope: 'col' }, body: ViewStationOnMap },
        { key: 'deviceId', label: 'DeviceId', _props: { scope: 'col' } },
        { key: 'startTime', label: 'StartTime', _props: { scope: 'col' } },
        { key: 'endTime', label: 'EndTime', _props: { scope: 'col' } },
        { key: 'totalDistance', label: 'TotalDistance', _props: { scope: 'col' } },
        { key: 'price', label: 'Price', _props: { scope: 'col' } },
        { key: 'status', label: 'Status', _props: { scope: 'col' } },
        { key: 'vehicleType', label: 'VehicleType', _props: { scope: 'col' } },
        { key: 'bookingType', label: 'BookingType', _props: { scope: 'col' } },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } },
        { key: 'startingStationId', label: 'StartingStationId', _props: { scope: 'col' } },
        { key: 'endingStationId', label: 'EndingStationId', _props: { scope: 'col' } },
        { key: 'userId', label: 'EndingStationId', _props: { scope: 'col' } },
        { key: 'carbonEmissionSaved', label: 'CarbonEmissionSaved', _props: { scope: 'col' } },
        { key: 'couponCode', label: 'CouponCode', _props: { scope: 'col' } },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' } }
    ];
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
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'User Details' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                {userWalletData?.length > 0 && <h1>User Details</h1>}
                {userData ? (
                    <div className="col-12">
                        <div className="profile-details">
                            <p>
                                <strong>User Name:</strong> {userData.name}
                            </p>
                            <p>
                                <strong>Date of Birth:</strong> {userData.dob}
                            </p>
                            <p>
                                <strong>Gender:</strong> {userData.gender}
                            </p>
                            <p>
                                <strong>Phone Number:</strong> {userData.phoneNumber}
                            </p>
                            <p>
                                <strong>Role:</strong> {userData.role}
                            </p>
                            <p>
                                <strong>Country Code:</strong> {userData.countryCode}
                            </p>
                            <p>
                                <strong>DL Verified:</strong> {userData.dlVerified ? <span style={{ color: 'green' }}>Yes</span> : <span style={{ color: 'red' }}>No</span>}
                            </p>
                            <p>
                                <strong>ID Verified:</strong> {userData.idVerified ? <span style={{ color: 'green' }}>Yes</span> : <span style={{ color: 'red' }}>No</span>}
                            </p>
                            <p>
                                <strong>Referral Code:</strong> {userData.referralCode}
                            </p>
                            <p>
                                <strong>Green Points:</strong> {userData.greenPoints}
                            </p>
                            <p>
                                <strong>Carbon Saved:</strong> {userData.carbonSaved}
                            </p>
                            <p>
                                <strong>Total Balance:</strong> {userWalletData?.TotalBalance}
                            </p>
                            <p>
                                <strong>Refundable Money:</strong> {userWalletData?.RefundableMoney}
                            </p>
                        </div>
                        <div className="profile-images">
                            {userData.dlFrontImage && <div>
                                <p>
                                    <strong>DL Front Image:</strong>
                                </p>
                                <Image width='200' height='100' src={userData.dlFrontImage} alt="DL Front" />
                            </div>}
                            {userData.dlBackImage && <div>
                                <p>
                                    <strong>DL Back Image:</strong>
                                </p>
                                <Image width='200' height='100' src={userData.dlBackImage} alt="DL Back" />
                            </div>}
                            {userData.idFrontImage && <div>
                                <p>
                                    <strong>ID Front Image:</strong>
                                </p>
                                <Image width='200' height='100' src={userData.idFrontImage} alt="ID Front" />
                            </div>}
                            {userData.idBackImage && <div>
                                <p>
                                    <strong>ID Back Image:</strong>
                                </p>
                                <Image width='200' height='100' src={userData.idBackImage} alt="ID Back" />
                            </div>}
                        </div>
                    </div>
                ) : (
                    <h2>No Profile Details Available</h2>
                )}
                {userData?.plan && <div className="card">
                    <h2>User Current Subscription</h2>
                    <div className="profile-details">
                        <p>
                            <strong>Subscription Name:</strong> {userData.plan.name}
                        </p>
                        <p>
                            <strong>Subscription Price:</strong> {userData.plan.price}
                        </p>
                        <p>
                            <strong>Subscription City:</strong> {userData.plan.city}
                        </p>
                        <p>
                            <strong>Subscription Validity:</strong> {userData.plan.validity}
                        </p>
                        <p>
                            <strong>Subscription Start time:</strong> {formatTimestampToDate(userData.planStartTime)}
                        </p>
                        <p>
                            <strong>Subscription End Time:</strong> {formatTimestampToDate(userData.planEndTime)}
                        </p>

                    </div>
                </div>}
                <div className="card">
                    <h2>User Plan Details</h2>
                    <CustomTable mapNavigatePath="/users" editMode={undefined} columns2={[]} columns={columnsPlan} items={plans} loading1={loading1} />
                </div>
                <div className="card">
                    <h2>Wallet Details</h2>
                    <CustomTable mapNavigatePath="/users" editMode={undefined} columns2={[]} columns={columns} items={userWalletData} loading1={loading1} />
                </div>
                <div className="card">
                    <h2>Booking Details</h2>
                    <CustomTable mapNavigatePath="/users" editMode={undefined} columns2={[]} columns={columnsBooking} items={bookings} loading1={loading1} />
                </div>
            </div>
            <Dialog header="Invoice" visible={preview} onHide={() => setPreview(false)} className="w-[50vw]" style={{ width: '50svw' }}>
                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                    <div className="field col-6">
                        <label>Booking ID</label>
                        <p>{bookingData?.id}</p>
                    </div>
                    <div className="field col-6">
                        <label>Name</label>
                        <p>{bookingData?.profile?.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Time</label>
                        <p>{formatTimestampToDate(bookingData?.startTime)}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Time</label>
                        <p>{bookingData?.endTime ? formatTimestampToDate(bookingData?.endTime) : 0}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Station</label>
                        <p>{bookingData?.startingStation.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>End Point</label>
                        <p>{bookingData?.endingStation?.name || 'NA'}</p>
                    </div>
                    <div className="field col-6">
                        <label>Total Distance</label>
                        <p>{bookingData?.totalDistance}</p>
                    </div>
                    <div className="field col-6">
                        <label>Green Points</label>
                        <p>{bookingData?.greenPoints}</p>
                    </div>
                    <div className="field col-6">
                        <label>Carbon Saved</label>
                        <p>{bookingData?.carbonSaved}</p>
                    </div>
                    <div className="col-6">
                        <label>Start Address</label>
                        <p>{bookingData?.startingStation.address.address}</p>
                    </div>
                    <div className="col-6">
                        <label>End Address</label>
                        <p>{bookingData?.endingStation?.address.address || 'NA'}</p>
                    </div>
                    <div className="col-6">
                        <label>Price</label>
                        <p>{bookingData?.price}</p>
                    </div>
                </div>
                <div className="w-full">
                    <Button className="font-bold mx-auto" onClick={downloadInvoice}>
                        Download Invoice
                    </Button>
                </div>
            </Dialog>
            <Dialog header="Invoice" visible={previewPlan} onHide={() => setPreviewPlan(false)} className="w-[50vw]" style={{ width: '50svw' }}>
                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                    <div className="field col-6">
                        <label>Subscription Name</label>
                        <p>{planData?.plan?.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>Name</label>
                        <p>{userData?.name}</p>
                    </div>
                    <div className="field col-6">
                        <label>Subscription City</label>
                        <p>{planData?.plan?.city}</p>
                    </div>
                    <div className="field col-6">
                        <label>Subscription Validity</label>
                        <p>{planData?.plan?.validity}</p>
                    </div>
                    <div className="field col-6">
                        <label>Subscription Price</label>
                        <p>{planData?.plan?.price}</p>
                    </div>
                    <div className="field col-6">
                        <label>Start Time</label>
                        <p>{planData?.createdTime}</p>
                    </div>


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

export default Page;
