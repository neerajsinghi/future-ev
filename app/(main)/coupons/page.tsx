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




interface CouponProps {
    code: string;
    discount: number;
    validTill: string;
    description: string;
}
const Coupon = () => {

    const [items, setItems] = useState<any>([])
    const [loading1, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<any>(null)
    const [formData, setFormData] = useState<CouponProps>({
        code: '',
        discount: 0,
        validTill: '',
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
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.code} onChange={(e) => handleChange('code', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={formData.discount} onValueChange={(e) => handleChange('discount', e.value)} mode="decimal" minFractionDigits={2} />
                    </div>
                    <div className="field col-12 lg:6">
                        <label htmlFor="validTill">Valid Till</label>
                        <Calendar id="validTill" onChange={(e) => handleChange('validTill', e.target.value?.toDateString())} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 lg:6">
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



