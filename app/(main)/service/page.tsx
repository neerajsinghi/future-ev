'use client';

import { createService, getServices } from '@/app/api/iotBikes';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import useIsAccessible from '@/app/hooks/isAccessible';

// id
// name
// description
// price
// active
// discount
// status

interface ServiceProps {
    name: string;
    description: string;
    price: number;
    active: boolean;
    discount: number;
    status: string;
    type: string;
}
const Service = () => {
    /*
    id
name
description
price
active
discount
status
    */
    const isAccessible = useIsAccessible('service');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<any>(null);
    const [formData, setFormData] = useState<ServiceProps>({
        name: '',
        description: '',
        price: 0,
        active: true,
        discount: 0,
        status: '',
        type: ''
    });
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'description', label: 'Description', _props: { scope: 'col' } },
        { key: 'price', label: 'Price', _props: { scope: 'col' } },
        { key: 'active', label: 'Active', _props: { scope: 'col' } },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' } },
        { key: 'type', label: 'Type', _props: { scope: 'col' } },
        { key: 'status', label: 'Status', _props: { scope: 'col' } }
    ];
    const getServicesL = async () => {
        const response = await getServices();
        if (response.success && response.data) {
            setItems(response.data);
        }
        setLoading(false);
    };
    useEffect(() => {
        getServicesL();
    }, []);
    const handleChange = (name: keyof ServiceProps, value: any) => {
        if (name === 'status') {
            setSelectedStatus(value);

            setFormData({ ...formData, [name]: value.code });
        } else if (name === 'type') {
            setSelectedType(value);
            setFormData({
                ...formData,
                [name]: value.code
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createService(formData);
        if (response.success) {
            setShowDialog(false);
        }
        getServices();
    };
    return (
        <>
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {(isAccessible === 'Edit' || isAccessible === 'View') && (
                <div className="grid">
                    <div className="col-12 md:col-12">
                        <BreadCrumb model={[{ label: 'Service' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                    </div>
                    <div className="col-12 md:col-12">
                        <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                            <Button type="button" icon="pi pi-plus-circle" label="Service" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                        </div>
                    </div>
                    <div className="col-12 md:col-12 m-10">
                        <div className="card">
                            <CustomTable tableName="services" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />{' '}
                        </div>
                    </div>
                </div>
            )}
            {isAccessible === 'Edit' && (
                <Dialog
                    header="Bikes Stationed"
                    visible={showDialog}
                    style={{ width: '50vw' }}
                    modal
                    onHide={() => {
                        setShowDialog(false);
                    }}
                >
                    <form onSubmit={handleSave} className="p-fluid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Name</label>
                            <InputText type="text" id="name" name="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="description">Description</label>
                            <InputText type="text" id="description" name="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="price">Price</label>
                            <InputNumber type="text" id="price" name="price" value={formData.price} onChange={(e) => handleChange('price', e.value)} mode="decimal" minFractionDigits={2} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="discount">Discount</label>
                            <InputNumber type="text" id="discount" name="discount" value={formData.discount} onChange={(e) => handleChange('discount', e.value)} mode="decimal" minFractionDigits={2} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                filter
                                id="Status"
                                options={[
                                    { name: 'Active', code: 'Active' },
                                    { name: 'Inactive', code: 'Inactive' }
                                ]}
                                value={selectedStatus}
                                onChange={(e) => handleChange('status', e.value)}
                                optionLabel="name"
                                placeholder="Select a Status"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="type">Type</label>
                            <Dropdown
                                filter
                                id="type"
                                options={[
                                    { name: 'eCar', code: 'eCar' },
                                    { name: 'charging', code: 'charging' },
                                    { name: 'plan', code: 'plan' },
                                    { name: 'hourly', code: 'hourly' }
                                ]}
                                value={selectedType}
                                onChange={(e) => handleChange('type', e.value)}
                                optionLabel="name"
                                placeholder="Select a Type"
                            />
                        </div>

                        <div className="field col-2 button-row">
                            <Button label="Submit" type="submit" />
                        </div>
                    </form>
                </Dialog>
            )}
        </>
    );
};

export default Service;
