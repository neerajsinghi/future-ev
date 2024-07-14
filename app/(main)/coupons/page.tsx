'use client';

import { createCoupon, getCoupons } from "@/app/api/iotBikes";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";



/*
ServiceType    []string
City           []string
VehicleType    []string
Code           string             `json
CouponType     string             `json
MinValue       float64            `json
MaxValue       float64            `json
MaxUsageByUser int                `json
Discount       float64            `json
ValidityFrom   string             `json
ValidTill      string             `json
Description    string             `json
*/
interface CouponProps {
    selectType: string[];
    city: string[];
    vehicleType: string[];
    code: string;
    couponType: string;
    minValue: number;
    maxValue: number;
    maxUsageByUser: number;
    discount: number;
    validityFrom: Date;
    validTill: Date;
    description: string;

}
const Coupon = () => {

    const [items, setItems] = useState<any>([])
    const [loading1, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<any>(null)
    const [formData, setFormData] = useState<CouponProps>({
        selectType: [],
        city: [],
        vehicleType: [],
        code: '',
        couponType: '',
        minValue: 0,
        maxValue: 0,
        maxUsageByUser: 0,
        discount: 0,
        validityFrom: new Date(),
        validTill: new Date(),
        description: '',
    });
    const columns = [
        { key: 'code', label: 'Code', _props: { scope: 'col' } },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' } },
        { key: 'validTill', label: 'Valid Till', _props: { scope: 'col' } },
        { key: 'description', label: 'Description', _props: { scope: 'col' } },
    ];

    const getCouponsData = async () => {
        const response = await getCoupons()
        if (response.success && response.data) {
            setItems(response.data)
        }
        setLoading(false)
    }
    useEffect(() => {
        getCouponsData()
    }, [])
    const handleChange = (name: keyof CouponProps, value: any) => {
        setFormData({ ...formData, [name]: value });

    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await createCoupon(formData)
        if (response.success) {
            getCouponsData()
            setShowDialog(false)
        }
    }
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Coupon' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: "0px" }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Station" style={{ marginBottom: "0px" }} onClick={() => setShowDialog(true)} />
                    </div>

                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />                    </div>
                </div>
            </div>

            <Dialog header="Bikes Stationed" visible={showDialog} style={{ width: '50vw' }} modal onHide={() => { setShowDialog(false) }}>
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="selectType">Select Type</label>
                        <MultiSelect id="selectType" value={formData.selectType} options={[]} onChange={(e) => handleChange('selectType', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="city">City</label>
                        <MultiSelect id="city" value={formData.city} options={[]} onChange={(e) => handleChange('city', e.value)} optionLabel="name" placeholder="Select a City" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="vehicleType">Vehicle Type</label>
                        <MultiSelect id="vehicleType" value={formData.vehicleType} options={[]} onChange={(e) => handleChange('vehicleType', e.value)} optionLabel="name" placeholder="Select a Vehicle Type" />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.code} onChange={(e) => handleChange('code', e.target.value)} />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="couponType">Coupon Type</label>
                        <Dropdown value={formData.couponType} options={[]} onChange={(e) => handleChange('couponType', e.value)} optionLabel="name" placeholder="Select a Coupon Type" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="minValue">Min Value</label>
                        <InputNumber id="minValue" value={formData.minValue} onValueChange={(e) => handleChange('minValue', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="maxValue">Max Value</label>
                        <InputNumber id="maxValue" value={formData.maxValue} onValueChange={(e) => handleChange('maxValue', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="maxUsageByUser">Max Usage By User</label>
                        <InputNumber id="maxUsageByUser" value={formData.maxUsageByUser} onValueChange={(e) => handleChange('maxUsageByUser', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="discount">Discount</label>
                        <InputNumber id="discount" value={formData.discount} onValueChange={(e) => handleChange('discount', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="validityFrom">Validity From</label>
                        <Calendar id="validityFrom" value={formData.validityFrom} onChange={(e) => handleChange('validityFrom', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="validTill">Valid Till</label>
                        <Calendar id="validTill" value={formData.validTill} onChange={(e) => handleChange('validTill', e.value)} />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                    </div>

                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog >
        </>
    )
}

export default Coupon;



