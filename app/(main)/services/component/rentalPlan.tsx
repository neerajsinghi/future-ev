import { setPlan } from "@/app/api/iotBikes";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useRef, useEffect } from "react";



interface ProductFormData {
    city: string;
    vehicleType: string;
    name: string[];
    description: string[];
    price: number[];
    validity: number[];
    type: string;
    isActive: boolean;
    deposit: number;
}

const RentalPlanForm = ({ city, vehicleType, setShowDialog, fetchData, type }: { city: any[], vehicleType: any[], setShowDialog: any, fetchData: any, type: string }) => {
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
        deposit: 0,
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
        formData.current[name] = value;
        console.log(formData.current)
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
                <div className="col-3 align-item-center">
                    <label htmlFor="validity">Refundable Deposit</label>
                    <InputNumber value={formData.current.deposit} onValueChange={(e: InputNumberValueChangeEvent) => handleChange('deposit', e.value)} mode="currency" currency="INR" locale="en-IN" />
                </div>
                <div className="field col-12"></div>
                <div className="field col-2 button-row">
                    <Button label="Submit" type="submit" />
                </div>
            </form>
        </div>
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

export default RentalPlanForm;