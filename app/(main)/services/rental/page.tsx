'use client';
import { BreadCrumb } from "primereact/breadcrumb";
import { ChangeEvent, createRef, MutableRefObject, Ref, RefObject, use, useEffect, useRef, useState } from "react";
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

    const activeTemplate = (rowData: any) => {
        return <InputSwitch checked={rowData.isActive} onClick={() => {
            changePlanActive(rowData.id, !rowData.isActive)
        }
        } />;
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
    // useEffect(() => {
    //     console.log(formData.current.name)
    // }, [formData.current.name])
    const fetchData = async () => {
        let response = await getPlans("rental")
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
                <RentalPlanForm city={city} vehicleType={vehicleType} fetchData={fetchData} setShowDialog={setShowDialog} type={"rental"} />
            </Dialog >
        </>
    )
}
const TextField: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = value;
        }
    }, [value]);

    return (
        <InputText
            type="text"
            ref={inputRef} // Assign the ref
            onChange={(e) => onChange(e.target.value)}
        />
    );
};
const TextAreaField: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => {
    debugger
    const inputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = value;
        }
    }, [value]);
    return (
        <InputTextarea
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};
export const RentalPlanForm = ({ city, vehicleType, setShowDialog, fetchData, type }: { city: any[], vehicleType: any[], setShowDialog: any, fetchData: any, type: string }) => {
    const [selectedCity, setSelectedCity] = useState<any>({});
    const [selectedVehicleType, setSelectedVehicleType] = useState<any>({});
    const [changed, setChanged] = useState(false)
    const formData = useRef<ProductFormData | any>({
        type: "rental",
        isActive: true,
        city: '',
        vehicleType: '',
        name: [""],
        description: [""],
        price: [0],
        validity: [0],
    });
    const handleChange = (name: keyof ProductFormData, value: any) => {
        debugger
        if (name === 'city') {
            setSelectedCity(value)
            formData.current.city = value.code;
            return
        }
        if (name === 'vehicleType') {
            setSelectedVehicleType(value)
            formData.current.vehicleType = value.code;
            return
        }
    }
    const handleNameChange = (e: any, index: number): void => {
        formData.current.name[index] = e
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        for (let i = 0; i < formData.current.name.length; i++) {
            if (formData.current.name[i] === "") {
                alert("Name cannot be empty")
                return
            }
            if (formData.current.description[i] === "") {
                alert("Description cannot be empty")
                return
            }
            if (formData.current.price[i] === 0) {
                alert("Price cannot be empty")
                return
            }
            if (formData.current.validity[i] === 0) {
                alert("Validity cannot be empty")
                return
            }
            debugger
            const body = {
                city: formData.current.city,
                vehicleType: formData.current.vehicleType,
                name: formData.current.name[i],
                description: formData.current.description[i],
                price: formData.current.price[i],
                validity: formData.current.validity[i].toString(),
                type: formData.current.type,
                isActive: formData.current.isActive
            }

            const response = await setPlan(body)
            if (response.success && response.data) {
            } else {
                console.log('Failed')
            }
        }
        setShowDialog(false)
        fetchData()

    };
    return (
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
                <div className="field col-12 lg:col-12">
                    {formData.current.price.map((price: number, index: number) => {
                        return (
                            <>
                                <div className="field col-12 lg:col-12" key={index.toString() + Math.random().toString()}>
                                    <div className="grid  align-content-center align-item-center">
                                        <div className="col-6 align-item-center" >

                                            <label htmlFor="price">Name</label>
                                            <TextField value={formData.current.name[index]} onChange={(val) => handleNameChange(val, index)} />
                                        </div>
                                        <div key={"desc" + index.toString() + Math.random()} className="col-6 align-item-center">

                                            <label htmlFor="desc">Description</label>
                                            <TextAreaField value={formData.current.description[index]} onChange={(val: string) => {
                                                formData.current.description[index] = val
                                            }} />
                                        </div>
                                        <div className="col-4 align-item-center">

                                            <label htmlFor="price">Price</label>
                                            <InputNumber value={formData.current.price[index]} onValueChange={(e: InputNumberValueChangeEvent) => {
                                                e.stopPropagation()
                                                formData.current.price[index] = e.value ?? 0;

                                            }} mode="currency" currency="INR" locale="en-IN" onKeyDown={(e) => e.stopPropagation()} />
                                        </div >
                                        <div className="col-4 align-item-center">

                                            <label htmlFor="price">Validity</label>
                                            <InputNumber value={formData.current.validity[index]} onValueChange={(e: InputNumberValueChangeEvent) => {
                                                e.stopPropagation()
                                                formData.current.validity[index] = e.value ?? 0;
                                            }} suffix=" days" onKeyDown={(e) => e.stopPropagation()} />
                                        </div >
                                        {index == 0 && <div className="col-3 align-item-center">
                                            <div onClick={() => {
                                                const names = formData.current.name
                                                const descriptions = formData.current.description
                                                const prices = formData.current.price
                                                const validities = formData.current.validity
                                                names.push("")
                                                descriptions.push("")
                                                prices.push(0)
                                                validities.push(0)
                                                formData.current.name = names
                                                formData.current.description = descriptions
                                                formData.current.price = prices
                                                formData.current.validity = validities
                                                setChanged(prev => !prev)

                                            }
                                            }
                                            >
                                                <span className="pi pi-plus" />
                                            </div>
                                        </div>}
                                        <div className="col-3 align-item-center">
                                            {index != 0 && index == formData.current.price.length - 1 && <div onClick={() => {

                                                formData.current.name.pop()
                                                formData.current.description.pop()
                                                formData.current.price.pop()
                                                formData.current.validity.pop()
                                                setChanged(prev => !prev)
                                            }}
                                            >
                                                <span className=" pi pi-minus"></span>
                                            </div>}
                                        </div>
                                    </div>
                                </div >
                            </>
                        )
                    })}
                </div >
                <div className="field col-12"></div>
                <div className="field col-2 button-row">
                    <Button label="Submit" type="submit" />
                </div>
            </form>
        </div>
    )
}
export default Plan;
