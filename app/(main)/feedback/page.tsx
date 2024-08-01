'use client';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { getFaq, setFaq, updateFaq } from '@/app/api/iotBikes';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import './plan.css';
import { ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { getFeedback } from '@/app/api/services';
import { flattenData } from '@/app/api/user';
import useIsAccessible from '@/app/hooks/isAccessible';

const FeedBack = () => {
    const isAccessible = useIsAccessible('feedback');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);

    const columns = [
        { key: 'profile.name', label: 'User Name', _props: { scope: 'col' } },
        { key: 'booking.city', label: 'Booked in', _props: { scope: 'col' } },
        { key: 'booking.deviceId', label: 'Device ID', _props: { scope: 'col' } },
        { key: 'feedback', label: 'Feedback', _props: { scope: 'col' } },
        { key: 'ratings', label: 'Rating', _props: { scope: 'col' } }
    ];

    useEffect(() => {
        fetchData();

        return () => {
            setItems([]);
        };
    }, []);
    const fetchData = async () => {
        debugger;
        let response = await getFeedback();
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ ...flattenData(response.data[i]) });
                }
                setItems(data);
            }
        }
        setLoading1(false);
    };

    return (
        <>
            {/* {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>} */}
            {/* {(isAccessible === 'Edit' || isAccessible === 'View') && ( */}
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Feedback' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>

                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable tableName="Feedbacks" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    );
};

export default FeedBack;
