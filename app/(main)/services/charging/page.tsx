'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../../components/table';
import { getPlans, getVehicleTypes, setPlan, updatePlan } from '@/app/api/iotBikes';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import './plan.css';
import { ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { getCity } from '@/app/api/services';
import useIsAccessible from '@/app/hooks/isAccessible';
interface ProductFormData {
    city: string;
    chargerType: string;
    vehicleType: string;
    type: string;
    price: number;
    isActive: boolean;
}

const Plan = () => {
    const isAccessible = useIsAccessible('services');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [vehicleType, setVehicleType] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const [selectedCity, setSelectedCity] = useState<any>({});
    const [selectedVehicleType, setSelectedVehicleType] = useState<any>({});

    const [formData, setFormData] = useState<ProductFormData>({
        city: '',
        chargerType: '',
        vehicleType: '',
        type: 'charging',
        price: 0,
        isActive: true
    });

    const handleChange = (name: keyof ProductFormData, value: any) => {
        debugger;
        if (name === 'city') {
            setSelectedCity(value);
            value = value.code;
        }
        if (name === 'vehicleType') {
            setSelectedVehicleType(value);
            value = value.code;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        const response = await setPlan(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchData();
        } else {
            console.log('Failed');
        }
    };
    const changePlanActive = async (id: string, status: boolean) => {
        const body: any = {
            isActive: status
        };
        const response = await updatePlan(body, id);
        if (response.success) {
            fetchData();
        }
    };

    const activeTemplate = (rowData: any) => {
        return (
            <InputSwitch
                checked={rowData.isActive}
                onClick={() => {
                    changePlanActive(rowData.id, !rowData.isActive);
                }}
            />
        );
    };
    const cellEditor = (options: ColumnEditorOptions) => {
        return textEditor(options);
    };
    const cellNumberEditor = (options: ColumnEditorOptions) => {
        return <InputNumber value={options.value} onValueChange={(e: any) => options?.editorCallback && options.editorCallback(e.value)} mode="currency" currency="INR" locale="en-IN" onKeyDown={(e) => e.stopPropagation()} />;
    };
    const textEditor = (options: ColumnEditorOptions) => {
        return <InputText type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options?.editorCallback && options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };
    const onCellEditComplete = async (e: ColumnEvent) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        const body = {
            [field]: newValue
        };
        const response = await updatePlan(body, rowData.id);
        if (response.success) {
            fetchData();
        }
    };

    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'city', label: 'City', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'chargerType', label: 'Charger Type', _props: { scope: 'col' } },
        { key: 'vehicleType', label: 'Vehicle Type', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } }
    ];

    useEffect(() => {
        fetchData();
        getCityD();
        getVehicleTypesD();
        return () => {
            setItems([]);
        };
    }, []);
    const getCityD = async () => {
        let response = await getCity();
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ name: response.data[i].name, code: response.data[i].name });
                }
                setCity(() => data);
            }
        }
    };
    const getVehicleTypesD = async () => {
        let response = await getVehicleTypes();
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ name: response.data[i].name, code: response.data[i].name });
                }
                setVehicleType(() => data);
            }
        }
    };
    const fetchData = async () => {
        let response = await getPlans('charging');
        if (response.success) {
            if (response.data) {
                setItems(() => response.data);
            }
        }
        setLoading1(false);
    };

    return (
        <>
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {(isAccessible === 'Edit' || isAccessible === 'View') && (
                <div className="grid">
                    <div className="col-12">
                        <BreadCrumb model={[{ label: 'Plan' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                    </div>
                    <div className="col-12">
                        <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                            <Button type="button" icon="pi pi-plus-circle" label="Plan" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                        </div>
                    </div>
                    <div className="col-12 m-10">
                        <div className="card">
                            <CustomTable tableName="chargings" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                        </div>
                    </div>
                </div>
            )}

            {isAccessible === 'Edit' && (
                <Dialog header="Add Plan" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="p-fluid grid">
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="name">City</label>
                                <Dropdown value={selectedCity} options={city} onChange={(e) => handleChange('city', e.value)} optionLabel="name" placeholder="Select a City" />
                            </div>

                            <div className="field col-12 lg:col-6">
                                <label htmlFor="description">Vehicle Type</label>
                                <Dropdown value={selectedVehicleType} options={vehicleType} onChange={(e) => handleChange('vehicleType', e.value)} optionLabel="name" placeholder="Select a Vehicle Type" />
                            </div>
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="name">Charger Type</label>
                                <InputText id="name" value={formData.chargerType} onChange={(e) => handleChange('chargerType', e.target.value)} />
                            </div>
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="type">Price Per minute</label>
                                <InputNumber value={formData.price} onValueChange={(e: InputNumberValueChangeEvent) => handleChange('price', e.value)} mode="currency" currency="INR" locale="en-IN" />
                            </div>

                            <div className="field col-12"></div>
                            <div className="field col-2 button-row">
                                <Button label="Submit" type="submit" />
                            </div>
                        </form>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default Plan;
