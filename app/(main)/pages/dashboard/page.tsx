/* eslint-disable @next/next/no-img-element */
'use client';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { ChartDataState, ChartOptionsState, Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import FlippingCard from './component/flippingCard';
import { getBikes, getBookings, getChargers, getStations, getStatistics, getUsers, getWallet } from '@/app/api/iotBikes';
import { SelectButton } from 'primereact/selectbutton';



const Dashboard = () => {
    const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
    const [idVerifiedUsers, setIdVerifiedUsers] = useState<number>(0);
    const [dlVerifiedUsers, setDlVerifiedUsers] = useState<number>(0);
    const [unVerifiedUsers, setUnVerifiedUsers] = useState<number>(0);
    const [totalEarning, setTotalEarning] = useState<number>(0);
    const [totalAmountInWallet, setTotalAmountInWallet] = useState<number>(0);
    const [totalCo2Emission, setTotalCo2Emission] = useState<number>(0);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [totalRides, setTotalRides] = useState<number>(0);
    const [totalCompletedRides, setTotalCompletedRides] = useState<number>(0);
    const [totalVehicles, setTotalVehicles] = useState<number>(0);
    const [totalActiveVehicles, setTotalActiveVeficles] = useState<number>(0);
    const [totalVehicleOnRoad, setTotalVehicleOnRoad] = useState<number>(0)
    const [totalStations, setTotalStations] = useState<number>(0);
    const [totalActiveStations, setTotalActiveStation] = useState<number>(0);
    const [totalPublicStations, setTotalPublicStations] = useState<number>(0);
    const [totalChargers, setTotalChargers] = useState<number>(0);
    const [totalKwhCharged, setTotalKwhCharged] = useState<number>(0);
    const [selectedTime, setSelectedTime] = useState<any>({ name: "Week", code: 7 });
    const { layoutConfig } = useContext(LayoutContext);
    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        debugger
        const resp = await getStatistics(selectedTime.code)
        /*
        {
    "data": [
        [
            {
                "Key": "numberOfUsers",
                "Value": 22
            },
            {
                "Key": "idVerified",
                "Value": 4
            },
            {
                "Key": "dlVerified",
                "Value": 7
            },
            {
                "Key": "totalStations",
                "Value": [
                    6
                ]
            },
            {
                "Key": "totalPublicStations",
                "Value": [
                    4
                ]
            },
            {
                "Key": "totalActiveStation",
                "Value": [
                    6
                ]
            },
            {
                "Key": "totalCo2Emission",
                "Value": [
                    0
                ]
            },
            {
                "Key": "totalChargers",
                "Value": 1
            },
            {
                "Key": "totalRides",
                "Value": [
                    9
                ]
            },
            {
                "Key": "totalDistance",
                "Value": [
                    45865
                ]
            },
            {
                "Key": "totalCompletedRides",
                "Value": [
                    5
                ]
            },
            {
                "Key": "totalVehicles",
                "Value": [
                    62
                ]
            },
            {
                "Key": "totalActiveVeficles",
                "Value": [
                    28
                ]
            },
            {
                "Key": "totalVehicleOnRoad",
                "Value": [
                    9
                ]
            },
            {
                "Key": "totalEarning",
                "Value": 13600
            },
            {
                "Key": "totalValueInWallet",
                "Value": 8350
            }
        ]
    ],
    "error": "",
    "status": true
}
        */
        if (resp.success && resp.data) {
            setNumberOfUsers(resp.data[0][0].Value)
            setIdVerifiedUsers(resp.data[0][1].Value)
            setDlVerifiedUsers(resp.data[0][2].Value)
            setTotalStations(resp.data[0][3].Value[0])
            setTotalPublicStations(resp.data[0][4].Value[0])
            setTotalActiveStation(resp.data[0][5].Value[0])
            setTotalCo2Emission(resp.data[0][6].Value[0])
            setTotalChargers(resp.data[0][7].Value)
            setTotalRides(resp.data[0][8].Value[0])
            setTotalDistance(resp.data[0][9].Value[0])
            setTotalCompletedRides(resp.data[0][10]?.Value[0] ? resp.data[0][10]?.Value[0] : 0)
            setTotalVehicles(resp.data[0][11].Value[0])
            setTotalActiveVeficles(resp.data[0][12].Value[0])
            setTotalVehicleOnRoad(resp.data[0][13].Value[0])
            setTotalEarning(resp.data[0][14].Value)
            setTotalAmountInWallet(resp.data[0][15].Value)
        }
        // if (resp.success && resp.data) {
        //     setNumberOfUsers(resp.data.length)
        //     let idVerified = 0
        //     let dlVerified = 0
        //     let unverifiedUsers = 0
        //     for (let i = 0; i < resp.data.length; i++) {
        //         if (resp.data[i]["dlVerified"] == true) {
        //             idVerified++
        //         } else if (resp.data[i]["idVerified"] == true) {
        //             dlVerified++
        //         } else {
        //             unverifiedUsers++
        //         }
        //     }
        //     setIdVerifiedUsers(idVerified)
        //     setDlVerifiedUsers(dlVerified)
        //     setUnVerifiedUsers(unverifiedUsers)
        // }
        // const respS = await getStations()
        // if (respS.success && respS.data) {
        //     setTotalStations(respS.data.length)
        //     let publicS = 0
        //     let statusA = 0
        //     let carbonEmissionSaved = 0
        //     for (let i = 0; i < respS.data.length; i++) {
        //         if (respS.data[i]["public"]) {
        //             publicS++
        //         }
        //         if (respS.data[i]["status"] == "available") {
        //             statusA++
        //         }
        //         if (respS.data[i]["carbonSaved"]) {
        //             carbonEmissionSaved += respS.data[i]["carbonSaved"]
        //         }
        //     }
        //     setTotalActiveStation(statusA)
        //     setTotalPublicStations(publicS)
        //     setTotalCo2Emission(carbonEmissionSaved)
        // }
        // const respC = await getChargers()
        // if (respC.success && respC.data) {
        //     setTotalChargers(respC.data.length)
        // }
        // const respR = await getBookings()
        // if (respR.success && respR.data) {
        //     setTotalRides(respR.data.length)
        //     let totalDistance = 0
        //     let completedRides = 0
        //     for (let i = 0; i < respR.data.length; i++) {
        //         totalDistance += respR.data[i]["totalDistance"]
        //         if (respR.data[i]["status"] === "completed") {
        //             completedRides++
        //         }
        //     }
        //     setTotalDistance(Math.round(totalDistance / 1000))
        //     setTotalCompletedRides(completedRides)
        // }
        // const respB = await getBikes()
        // if (respB.success && respB.data) {
        //     setTotalVehicles(respB.data.length)
        //     let active = 0
        //     let onRoad = 0

        //     for (let i = 0; i < respB.data.length; i++) {
        //         if (respB.data[i]["ignition"] == "true") {
        //             onRoad++
        //         }
        //         if (respB.data[i]["status"] === "online") {
        //             active++
        //         }

        //     }
        //     setTotalActiveVeficles(active)
        //     setTotalVehicleOnRoad(onRoad)
        // }
        // const respW = await getWallet()
        // let totalEarning = 0
        // let totalValueInWallet = 0
        // if (respW.success && respW.data) {
        //     for (let i = 0; i < respW.data.length; i++) {

        //         const wallets: any[] = respW.data[i]["Wallets"]
        //         for (let j = 0; j < wallets.length; j++) {
        //             totalEarning += respW.data[i]["Wallets"][j]["usedMoney"]
        //             totalValueInWallet += respW.data[i]["Wallets"][j]["depositedMoney"]
        //         }
        //     }
        //     setTotalEarning(totalEarning + totalValueInWallet)
        //     setTotalAmountInWallet(totalValueInWallet)
        // }

    }

    return (
        <>
            <div className='card'>
                <div className='grid'>
                    <div className='col-12'>
                        <h2>Dashboard</h2>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='grid'>
                    <div className='col-9'>
                    </div>
                    <div>
                        <SelectButton width={30} optionLabel="name" options={[
                            { name: "Week", code: 7 },
                            { name: "Month", code: 30 },
                            { name: "Year", code: 365 }
                        ]}
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.value)}
                            multiple={false} />
                    </div>
                </div>
            </div>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Earning"} value={formatCurrency(totalEarning)} added={formatCurrency(totalAmountInWallet) + " deposited"} since={formatCurrency(totalEarning - totalAmountInWallet) + " used"} labels={["Amount deposited", "Amount Used"]} dataP={[totalAmountInWallet, totalEarning - totalAmountInWallet]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Distance Covered (km) "} value={totalDistance.toString()} added={""} since={""} labels={["Distance Covered"]} dataP={[totalDistance]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"CO2 Emission Avoided"} value={totalCo2Emission.toString()} added={""} since={""} labels={["CO2 Emission Avoided"]} dataP={[totalCo2Emission]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Rides"} value={totalRides.toString()} added={totalCompletedRides.toString() + " completed"} since={(totalRides - totalCompletedRides).toString() + " on going"} dataP={[totalCompletedRides, totalRides - totalCompletedRides]} labels={["Completed Rides", "Ongoing Rides"]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Users"} value={numberOfUsers.toString()} added={dlVerifiedUsers.toString() + " DL verified " + idVerifiedUsers.toString() + " ID verified"} since={unVerifiedUsers.toString() + " Unverified"} labels={["Dl Verified", "Id Verified", "UnVerified"]} dataP={[dlVerifiedUsers, idVerifiedUsers, unVerifiedUsers]} />
                </div>

                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Vehicles"} value={totalVehicles.toString()} added={totalActiveVehicles.toString() + " Available"} since={totalVehicleOnRoad.toString() + " on road"} labels={["Available", "On road", "InActive"]} dataP={[totalActiveVehicles, totalVehicleOnRoad, totalVehicles - (totalActiveVehicles + totalVehicleOnRoad)]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Stations"} value={totalStations.toString()} added={totalActiveStations.toString() + " Active"} since={totalPublicStations.toString() + " Public"} labels={["Active", "Public", "Inactive"]} dataP={[totalActiveStations, totalPublicStations, totalStations - totalActiveStations]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={"Total Chargers "} value={totalChargers.toString()} added={totalKwhCharged.toString() + " Total kWh Charged"} since={""} labels={["TotalChargers", "Total Kwh Charged"]} dataP={[totalChargers, totalKwhCharged]} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
