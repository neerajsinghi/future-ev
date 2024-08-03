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
import './plan.css';
import { Calendar } from 'primereact/calendar';

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
    const [date, setDate] = useState<any>('');
    const [cities, setCities] = useState<cityType[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>({});
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
    const clearAll = () => {
        setNumberOfUsers(0);
        setIdVerifiedUsers(0);
        setDlVerifiedUsers(0);
        setTotalStations(0);
        setTotalPublicStations(0);
        setTotalActiveStation(0);
        setTotalCo2Emission(0);
        setTotalChargers(0);
        setTotalRides(0);
        setTotalDistance(0);
        setTotalCompletedRides(0);
        setTotalVehicles(0);
        setTotalActiveVeficles(0);
        setTotalVehicleOnRoad(0);
        setTotalEarning(0);
        setTotalAmountInWallet(0);
    };

    const fetchData = async () => {
        clearAll();

        const calculateDateRange = (code: number) => {
            let startDate = new Date();
            let endDate = new Date();

            switch (code) {
                case 1:
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case 2:
                    endDate.setDate(endDate.getDate() - 1);
                    startDate.setDate(startDate.getDate() - 2);
                    break;
                case 7:
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 30:
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                case 365:
                    startDate.setDate(startDate.getDate() - 365);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 1);
                    break;
            }

            return { startDate, endDate };
        };

        const parseData = (data: any) => {
            return data.reduce((result: any, item: any) => {
                const key = item.Key === 'totalActiveVeficles' ? 'totalActiveVehicles' : item.Key;
                result[key] = Array.isArray(item.Value) && item.Value.length === 0 ? 0 : item.Value;
                return result;
            }, {});
        };

        const updateState = (parsedData: any) => {
            setNumberOfUsers(parsedData.numberOfUsers);
            setIdVerifiedUsers(parsedData.idVerified || 0);
            setDlVerifiedUsers(parsedData.dlVerified || 0);
            setUnVerifiedUsers(parsedData.unVerified || numberOfUsers - parsedData.idVerified);
            setTotalStations(parsedData.totalStations || 0);
            setTotalPublicStations(parsedData.totalPublicStations || 0);
            setTotalActiveStation(parsedData.totalActiveStation || 0);
            setTotalCo2Emission(parsedData.totalCo2Emission || 0);
            setTotalChargers(parsedData.totalChargers || 0);
            setTotalRides(parsedData.totalRides || 0);
            setTotalDistance(parsedData.totalDistance || 0);
            setTotalCompletedRides(parsedData.totalCompletedRides || 0);
            setTotalVehicles(parsedData.totalVehicles || 0);
            setTotalActiveVeficles(parsedData.totalActiveVehicles || 0);
            setTotalVehicleOnRoad(parsedData.totalVehicleOnRoad || 0);
            setTotalEarning(parsedData.totalEarning || 0);
            setTotalAmountInWallet(parsedData.totalValueInWallet || 0);
        };

        try {
            const { startDate, endDate } = calculateDateRange(selectedTime.code);
            let response;

            if (selectedCity && date) {
                response = await getStatistics(date[0], date[1], selectedCity.name);
            } else if (selectedCity) {
                response = await getStatistics(startDate, endDate, selectedCity.name);
            } else if (date) {
                response = await getStatistics(date[0], date[1]);
            } else {
                response = await getStatistics(startDate, endDate);
            }

            if (response.success && response.data) {
                const parsedData = parseData(response.data[0]);
                updateState(parsedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error (e.g., show a toast notification)
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
        fetchData();
    }, [selectedTime, selectedCity, date]);

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
                <div className="dashboard-panel">
                    <div className="flex gap-2">
                        <Dropdown
                            filter
                            placeholder="Select City"
                            optionLabel="name"
                            optionValue="id"
                            options={cities}
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.value);
                            }}
                        />
                        <Calendar placeholder="Start Date - End Date" value={date} onChange={(e) => setDate(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection />
                    </div>
                    {/* <div className="buttons"> */}
                    <SelectButton
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
                    {/* </div> */}
                </div>
            </div>
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
                    <FlippingCard title={'Total Distance Covered (km) '} value={totalDistance?.toString()} added={''} since={''} labels={['Distance Covered']} dataP={[totalDistance]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard title={'CO2 Emission Avoided'} value={totalCo2Emission?.toString()} added={''} since={''} labels={['CO2 Emission Avoided']} dataP={[totalCo2Emission]} />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Rides'}
                        value={totalRides?.toString()}
                        added={totalCompletedRides?.toString() + ' completed'}
                        since={(totalRides - totalCompletedRides)?.toString() + ' on going'}
                        dataP={[totalCompletedRides, totalRides - totalCompletedRides]}
                        labels={['Completed Rides', 'Ongoing Rides']}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Users'}
                        value={numberOfUsers?.toString()}
                        added={dlVerifiedUsers?.toString() + ' DL verified ' + idVerifiedUsers?.toString() + ' ID verified'}
                        since={unVerifiedUsers?.toString() + ' Unverified'}
                        labels={['Dl Verified', 'Id Verified', 'UnVerified']}
                        dataP={[dlVerifiedUsers, idVerifiedUsers, unVerifiedUsers]}
                    />
                </div>

                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Vehicles'}
                        value={totalVehicles?.toString()}
                        added={totalActiveVehicles?.toString() + ' Available'}
                        since={totalVehicleOnRoad?.toString() + ' on road'}
                        labels={['Available', 'On road', 'InActive']}
                        dataP={[totalActiveVehicles, totalVehicleOnRoad, totalVehicles - (totalActiveVehicles + totalVehicleOnRoad)]}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Stations'}
                        value={totalStations?.toString()}
                        added={totalActiveStations?.toString() + ' Active'}
                        since={totalPublicStations?.toString() + ' Public'}
                        labels={['Active', 'Public', 'Inactive']}
                        dataP={[totalActiveStations, totalPublicStations, totalStations - totalActiveStations]}
                    />
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <FlippingCard
                        title={'Total Chargers '}
                        value={totalChargers?.toString()}
                        added={totalKwhCharged?.toString() + ' Total kWh Charged'}
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
