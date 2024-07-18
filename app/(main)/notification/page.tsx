'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { getNotif, getUsers, sendNotif } from '@/app/api/iotBikes';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import './plan.css';

interface NotificationFormData {
    title: string;
    body: string;
    userId: string[];
    token: string[];
    category: string;
    targetValue: string | number | Date;
}

const Notification = () => {
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formData, setFormData] = useState<NotificationFormData>({
        title: '',
        body: '',
        category: '',
        targetValue: '',
        userId: [],
        token: []
    });

    const handleChange = (name: keyof NotificationFormData, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // Extract user names from selectedUser
        const userNames = selectedUser.map((user: any) => user.name);

        const notificationData = {
            ...formData,
            userName: userNames.join(', '), // Combine user names into a string
            userId: selectedUser.map((user: any) => user.id),
            token: selectedUser.map((user: any) => user.firebaseToken || 'defaultToken')
        };
        const response = await sendNotif(notificationData);
        if (response.success) {
            setShowDialog(false);
            fetchData();
        } else {
            console.log('Failed');
        }
    };

    const columns = [
        { key: 'title', label: 'Title', _props: { scope: 'col' } },
        { key: 'body', label: 'Body', _props: { scope: 'col' } },
        { key: 'category', label: 'Category', _props: { scope: 'col' } },
        { key: 'targetValue', label: 'Target Value', _props: { scope: 'col' } },
        { key: 'userId', label: 'UserId', _props: { scope: 'col' } },
        { key: 'token', label: 'Token', _props: { scope: 'col' } }
    ];

    useEffect(() => {
        fetchData();

        return () => {
            setItems([]);
        };
    }, [formData.category, formData.targetValue]);

    const fetchData = async () => {
        let response = await getNotif();
        if (response.success) {
            if (response.data) {
                setItems(() => response.data);
            }
        }
        setLoading1(false);

        let response1 = await getUsers('user');
        console.log(response1.data);
        if (response1.success) {
            if (response1.data) {
                // Filter users based on the selected category and value
                let filteredUsers = response1.data;

                if (formData.category && formData.targetValue) {
                    switch (formData.category) {
                        case 'city':
                            filteredUsers = response1.data.filter((user) => user.city === formData.targetValue);
                            break;
                        case 'gender':
                            filteredUsers = response1.data.filter((user) => user.gender === formData.targetValue);
                            break;
                        case 'age':
                            console.log(formData.targetValue);
                            filteredUsers = response1.data.filter((user) => {
                                const userAge = calculateAge(user.dob);
                                return userAge <= Number(formData.targetValue);
                            });

                            console.log('Filtered Users by Age:', filteredUsers);
                            break;
                        case 'birthday':
                            const targetDate = formatDate(String(formData.targetValue));
                            filteredUsers = response1.data.filter((user) => {
                                return user.dob === targetDate;
                            });
                            break;
                        case 'couponCode':
                            filteredUsers = response1.data.filter((user) => user.couponCode === formData.targetValue);
                            break;
                        default:
                            break;
                    }
                }

                setUsers(() => filteredUsers);
            }
        }
    };

    // Helper function to format the date to MM/DD/YYYY
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = String(date.getDate());
        const month = String(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        return Number(age);
    };

    const categories = [
        { label: 'City Wise', value: 'city' },
        { label: 'Gender Wise', value: 'gender' },
        { label: 'Age Wise', value: 'age' },
        { label: 'Birthday Wise', value: 'birthday' },
        { label: 'Coupon Code', value: 'couponCode' }
    ];

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Notification' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                        <Button type="button" label="Send Notification" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                    </div>
                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            <Dialog header="Add Notification" visible={showDialog} onHide={() => setShowDialog(false)}>
                <div className="notif-dialog">
                    <form onSubmit={handleSubmit} className="notif-form">
                        <div className="field">
                            <label htmlFor="title">Title</label>
                            <InputText className="element" id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                        </div>

                        <div className="field">
                            <label htmlFor="category">Category</label>
                            <Dropdown className="element" id="category" value={formData.category} options={categories} onChange={(e) => handleChange('category', e.value)} placeholder="Select Category" />
                        </div>
                        {formData.category === 'city' && (
                            <div className="field">
                                <label htmlFor="targetValue">City</label>
                                <InputText className="element" id="targetValue" value={String(formData.targetValue)} onChange={(e) => handleChange('targetValue', e.target.value)} />
                            </div>
                        )}
                        {formData.category === 'gender' && (
                            <div className="field">
                                <label htmlFor="targetValue">Gender</label>

                                <Dropdown
                                    className="element"
                                    id="category"
                                    value={formData.category}
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Others', label: 'Others' }
                                    ]}
                                    onChange={(e) => handleChange('targetValue', e.value)}
                                    placeholder="Select Gender"
                                />
                            </div>
                        )}
                        {formData.category === 'age' && (
                            <div className="field">
                                <label htmlFor="targetValue">Age</label>
                                <InputNumber className="element" id="targetValue" value={Number(formData.targetValue)} onChange={(e: InputNumberChangeEvent) => handleChange('targetValue', e.value)} />
                            </div>
                        )}
                        {formData.category === 'birthday' && (
                            <div className="field">
                                <label htmlFor="targetValue">Birthday</label>
                                <Calendar className="element" id="targetValue" value={new Date(formData.targetValue)} onChange={(e) => handleChange('targetValue', e.value)} showIcon />
                            </div>
                        )}
                        {formData.category === 'couponCode' && (
                            <div className="field">
                                <label htmlFor="targetValue">Coupon Code</label>
                                <InputText className="element" id="targetValue" value={String(formData.targetValue)} onChange={(e) => handleChange('targetValue', e.target.value)} />
                            </div>
                        )}
                        <div className={!formData.category ? 'field field-full' : 'field'}>
                            <label htmlFor="Users">Users</label>
                            <MultiSelect style={{ width: '100%' }} id="Users" value={selectedUser} options={users} onChange={(e) => setSelectedUser(e.value)} optionLabel="name" filter placeholder="Select Users" />
                        </div>
                        <div className="field field-full">
                            <label htmlFor="body">Body</label>
                            <InputTextarea className="element" id="body" value={formData.body} onChange={(e) => handleChange('body', e.target.value)} />
                        </div>
                        <div className="button-row">
                            <Button style={{ width: '100%' }} label="Submit" type="submit" />
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    );
};

export default Notification;
