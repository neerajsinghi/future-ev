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
import { getCity } from '@/app/api/services';
import { Dropdown } from 'primereact/dropdown';

type cityType = {
    id: string;
    name: string;
    active: boolean;
    numberOfStations: null | undefined;
    numberOfVehicles: null | undefined;
    locationPolygon: {
        type: string;
        coordinates: [number, number][][] | [number, number][][][];
    };
};

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
    const [totalVehicleOnRoad, setTotalVehicleOnRoad] = useState<number>(0);
    const [totalStations, setTotalStations] = useState<number>(0);
    const [totalActiveStations, setTotalActiveStation] = useState<number>(0);
    const [totalPublicStations, setTotalPublicStations] = useState<number>(0);
    const [totalChargers, setTotalChargers] = useState<number>(0);
    const [totalKwhCharged, setTotalKwhCharged] = useState<number>(0);
    const [selectedTime, setSelectedTime] = useState<any>({ name: 'Week', code: 7 });
    const [cities, setCities] = useState<cityType[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        const resp = await getStatistics(selectedTime.code);

        if (resp.success && resp.data) {
            setNumberOfUsers(resp.data[0][0]?.Value ? resp.data[0][0]?.Value : 0);
            setIdVerifiedUsers(resp.data[0][1]?.Value ? resp.data[0][1]?.Value : 0);
            setDlVerifiedUsers(resp.data[0][2]?.Value ? resp.data[0][2]?.Value : 0);
            setTotalStations(resp.data[0][3]?.Value[0] ? resp.data[0][3]?.Value[0] : 0);
            setTotalPublicStations(resp.data[0][4]?.Value[0] ? resp.data[0][4].Value[0] : 0);
            setTotalActiveStation(resp.data[0][5]?.Value[0] ? resp.data[0][5]?.Value[0] : 0);
            setTotalCo2Emission(resp.data[0][6]?.Value[0] ? resp.data[0][6]?.Value[0] : 0);
            setTotalChargers(resp.data[0][7]?.Value ? resp.data[0][7]?.Value : 0);
            setTotalRides(resp.data[0][8]?.Value[0] ? resp.data[0][8]?.Value[0] : 0);
            setTotalDistance(resp.data[0][9]?.Value[0] ? resp.data[0][9]?.Value[0] : 0);
            setTotalCompletedRides(resp.data[0][10]?.Value[0] ? resp.data[0][10]?.Value[0] : 0);
            setTotalVehicles(resp.data[0][11]?.Value[0] ? resp.data[0][11]?.Value[0] : 0);
            setTotalActiveVeficles(resp.data[0][12]?.Value[0] ? resp.data[0][12]?.Value[0] : 0);
            setTotalVehicleOnRoad(resp.data[0][13]?.Value[0] ? resp.data[0][13].Value[0] : 0);
            setTotalEarning(resp.data[0][14]?.Value ? resp.data[0][14]?.Value : 0);
            setTotalAmountInWallet(resp.data[0][15]?.Value ? resp.data[0][15]?.Value : 0);
        }

    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getCity();
                if (response.success && response.data) {
                    setCities(response.data);
                }
            } catch (error) {
                console.error('Error fetching city data:', error);
            }
        };

        fetchCities();
    }, []);
    useEffect(() => {
        debugger
        fetchData();
    }, [selectedTime]);

    return (
        <>
            <div className="">
                <div className="grid">
                    <div className="col-12">
                        <h2>Dashboard</h2>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="grid  align-items-center">
                    <div className='col-12 md:col-1  align-items-center' style={{ marginRight: "30px" }}>

                        <Dropdown
                            placeholder="Select City"
                            optionLabel="name"
                            optionValue="id"
                            options={cities}
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.value);
                            }}
                        />
                    </div>
                    <div className='col-12 md:col-2  align-items-center'>
                        {/* <Dropdown
                            placeholder="Select Service"
                            optionLabel="name"
                            optionValue="id"
                            options={cities}
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.value);
                            }}
                        /> */}
                    </div>
                    <div className='col-12 md:col-4' />
                    <div className='col-12 md:col-4'>
                        <SelectButton
                            style={{ border: '2px solid white' }}
                            width={30}
                            className="flex"
                            optionLabel="name"
                            options={[
                                { name: 'Yesterday', code: 2 },
                                { name: 'Today', code: 1 },
                                { name: 'Week', code: 7 },
                                { name: '15 Days', code: 7 },
                                { name: 'Month', code: 30 },
                                { name: 'Year', code: 365 }
                            ]}
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.value)}
                            multiple={false}
                        />
                    </div>
                </div>
            </div >
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Earning'}
                        value={formatCurrency(totalEarning)}
                        added={formatCurrency(totalAmountInWallet) + ' deposited'}
                        since={formatCurrency(totalEarning - totalAmountInWallet) + ' used'}
                        labels={['Amount deposited', 'Amount Used']}
                        dataP={[totalAmountInWallet, totalEarning - totalAmountInWallet]}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={'Total Distance Covered (km) '} value={totalDistance.toString()} added={''} since={''} labels={['Distance Covered']} dataP={[totalDistance]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={'CO2 Emission Avoided'} value={totalCo2Emission.toString()} added={''} since={''} labels={['CO2 Emission Avoided']} dataP={[totalCo2Emission]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Rides'}
                        value={totalRides.toString()}
                        added={totalCompletedRides.toString() + ' completed'}
                        since={(totalRides - totalCompletedRides).toString() + ' on going'}
                        dataP={[totalCompletedRides, totalRides - totalCompletedRides]}
                        labels={['Completed Rides', 'Ongoing Rides']}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Users'}
                        value={numberOfUsers.toString()}
                        added={dlVerifiedUsers.toString() + ' DL verified ' + idVerifiedUsers.toString() + ' ID verified'}
                        since={unVerifiedUsers.toString() + ' Unverified'}
                        labels={['Dl Verified', 'Id Verified', 'UnVerified']}
                        dataP={[dlVerifiedUsers, idVerifiedUsers, unVerifiedUsers]}
                    />
                </div>

                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Vehicles'}
                        value={totalVehicles.toString()}
                        added={totalActiveVehicles.toString() + ' Available'}
                        since={totalVehicleOnRoad.toString() + ' on road'}
                        labels={['Available', 'On road', 'InActive']}
                        dataP={[totalActiveVehicles, totalVehicleOnRoad, totalVehicles - (totalActiveVehicles + totalVehicleOnRoad)]}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Stations'}
                        value={totalStations.toString()}
                        added={totalActiveStations.toString() + ' Active'}
                        since={totalPublicStations.toString() + ' Public'}
                        labels={['Active', 'Public', 'Inactive']}
                        dataP={[totalActiveStations, totalPublicStations, totalStations - totalActiveStations]}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Chargers '}
                        value={totalChargers.toString()}
                        added={totalKwhCharged.toString() + ' Total kWh Charged'}
                        since={''}
                        labels={['TotalChargers', 'Total Kwh Charged']}
                        dataP={[totalChargers, totalKwhCharged]}
                    />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
