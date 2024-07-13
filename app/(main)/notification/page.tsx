'use client';
import { BreadCrumb } from "primereact/breadcrumb";
import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { getNotif, getUsers, sendNotif } from "@/app/api/iotBikes";
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
import { MultiSelect } from "primereact/multiselect";
interface ProductFormData {
    title: string;
    body: string;
    userId: string[];
    token: string[];
}

const Notification = () => {

    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [users, setUsers] = useState<any>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        body: '',
        userId: [],
        token: [],
    });

    const handleChange = (name: keyof ProductFormData, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        debugger
        // Send formData to your backend for processing
        console.log(formData);
        for (let i = 0; i < selectedUser.length; i++) {
            formData.userId.push(selectedUser[i].id)
            formData.token.push(selectedUser[i].firebaseToken ? selectedUser[i].firebaseToken : "selectedUser[i].firebaseToken")
        }
        const response = await sendNotif(formData)
        if (response.success) {
            setShowDialog(false)
            fetchData()
        } else {
            console.log('Failed')
        }
    };




    const columns = [
        { key: 'title', label: 'Title', _props: { scope: 'col' }, },
        { key: 'body', label: 'Body', _props: { scope: 'col' }, },
        { key: 'userId', label: 'UserId', _props: { scope: 'col' } },
        { key: 'token', label: 'Token', _props: { scope: 'col' } },
    ]

    useEffect(() => {

        fetchData();

        return () => {
            setItems([])
        }
    }, [])
    const fetchData = async () => {
        let response = await getNotif()
        if (response.success) {
            if (response.data) {
                setItems(() => response.data)
            }
        }
        setLoading1(false)
        let response1 = await getUsers("user")
        if (response1.success) {
            if (response1.data) {
                setUsers(() => response1.data)
            }
        }
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Notification' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: "0px" }}>
                        <Button type="button" label="Send Notification" style={{ marginBottom: "0px" }} onClick={() => setShowDialog(true)} />
                    </div>

                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={"cell"} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            <Dialog header="Add Notification" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="p-fluid grid">

                        <div className="field col-12 lg:col-6">
                            <label htmlFor="name">Title</label>
                            <InputText id="name" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                        </div>
                        <div className="field col-12 lg:col-6">
                            <label htmlFor="name">Body</label>
                            <InputText id="name" value={formData.body} onChange={(e) => handleChange('body', e.target.value)} />
                        </div>
                        <div className="field col-12 lg:col-6">
                            <MultiSelect id="Users" value={selectedUser} options={users} onChange={(e) => setSelectedUser(e.value)} optionLabel="name" filter placeholder="Select Users" className="w-full md:w-20rem" />
                        </div>
                        <div className="field col-12"></div>
                        <div className="field col-2 button-row">
                            <Button label="Submit" type="submit" />
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

export default Notification;