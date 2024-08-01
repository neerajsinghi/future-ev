'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import './plan.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { getChargers } from '@/app/api/iotBikes';

interface ChargerFormData {
    name: string;
    description: string;
    shortName: string;
    address: Address;
    location: Location;
    active: boolean;
    group: string;
    supervisorID: string;
    stock: number;
    public: boolean;
    status: string;
}
interface Address {
    address: string;
    country: string;
    pin: string;
    city: string;
    state: string;
}
interface Location {
    type: string;
    coordinates: number[]; // [longitude, latitude]
}
const Chargers = () => {
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<ChargerFormData>({
        name: '',
        description: '',
        shortName: '',
        address: {
            address: '',
            country: '',
            pin: '',
            city: '',
            state: ''
        },
        location: {
            type: '',
            coordinates: [0, 0]
        },
        active: true,
        group: '',
        supervisorID: '',
        stock: 0,
        public: true,
        status: ''
    });

    const handleChange = (name: string, value: any) => {
        if (name.startsWith('address.')) {
            setFormData({
                ...formData,
                address: { ...formData.address, [name.substring(8)]: value }
            });
        } else if (name.startsWith('location.')) {
            setFormData({
                ...formData,
                location: { ...formData.location, [name.substring(9)]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        // const response = await setCharger(formData)
        // if (response.success && response.data) {
        //     setShowDialog(false)
        //     fetchData()
        // } else {
        //     console.log('Failed')
        // }
    };
    const fetchData = async () => {
        const response = await getChargers();
        if (response.success && response.data) {
            setItems(response.data);
        }
        setLoading1(false);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const statusAddressTemplate = (rowData: any) => {
        return <div>{rowData.address.address}</div>;
    };
    const statusCityTemplate = (rowData: any) => {
        return <div>{rowData.address.city}</div>;
    };
    const statusLongTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[0]}</div>;
    };
    const statusLatTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[1]}</div>;
    };
    const statusStockTemplate = (rowData: any) => {
        return <div>{rowData.stock ? rowData.stock : 0}</div>;
    };
    const columns = [
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'shortName', label: 'Short Name', _props: { scope: 'col' } },
        { key: 'address', label: 'Address', _props: { scope: 'col' }, body: statusAddressTemplate },
        { key: 'city', label: 'City', _props: { scope: 'col' }, body: statusCityTemplate },
        { key: 'long', label: 'Longitude', _props: { scope: 'col' }, body: statusLongTemplate },
        { key: 'lat', label: 'Latitude', _props: { scope: 'col' }, body: statusLatTemplate },
        { key: 'active', label: 'Active', _props: { scope: 'col' } },
        { key: 'group', label: 'Group', _props: { scope: 'col' } },
        { key: 'supervisorID', label: 'Supervisor ID', _props: { scope: 'col' } },
        { key: 'stock', label: 'Stock', _props: { scope: 'col' }, body: statusStockTemplate },
        { key: 'public', label: 'Public', _props: { scope: 'col' } },
        { key: 'status', label: 'Status', _props: { scope: 'col' } }
    ];

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Charger' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Charger" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                    </div>
                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable tableName="chargers" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            <Dialog header="Add Charger" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                <form onSubmit={handleSubmit} className="p-fluid form-grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="shortName">Short Name</label>
                        <InputText id="shortName" value={formData.shortName} onChange={(e) => handleChange('shortName', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                    </div>

                    {/* Address Fields */}
                    <div className="field col-12"></div>
                    <div className="field col-12">
                        <h4>Address</h4>
                    </div>
                    <div className="field col-12"></div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.address">Address Line</label>
                        <InputTextarea id="address.address" value={formData.address.address} onChange={(e) => handleChange('address.address', e.target.value)} />
                    </div>
                    {/* ... (other address fields - country, pin, city, state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.country">Country</label>
                        <InputText id="address.country" value={formData.address.country} onChange={(e) => handleChange('address.country', e.target.value)} />
                    </div>
                    {/* ... (other address fields - pin, city, state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.pin">Pin</label>
                        <InputText id="address.pin" value={formData.address.pin} onChange={(e) => handleChange('address.pin', e.target.value)} />
                    </div>
                    {/* ... (other address fields - city, state) */}
                    <div className="field col-12 md:6">
                        <label htmlFor="address.city">City</label>
                        <InputText id="address.city" value={formData.address.city} onChange={(e) => handleChange('address.city', e.target.value)} />
                    </div>
                    {/* ... (other address fields - state) */}
                    <div className="field col-12 md-6">
                        <label htmlFor="address.state">State</label>
                        <InputText id="address.state" value={formData.address.state} onChange={(e) => handleChange('address.state', e.target.value)} />
                    </div>

                    {/* Location Fields */}
                    <div className="field col-12"></div>

                    <div className="field col-12">
                        <h4>Location</h4>
                    </div>
                    <div className="field col-12"></div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="location.type">Type</label>
                        <Dropdown id="location.type" value={formData.location.type} options={['Point']} onChange={(e) => handleChange('location.type', e.value)} />
                    </div>
                    {/* ... (fields for coordinates, other fields for group, supervisorID, stock, public, status) */}
                    <div className="field col-12 md-6">
                        <label htmlFor="location.coordinates[0]">Longitude</label>
                        <InputNumber id="location.coordinates[0]" value={formData.location.coordinates[0]} onChange={(e) => handleChange('location.coordinates[0]', e.value)} mode="decimal" maxFractionDigits={20} />
                    </div>
                    <div className="field col-12 md-6">
                        <label htmlFor="location.coordinates[1]">Latitude</label>
                        <InputNumber id="location.coordinates[1]" value={formData.location.coordinates[1]} onChange={(e) => handleChange('location.coordinates[1]', e.value)} mode="decimal" maxFractionDigits={20} />
                    </div>

                    {/* ... (fields for group, supervisorID, stock, public, status) */}
                    <div className="field col-12 md-6">
                        <label htmlFor="group">Group</label>
                        <InputText id="group" value={formData.group} onChange={(e) => handleChange('group', e.target.value)} />
                    </div>
                    {/* ... (fields for supervisorID, stock, public, status) */}
                    <div className="field col-12 md-6">
                        <label htmlFor="supervisorID">Supervisor ID</label>
                        <InputText id="supervisorID" value={formData.supervisorID} onChange={(e) => handleChange('supervisorID', e.target.value)} />
                    </div>
                    {/* ... (fields for status) */}
                    <div className="field col-12 md-6">
                        <label htmlFor="status">Status</label>
                        <InputText id="status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)} />
                    </div>
                    {/* ... (submit button) */}
                    <div className="field col-12"></div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default Chargers;
