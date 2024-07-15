'use client';
import { BreadCrumb } from "primereact/breadcrumb";
import { ChangeEvent, useEffect, useState } from "react";
import CustomTable from "../../components/table";
import { getPlans, getVehicleTypes, setPlan, updatePlan } from "@/app/api/iotBikes";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import "./plan.css";
import { ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { getCity } from "@/app/api/services";
import RentalPlanForm from "../component/rentalPlan";
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

const Plan = () => {

    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [vehicleType, setVehicleType] = useState<any>([]);
    const [city, setCity] = useState<any>([]);



    const changePlanActive = async (id: string, status: boolean) => {
        const body: any = {
            isActive: status
        }
        const response = await updatePlan(body, id)
        if (response.success) {
            fetchData()
        }
    }

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
        }
        const response = await updatePlan(body, rowData.id)
        if (response.success) {
            fetchData()
        }
    };

    const columns = [
        { key: 'city', label: 'City', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'vehicleType', label: 'Vehicle type', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'name', label: 'Name', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'description', label: 'Description', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'price', label: 'Price', _props: { scope: 'col' }, cellEditor: cellNumberEditor, onCellEditComplete: onCellEditComplete },
        { key: 'validity', label: 'Validity', _props: { scope: 'col' } },
        { key: 'createdTime', label: 'CreatedTime', _props: { scope: 'col' } },
    ]

    useEffect(() => {

        fetchData();
        getCityD();
        getVehicleTypesD();
        return () => {
            setItems([])
        }
    }, [])
    const getCityD = async () => {
        let response = await getCity()
        if (response.success) {
            if (response.data) {
                const data: any[] = []
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ name: response.data[i].name, code: response.data[i].name })
                }
                setCity(() => data)
            }
        }
    }
    const getVehicleTypesD = async () => {
        let response = await getVehicleTypes()
        if (response.success) {
            if (response.data) {
                const data: any[] = []
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ name: response.data[i].name, code: response.data[i].name })
                }
                setVehicleType(() => data)
            }
        }
    }
    const fetchData = async () => {
        let response = await getPlans("eCar")
        if (response.success) {
            if (response.data) {
                setItems(() => response.data)
            }
        }
        setLoading1(false)
    }
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Plan' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: "0px" }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Plan" style={{ marginBottom: "0px" }} onClick={() => setShowDialog(true)} />
                    </div>

                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={"cell"} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            <Dialog header="Add Plan" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                <RentalPlanForm city={city} vehicleType={vehicleType} setShowDialog={setShowDialog} fetchData={fetchData} type={"eCar"} />
            </Dialog >
        </>
    )
}

export default Plan;