'use client';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../../../../layout/context/layoutcontext';
import { ChartDataState, ChartOptionsState, Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';

const FlippingCard = ({ title, value, added, since, labels, dataP }: { title: string, value: string, added: string, since: string, labels: string[], dataP: number[] }) => {
    const { layoutConfig } = useContext(LayoutContext);

    const [flipEarnings, setFlipEarnings] = useState<boolean>(false);
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [data, setChartData] = useState<ChartDataState>({});


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';

        const pieData: ChartData = {
            labels: labels,
            datasets: [
                {
                    data: dataP,
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500') || '#6366f1', documentStyle.getPropertyValue('--purple-500') || '#a855f7', documentStyle.getPropertyValue('--teal-500') || '#14b8a6'],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7']
                }
            ]
        };

        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        }
        setOptions({
            pieOptions,
        });
        setChartData({
            pieData,
        });
    }, [dataP, labels]);

    return (<>
        {!flipEarnings ? <div className="card mb-0 " onClick={() => setFlipEarnings((prev) => !prev)} style={{ height: "350px" }} >
            <div className='flex flex-column align-content-evenly justify-content-between	'>
                <div className="flex justify-content-between align-items-center  mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>

                    </div>
                </div>
                <div className="flex justify-content-center align-items-between  mb-3" style={{ marginTop: "100px" }}>

                    <div className="text-900 font-medium text-xl">{value} </div>
                </div>
                <div className="flex align-items-between  justify-content-between mb-3" style={{ marginTop: "100px" }}>

                    <span className="text-green-500 font-medium">{added}  </span>
                    <span className="text-red-500">{since}</span>
                </div>
            </div>
        </div> : <div className="card mb-0" onClick={() => setFlipEarnings((prev) => !prev)} style={{ height: "350px" }}>
            <Chart type="pie" data={data.pieData} options={options.pieOptions} height='200'></Chart>
        </div>}
    </>);
}
export default FlippingCard;