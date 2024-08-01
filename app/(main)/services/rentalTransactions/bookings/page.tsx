'use client';

import { getBookings, getBookingsWithPlanAndUser } from '@/app/api/iotBikes';
import { useEffect, useRef, useState } from 'react';
import CustomTable from '../../../components/table';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import html2canvas from 'html2canvas';

const Booking = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const planId = searchParams.get('planId');
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
            key: 'id',
            label: 'Id',
            _props: { scope: 'col' },
            body: (rowData: any) => <div onClick={() => router.push(`/services/ridenowTransaction/transaction?profileId=${rowData.profileId}&userId=${rowData.id}`)}>{rowData.id}</div>
        },
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
        { key: 'carbonEmissionSaved', label: 'CarbonEmissionSaved', _props: { scope: 'col' } }
    ];
    const fetchData = async () => {
        let response = await getBookingsWithPlanAndUser(planId ? planId : '', userId ? userId : '');
        if (response.success && response.data) {
            setItems(response.data);
        }
        setLoading1(false);
    };
    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb model={[{ label: 'Bookings' }]} home={{ icon: 'pi pi-home', url: '/' }} />
            </div>
            <div className="col-12">
                <CustomTable tableName="bookings" mapNavigatePath="/services/ridenowbooking" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
            </div>
        </div>
    );
};
export default Booking;
