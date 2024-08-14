'use client';

import { getBookings, getWalletPlan } from '@/app/api/iotBikes';
import { useEffect, useRef, useState } from 'react';
import CustomTable from '../../../components/table';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';
import useIsAccessible from '@/app/hooks/isAccessible';

const Booking = (params: any) => {
    const { params: { rentalCode } } = params;
    const isAccessible = useIsAccessible('rentalTransactions');
    const router = useRouter();
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [bookingData, setBookingData] = useState<any>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState(false);
    const [planData, setPlanData] = useState<any>(null);
    const [discountedMoney, setDiscountedMoney] = useState(0);
    const [totalMoney, setTotalMoney] = useState(0);
    const [previewPlan, setPreviewPlan] = useState(false);
    useEffect(() => {
        fetchData();
        return () => {
            setItems([]);
        };
    }, []);
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
    const ViewStationOnMap = (rowData: any) => {
        return <i onClick={(e) => router.push(`/services/rentalTransactions/transaction?userId=${rowData.id}&profileId=${rowData.profileId}`)} className="pi pi-map-marker map-icon" style={{ fontSize: '1.5em' }}></i>;
    };
    const idPlanTemplate = (rowData: any) => (
        <div
            style={{ color: '#3262EC' }}
            onClick={() => {
                setPlanData({ ...rowData });
                setPreviewPlan(true);
            }}
        >
            {rowData.id}
        </div>
    );
    const ViewBookings = (rowData: any) => {
        return (
            <i onClick={(e) => router.push(`/services/rentalTransactions/bookings?userId=${rowData.userId}&planId=${rowData.planId}`)} className="" style={{ fontSize: '1.5em' }}>
                {rowData?.bookingCount}
            </i>
        );
    };
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' }, body: idPlanTemplate },
        { key: "couponCode", label: "Coupon Used", _props: { scope: "col" } },
        { key: 'discountedAmount', label: 'Discount', _props: { scope: 'col' } },
        { key: 'usedMoney', label: 'Used', _props: { scope: 'col' } },
        { key: 'planId', label: 'Plan ID', _props: { scope: 'col' } },
        { key: 'plan.name', label: 'Rental Name', _props: { scope: 'col' } },
        { key: 'plan.city', label: 'Rent City', _props: { scope: 'col' } },
        { key: 'plan.validity', label: 'Rental Plan Validity', _props: { scope: 'col' } },
        { key: 'plan.price', label: 'Rental Plan Price', _props: { scope: 'col' } },
        { key: 'userData.name', label: 'User Name', _props: { scope: 'col' } },
        { key: 'bookingCount', label: 'Bookings', _props: { scope: 'col' }, body: ViewBookings },
        { key: 'createdTime', label: 'Rental Started Time', _props: { scope: 'col' } },
        {
            key: 'endTime',
            label: 'Rental Ended Time',
            _props: { scope: 'col' }
        }
    ];
    const fetchData = async () => {
        let response = await getWalletPlan();
        if (response.success && response.data) {
            const data = [];
            let discount = 0;
            let total = 0;

            for (let i = 0; i < response.data.length; i++) {
                if (rentalCode === response.data[i].couponCode) {
                    discount += response.data[i].discountedAmount;
                    total += response.data[i].usedMoney;
                    data.push(response.data[i]);
                }
            }
            setItems(data);
            setDiscountedMoney(discount);
            setTotalMoney(total);
        }
        setLoading1(false);
    };

    if (isAccessible === 'None') {
        return <h1>You Dont Have Access To This Page</h1>;
    }
    return (
        <div className="grid">
            {(isAccessible === 'Edit' ||
                isAccessible === 'View') && (
                    <>
                        <div className="col-12">
                            <BreadCrumb model={[{ label: 'Bookings' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h4>{rentalCode}</h4>
                            </div>
                            <div className="card-body">
                                <div className="grid">

                                    <div className="field col-6">
                                        <label>Total Money</label>
                                        <p>{totalMoney}</p>
                                    </div>
                                    <div className="field col-6">
                                        <label>Discounted Money</label>
                                        <p>{discountedMoney}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} tableName="plans" />

                            <Dialog header="Invoice" visible={previewPlan} onHide={() => setPreviewPlan(false)} className="w-[50vw]" style={{ width: '50svw' }}>
                                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                                    <div className="field col-6">
                                        <label>Subscription Name</label>
                                        <p>{planData?.plan?.name}</p>
                                    </div>
                                    <div className="field col-6">
                                        <label>Name</label>
                                        <p>{planData?.userData.name}</p>
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
                    </>
                )}
        </div>
    );
};
export default Booking;
