"use client";

import { BreadCrumb } from "primereact/breadcrumb";
import { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import { getBookings } from "@/app/api/iotBikes";
import Link from "next/link";


const Stand = () => {
    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);

    function flattenData(data: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }, prefix = '', result = {} as any) {
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;

            const value = data[key];
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                flattenData(value, newKey, result); // Recurse for nested objects
            } else {
                // Handle potential conflicts with numbered suffixes
                let uniqueKey = newKey;
                let counter = 1;
                while (result.hasOwnProperty(uniqueKey)) {
                    uniqueKey = `${newKey}_${counter}`;
                    counter++;
                }
                result[uniqueKey] = value;
            }
        }
        return result;
    }
    const fetchData = async () => {

        const response = await getBookings()
        if (response.success && response.data) {
            const data = []
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].status === 'completed') data.push(flattenData(response.data[i]))
            }
            debugger
            setItems(data)
        }
        setLoading1(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const timeFunctionStart = (rowData: any) => {
        return <>{new Date(rowData.startTime * 1000).toLocaleString()}</>
    }
    const timeFunctionEnd = (rowData: any) => {
        return <>{new Date(rowData.endTime * 1000).toLocaleString()}</>
    }

    const timeFunctionTotal = (rowData: any) => {
        debugger
        const time = Math.round((rowData.endTime - rowData.startTime) / 60)
        let timeString = time + " mins"
        if (time > 60) {
            timeString = Math.floor(time / 60) + " hrs " + time % 60 + " mins"

        }
        if (time > 1440) {
            timeString = Math.floor(time / 1440) + " days " + Math.floor((time % 1440) / 60) + " hrs " + time % 60 + " mins"
        }
        return <>{timeString}</>
    }
    const nameTemplate = (rowData: any) => {
        debugger
        const id = rowData.profileId
        return (
            <Link href={
                {
                    pathname: '/users',
                    query: {
                        userId: id

                    }
                }} >
                {rowData["profile.name"]}
            </Link >
        );
    }
    const columns: any[] = [
        { key: "profile.name", label: 'Profile Name', _props: { scope: 'col' }, body: nameTemplate },
        { key: "startTime", label: "Start Time", _props: { scope: "col" }, body: timeFunctionStart },
        { key: "startingStation.name", label: 'Starting Station', _props: { scope: 'col' } },
        { key: "endTime", label: "End Time", _props: { scope: "col" }, body: timeFunctionEnd },
        { key: "totalTime", label: "Total Time", _props: { scope: "col" }, body: timeFunctionTotal },
        { key: "endingStation.name", label: 'Ending Station', _props: { scope: 'col' } },
        { key: "deviceId", label: "Device Id", _props: { scope: "col" } },
        { key: "bikeWithDevice.name", label: "Bike Name", _props: { scope: "col" } },
        { key: "bookingType", label: "Type", _props: { scope: "col" } },
        { key: "price", label: "Price", _props: { scope: "col" } },
        { key: "plan.name", label: "Plan Name", _props: { scope: "col" } },
        { key: "plan.price", label: "Plan Price", _props: { scope: "col" } },
    ]

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Station' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>

                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />

                    </div>
                </div>
            </div>

        </>
    );
}

export default Stand;