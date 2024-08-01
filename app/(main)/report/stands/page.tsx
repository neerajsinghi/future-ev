'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import CustomTable from '../../components/table';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { setStation, getStations, getUsers, updateStation } from '@/app/api/iotBikes';
import Link from 'next/link';
import { Tag } from 'primereact/tag';

const Stand = () => {
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);

    const fetchData = async () => {
        const response = await getStations();
        if (response.success && response.data) {
            const response1 = await getUsers('admin');
            if (response1.success && response1.data) {
                const data = [];
                for (let i = 0; i < response1.data.length; i++) {
                    if (response1.data[i].role === 'admin' || response1.data[i].role === 'staff') {
                        data.push({ name: response1.data[i].name, code: response1.data[i].id });
                    }
                }
            }
            const data = [];
            for (let i = 0; i < response.data.length; i++) {
                let staffName = '';
                for (let j = 0; j < response1.data.length; j++) {
                    if (response1.data[j].id === response.data[i].supervisorID) {
                        staffName = response1.data[j].name;
                    }
                }

                if (!response.data[i].stock) {
                    response.data[i].stock = 0;
                }
                data.push({ ...response.data[i], ...response.data[i].address, staffName });
            }
            setItems(data);
        }
        setLoading1(false);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'shortName', label: 'Short Name', _props: { scope: 'col' } },
        { key: 'address', label: 'Address', _props: { scope: 'col' } },
        { key: 'city', label: 'City', _props: { scope: 'col' } },
        { key: 'stock', label: 'Vehicles' },
        { key: 'staffName', label: 'Staff', _props: { scope: 'col' } }
    ];

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Station' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>

                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable tableName="stands" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stand;
