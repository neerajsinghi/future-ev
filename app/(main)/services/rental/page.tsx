'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ChangeEvent, createRef, MutableRefObject, Ref, RefObject, use, useEffect, useRef, useState } from 'react';
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
import RentalPlanForm from '../component/rentalPlan';
import useIsAccessible from '@/app/hooks/isAccessible';
import { showToast } from '@/app/hooks/toast';
import { formatTimestamp } from '@/app/hooks/formatTimeString';
interface ProductFormData {
    city: string;
    vehicleType: string;
    name: string[];
    description: string[];
    price: number[];
    validity: number[];
    type: string;
    isActive: boolean;
}

interface Plan {
    id: string;
    name: string;
    city: string;
    vehicleType: string;
    chargerType: string;
    type: string;
    description: string;
    startingMinutes: number;
    endingMinutes: number;
    everyXMinutes: number;
    price: number;
    deposit: number | null;
    validity: string;
    discount: number;
    isActive: boolean;
    status: string;
    createdTime: string;
}

interface ApiResponse {
    success: boolean;
    data: Plan[] | any;
    message: string | undefined;
}

const Plan = () => {
    const [items, setItems] = useState<Plan[]>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [vehicleType, setVehicleType] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const isAccessible = useIsAccessible('service');
    const [selectedUser, setSelectedUser] = useState<any>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

    const createdTimeTemplate = (rowData: any) => {
        return <p>{formatTimestamp(rowData.createdTime)}</p>;
    };

    const columns = [
        { key: 'city', label: 'City', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'vehicleType', label: 'Vehicle type', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'name', label: 'Name', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'description', label: 'Description', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'validity', label: 'Plan Validity', _props: { scope: 'col' } },
        { key: 'deposit', label: 'Deposit', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'isActive', label: 'Active', _props: { scope: 'col' }, body: activeTemplate },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' }, body: createdTimeTemplate },
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
    const deletePlanD = async () => {
        //
        const response = await deletePlan(selectedUser);
        if (response.success) {
            fetchData();
            setShowDeleteDialog(false);

            showToast(response.message || 'Deleted Plan', 'success');
        } else {
            showToast(response.message || 'Failed To Deleted Plan', 'error');
        }
    };

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
    // useEffect(() => {
    //     console.log(formData.current.name)
    // }, [formData.current.name])
    const fetchData = async () => {
        let response: ApiResponse = await getPlans('rental');
        console.log(response);
        if (response.success) {
            if (response.data) {
                const sortedData = response.data?.sort((a: Plan, b: Plan) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
                setItems(sortedData);
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
                            <CustomTable tableName="rental" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                        </div>
                    </div>
                </div>
            )}
            {isAccessible === 'Edit' && (
                <Dialog header="Add Plan" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                    <RentalPlanForm city={city} vehicleType={vehicleType} fetchData={fetchData} setShowDialog={setShowDialog} type={'rental'} />
                </Dialog>
            )}
            {showDeleteDialog && (
                <Dialog header="Delete Plan" visible={showDeleteDialog} style={{ width: '50vw' }} onHide={() => setShowDeleteDialog(false)}>
                    <div className="grid">
                        <div className="col-12 text-center">
                            <h2>Are you sure you want to delete this Plan?</h2>
                        </div>
                        <div className="button-row col-12 gap-3 center-center">
                            <Button
                                label="Yes"
                                style={{ background: '#ff3333' }}
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
