'use client';

import { getBookings } from '@/app/api/iotBikes';
import { useEffect, useRef, useState } from 'react';
import CustomTable from '../../components/table';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';

const Booking = ({ searchParams }: { searchParams: any }) => {
    const router = useRouter();
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [bookingData, setBookingData] = useState<any>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState(false);
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
    const ViewStationOnMap = (rowData: any) => {
        return <i onClick={(e) => router.push(`/services/ridenowTransaction/transaction?profileId=${rowData.profileId}&userId=${rowData.id}`)} className="pi pi-map-marker map-icon" style={{ fontSize: '1.5em' }}></i>;
    };
    const idTemplate = (rowData: any) => {
        return <i onClick={(e) => router.push(`/services/ridenowTransaction/transaction?profileId=${rowData.profileId}&userId=${rowData.id}`)} style={{ fontSize: '1.5em' }}>{rowData.id}</i>;
    };
    function formatTimestampToDate(timestamp: number) {
        // Convert the timestamp from seconds to milliseconds
        const date = new Date(timestamp * 1000);

        // Format options
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        // Return the formatted date
        return date.toLocaleDateString('en-US', options);
    }
    const columns: any[] = [
        {
            key: 'id', label: 'Id', _props: { scope: 'col' }, body: (rowData: any) => <div onClick={() => router.push(`/services/ridenowTransaction/transaction?profileId=${rowData.profileId}&userId=${rowData.id}`)} >{rowData.id}</div>,
        },
        //  { key: 'viewOnMap', label: 'ViewMap', _props: { scope: 'col' }, body: ViewStationOnMap },
        { key: 'profileId', label: 'ProfileId', _props: { scope: 'col' } },
        { key: 'deviceId', label: 'DeviceId', _props: { scope: 'col' } },
        { key: 'startTime', label: 'StartTime', _props: { scope: 'col' } },
        { key: 'endTime', label: 'EndTime', _props: { scope: 'col' } },
        // { key: 'startKm', label: 'StartKm', _props: { scope: 'col' } },
        // { key: 'endKm', label: 'EndKm', _props: { scope: 'col' } },
        { key: 'totalDistance', label: 'TotalDistance', _props: { scope: 'col' } },
        // { key: 'return', label: 'Return', _props: { scope: 'col' } },
        { key: 'price', label: 'Price', _props: { scope: 'col' } },
        { key: 'status', label: 'Status', _props: { scope: 'col' } },
        { key: 'vehicleType', label: 'VehicleType', _props: { scope: 'col' } },
        { key: 'bookingType', label: 'BookingType', _props: { scope: 'col' } },
        // { key: 'plan', label: 'Plan', _props: { scope: 'col' } },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } },
        { key: 'startingStationId', label: 'StartingStationId', _props: { scope: 'col' } },
        { key: 'endingStationId', label: 'EndingStationId', _props: { scope: 'col' } },
        { key: 'userId', label: 'EndingStationId', _props: { scope: 'col' } },
        { key: 'carbonEmissionSaved', label: 'CarbonEmissionSaved', _props: { scope: 'col' } },
        // { key: 'startingStation', label: 'StartingStation', _props: { scope: 'col' } },
        // { key: 'endingStation', label: 'EndingStation', _props: { scope: 'col' } },
        { key: 'couponCode', label: 'CouponCode', _props: { scope: 'col' } },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' } }
        // { key: 'invoice', label: 'Invoice', _props: { scope: 'col' }, body: InvoiceTemplate }
    ];
    const fetchData = async () => {
        // debugger;
        let response = await getBookings('hourly');
        if (response.success && response.data) {
            const data = [];
            if (searchParams) {
                for (let i = 0; i < response.data.length; i++) {
                    if (searchParams.userId) {
                        if (response.data[i].profileId === searchParams.userId) {
                            data.push(response.data[i]);
                        }
                    } else if (searchParams.device) {
                        if (response.data[i].deviceId === searchParams.device) {
                            data.push(response.data[i]);
                        }
                    } else {
                        data.push(response.data[i]);
                    }
                }
            } else {
                data.push(...response.data);
            }
            setItems(data);
        }
        setLoading1(false);
    };
    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb model={[{ label: 'Bookings' }]} home={{ icon: 'pi pi-home', url: '/' }} />
            </div>
            <div className="col-12">
                <CustomTable tableName='rides' mapNavigatePath="/services/ridenowbooking" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
            </div>
            <Dialog header="Invoice" visible={preview} onHide={() => setPreview(false)} className="w-[50vw]" style={{ width: '50svw' }}>
                <div ref={invoiceRef} className="grid rounded-lg text-black" style={{ background: '#1F2937' }}>
                    <div className="field col-6">
                        <label>Booking ID</label>
                        <p>{bookingData?.id}</p>
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
        </div>
    );
};
export default Booking;
