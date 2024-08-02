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
import { deletePlan, getCity } from '@/app/api/services';
import useIsMobile from '@/app/api/hooks';
import { showToast } from '@/app/hooks/toast';
interface ProductFormData {
    city: string;
    vehicleType: string;
    type: string;
    price: number[];
    startingMinutes: number[];
    endingMinutes: number[];
    everyXMinutes: number;
    extensionPrice: number;
    deposit: number;
    isActive: boolean;
}

const Plan = () => {
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>({});
    const [showDialog, setShowDialog] = useState(false);
    const [vehicleType, setVehicleType] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const [selectedCity, setSelectedCity] = useState<any>({});
    const [selectedVehicleType, setSelectedVehicleType] = useState<any>({});

    const [selectedUser, setSelectedUser] = useState<any>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        type: 'hourly',
        price: [0],
        city: '',
        vehicleType: '',
        startingMinutes: [0],
        endingMinutes: [0],
        everyXMinutes: 0,
        extensionPrice: 0,
        isActive: true,
        deposit: 0
    });

    const handleChange = (name: keyof ProductFormData, value: any) => {
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
        for (let i = 0; i < formData.price.length; i++) {
            const body = {
                city: formData.city,
                vehicleType: formData.vehicleType,
                price: formData.price[i],
                startingMinutes: formData.startingMinutes[i],
                endingMinutes: formData.endingMinutes[i],
                type: formData.type
            };

            const response = await setPlan(body);
            if (response.success && response.data) {
            } else {
                console.log('Failed');
            }
        }
        if (formData.everyXMinutes > 0) {
            const body = {
                city: formData.city,
                vehicleType: formData.vehicleType,
                price: formData.extensionPrice,
                everyXMinutes: formData.everyXMinutes,
                type: formData.type
            };
            const response = await setPlan(body);
            if (response.success && response.data) {
            } else {
                console.log('Failed');
            }
        }
        if (formData.deposit > 0) {
            debugger;
            const body = {
                city: formData.city,
                vehicleType: formData.vehicleType,
                deposit: formData.deposit,
                type: formData.type
            };
            const response = await setPlan(body);
            if (response.success && response.data) {
                showToast(response.message || 'added Plan', 'success');
            } else {
                console.log('Failed');
                showToast(response.message || 'Failed To Add Plan', 'error');
            }
        }
        setShowDialog(false);
        fetchData();
    };
    const changePlanActive = async (id: string, status: boolean) => {
        const body: any = {
            isActive: status
        };
        setLoadingRows((prevState) => ({ ...prevState, [id]: true })); // Set loading state for the specific row

        const response = await updatePlan(body, id);
        if (response.success) {
            fetchData();
        }
        setLoadingRows((prevState) => ({ ...prevState, [id]: false }));
    };

    const activeTemplate = (rowData: any) => {
        const isLoading = loadingRows[rowData.id]; // Check if the specific row is loading
        if (isLoading) return <span className="pi pi-spin pi-spinner"></span>;
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
        if (options.field === 'city') {
            return <Dropdown filter value={{ name: options.value, code: options.value }} options={city} onChange={(e) => options?.editorCallback && options.editorCallback(e.target.value.code)} optionLabel="name" placeholder="Select a City" />;
        } else if (options.field === 'vehicleType') {
            return (
                <Dropdown
                    filter
                    value={{ name: options.value, code: options.value }}
                    options={vehicleType}
                    onChange={(e) => options?.editorCallback && options.editorCallback(e.target.value.code)}
                    optionLabel="name"
                    placeholder="Select a Vehicle Type"
                />
            );
        }
    };
    const cellNumberEditor = (options: ColumnEditorOptions) => {
        return <InputNumber value={options.value} onValueChange={(e: any) => options?.editorCallback && options.editorCallback(e.value)} mode="currency" currency="INR" locale="en-IN" onKeyDown={(e) => e.stopPropagation()} />;
    };
    const cellMinEditor = (options: ColumnEditorOptions) => {
        return <InputNumber value={options.value} onValueChange={(e: any) => options?.editorCallback && options.editorCallback(e.value)} suffix=" min" onKeyDown={(e) => e.stopPropagation()} />;
    };
    const textEditor = (options: ColumnEditorOptions) => {};
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
        { key: 'city', label: 'City', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'vehicleType', label: 'Vehicle type', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'startingMinutes', label: 'Starting Minutes', _props: { scope: 'col' }, cellEditor: cellMinEditor, onCellEditComplete: onCellEditComplete },
        { key: 'endingMinutes', label: 'To', _props: { scope: 'col' }, cellEditor: cellMinEditor, onCellEditComplete: onCellEditComplete },
        { key: 'everyXMinutes', label: 'Extension', _props: { scope: 'col' }, cellEditor: cellMinEditor, onCellEditComplete: onCellEditComplete },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'deposit', label: 'Refundable Deposit', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'isActive', label: 'Active', _props: { scope: 'col' }, body: activeTemplate },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } },
        {
            key: 'action',
            label: 'Action',
            _props: { scope: 'col' },
            body: (rowData: any) => {
                return (
                    <Button
                        type="button"
                        icon="pi pi-trash"
                        onClick={() => {
                            setSelectedUser(rowData.id);
                            setShowDeleteDialog(true);
                        }}
                    ></Button>
                );
            }
        }
    ];

    useEffect(() => {
        fetchData();
        getCityD();
        getVehicleTypesD();
        return () => {
            setItems([]);
        };
    }, []);
    const fetchData = async () => {
        let response = await getPlans('hourly');
        if (response.success) {
            if (response.data) {
                setItems(() => response.data);
            }
        }
        setLoading1(false);
    };
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
    const deletePlanD = async () => {
        debugger;
        const response = await deletePlan(selectedUser);
        if (response.success) {
            fetchData();
            setShowDeleteDialog(false);
        }
    };
    const isMobile = useIsMobile();
    return (
        <>
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
                        <CustomTable tableName="" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            <Dialog header="Add Plan" className="desktop-dialog" visible={showDialog} onHide={() => setShowDialog(false)}>
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="name">City</label>
                        <Dropdown filter value={selectedCity} options={city} onChange={(e) => handleChange('city', e.value)} optionLabel="name" placeholder="Select a City" />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="description">Vehicle Type</label>
                        <Dropdown filter value={selectedVehicleType} options={vehicleType} onChange={(e) => handleChange('vehicleType', e.value)} optionLabel="name" placeholder="Select a Vehicle Type" />
                    </div>
                    <div className="field col-12">
                        {formData.price.map((price, index) => {
                            return (
                                <>
                                    <div className="field col-12 lg:col-12" key={index + Math.random()}>
                                        <div className="grid justify-content-center align-content-center align-items-center">
                                            <div className="col-3 align-item-center space-y-3">
                                                <label htmlFor="price">From</label>

                                                <InputNumber
                                                    value={formData.startingMinutes[index]}
                                                    onValueChange={(e: InputNumberValueChangeEvent) => {
                                                        e.stopPropagation();
                                                        const newPrice: any[] = [...formData.startingMinutes];
                                                        newPrice[index] = e.value;
                                                        setFormData({ ...formData, startingMinutes: newPrice });
                                                    }}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    suffix=" min"
                                                />
                                            </div>
                                            <div className="col-3 align-item-center">
                                                <label htmlFor="price">To</label>
                                                <InputNumber
                                                    value={formData.endingMinutes[index]}
                                                    onValueChange={(e: InputNumberValueChangeEvent) => {
                                                        e.stopPropagation();
                                                        const newPrice: any[] = [...formData.endingMinutes];
                                                        newPrice[index] = e.value;
                                                        setFormData({ ...formData, endingMinutes: newPrice });
                                                    }}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    suffix=" min"
                                                />
                                            </div>
                                            <div className="col-3 align-item-center">
                                                <label htmlFor="price">Price</label>
                                                <InputNumber
                                                    value={formData.price[index]}
                                                    onValueChange={(e: InputNumberValueChangeEvent) => {
                                                        e.stopPropagation();
                                                        const newPrice: any[] = [...formData.price];
                                                        newPrice[index] = e.value;
                                                        setFormData({ ...formData, price: newPrice });
                                                    }}
                                                    mode="currency"
                                                    currency="INR"
                                                    locale="en-IN"
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            {index == 0 && (
                                                <div className="col-3 align-item-center">
                                                    <Button
                                                        icon="pi pi-plus"
                                                        text
                                                        onClick={() => {
                                                            const newPrice: any[] = [...formData.price];
                                                            newPrice.push(0);
                                                            setFormData({ ...formData, price: newPrice, startingMinutes: [...formData.startingMinutes, 0], endingMinutes: [...formData.endingMinutes, 0] });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="col-3 align-item-center">
                                                {index > 0 && (
                                                    <Button
                                                        icon="pi pi-minus"
                                                        text
                                                        onClick={() => {
                                                            const newPrice: any[] = [...formData.price];
                                                            newPrice.pop();
                                                            setFormData({ ...formData, price: newPrice, startingMinutes: formData.startingMinutes.slice(0, -1), endingMinutes: formData.endingMinutes.slice(0, -1) });
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <div className="field col-12 lg:col-12">
                        <div className="flex gap-3 align-content-center align-item-center">
                            <div className="w-full align-item-center">
                                <label htmlFor="validity">Extension</label>
                                <InputNumber value={formData.everyXMinutes} onValueChange={(e: InputNumberValueChangeEvent) => handleChange('everyXMinutes', e.value)} suffix=" min" />
                            </div>
                            <div className="w-full align-item-center">
                                <label htmlFor="validity" style={{ whiteSpace: 'nowrap' }}>
                                    Extension Price
                                </label>
                                <InputNumber value={formData.extensionPrice} onValueChange={(e: InputNumberValueChangeEvent) => handleChange('extensionPrice', e.value)} mode="currency" currency="INR" locale="en-IN" />
                            </div>
                            <div className="w-full align-item-center">
                                <label htmlFor="validity">Refundable Deposit</label>
                                <InputNumber value={formData.deposit} onValueChange={(e: InputNumberValueChangeEvent) => handleChange('deposit', e.value)} mode="currency" currency="INR" locale="en-IN" />
                            </div>
                        </div>
                    </div>

                    <div className="field justify-content-center col-12 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
            {showDeleteDialog && (
                <Dialog header="Delete Plan" visible={showDeleteDialog} style={{ width: '50vw' }} onHide={() => setShowDeleteDialog(false)}>
                    <div className="grid">
                        <div className="col-12">
                            <h2>Are you sure you want to delete this Plan?</h2>
                        </div>
                        <div className="col-12">
                            <Button
                                label="Yes"
                                onClick={() => {
                                    deletePlanD();
                                }}
                            />
                            <Button
                                label="No"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                }}
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default Plan;
