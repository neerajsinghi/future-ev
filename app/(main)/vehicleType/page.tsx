'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { getVehicleTypes, setVehicleType } from '@/app/api/iotBikes';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import './plan.css';
interface VehicleTypeFormData {
    name: string;
    price: number;
    description: string;
}
const VehicleTypePage = () => {
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState<VehicleTypeFormData>({
        name: '',
        price: 0,
        description: ''
    });

    const handleChange = (name: keyof VehicleTypeFormData, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        const response = await setVehicleType(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchData();
        } else {
            console.log('Failed');
        }
    };
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' }, filterField: 'id' },
        { key: 'name', label: 'Name', _props: { scope: 'col' }, filterField: 'name' },
        { key: 'description', label: 'Description', _props: { scope: 'col' }, filterField: 'description' },
        { key: 'price', label: 'Price Per Minute', _props: { scope: 'col' }, filterField: 'price' },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } }
    ];
    useEffect(() => {
        fetchData();

        return () => {
            setItems([]);
        };
    }, []);
    const fetchData = async () => {
        let response = await getVehicleTypes();
        if (response.success) {
            if (response.data) {
                console.log(response.data);
                setItems(() => response.data);
            }
        }
        setLoading1(false);
    };

    return (
        <>
            <div className="p-grid">
                <div className="p-col-12">
                    <BreadCrumb model={[{ label: 'Vehicle Type' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="p-col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: '10px' }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Vehicle Type" style={{ marginBottom: '10px' }} onClick={() => setShowDialog(true)} />
                    </div>
                </div>
                <div className="p-col-12">
                    <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                </div>
            </div>
            <Dialog header="Add Vehicle Type" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="price">Price Per Minute</label>
                        <InputNumber id="price" value={formData.price} onValueChange={(e) => handleChange('price', e.value)} mode="decimal" minFractionDigits={2} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={5} cols={30} autoResize />
                    </div>
                    <div className="field col-12"></div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default VehicleTypePage;
