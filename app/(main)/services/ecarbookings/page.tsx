'use client';

import { getBookings } from "@/app/api/iotBikes";
import { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import { BreadCrumb } from "primereact/breadcrumb";


const Booking = ({ searchParams }: { searchParams: any }) => {
    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    useEffect(() => {
        fetchData();
        return () => {
            setItems([])
        }
    }, [])

    const columns: any[] = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'profileId', label: 'ProfileId', _props: { scope: 'col' } },
        { key: 'deviceId', label: 'DeviceId', _props: { scope: 'col' } },
        { key: 'startTime', label: 'StartTime', _props: { scope: 'col' } },
        { key: 'endTime', label: 'EndTime', _props: { scope: 'col' } },
        { key: 'startKm', label: 'StartKm', _props: { scope: 'col' } },
        { key: 'endKm', label: 'EndKm', _props: { scope: 'col' } },
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
        { key: 'carbonEmissionSaved', label: 'CarbonEmissionSaved', _props: { scope: 'col' } },
        // { key: 'startingStation', label: 'StartingStation', _props: { scope: 'col' } },
        // { key: 'endingStation', label: 'EndingStation', _props: { scope: 'col' } },
        { key: 'couponCode', label: 'CouponCode', _props: { scope: 'col' } },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' } },
    ]
    const fetchData = async () => {
        debugger
        let response = await getBookings("eCar")
        if (response.success && response.data) {
            const data = []
            if (searchParams) {
                for (let i = 0; i < response.data.length; i++) {

                    if (searchParams.userId) {
                        if (response.data[i].profileId === searchParams.userId) {
                            data.push(response.data[i])
                        }
                    } else if (searchParams.device) {
                        if (response.data[i].deviceId === searchParams.device) {
                            data.push(response.data[i])
                        }
                    } else {
                        data.push(response.data[i])
                    }
                }
            } else {
                data.push(...response.data)
            }

            setItems(data)
        }
        setLoading1(false)
    }
    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb model={[
                    { label: 'Bookings' },
                ]} home={{ icon: 'pi pi-home', url: '/' }} />
            </div>
            <div className="col-12">
                <CustomTable editMode={undefined}
                    columns2={[]}
                    columns={columns}
                    items={items}
                    loading1={loading1}
                />
            </div>
        </div>
    )
}
export default Booking;