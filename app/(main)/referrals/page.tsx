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
import { getFeedback, getReferral } from '@/app/api/services';
import { flattenData } from '@/app/api/user';
import useIsAccessible from '@/app/hooks/isAccessible';

const Referral = () => {
    const isAccessible = useIsAccessible('refer');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);

    const columns = [
        { key: 'referralCode', label: 'Code', _props: { scope: 'col' } },
        { key: 'referralOf.name', label: 'Referrer', _props: { scope: 'col' } },
        { key: 'referredByProfile.name', label: 'Referred By', _props: { scope: 'col' } },
        { key: 'referralStatus ', label: 'Status', _props: { scope: 'col' } },
        {
            key: 'referredByProfile.createdTime',
            label: 'Referred Time',
            _props: { scope: 'col' }
        }
    ];

    useEffect(() => {
        fetchData();

        return () => {
            setItems([]);
        };
    }, []);
    const fetchData = async () => {

        let response = await getReferral();
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
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {isAccessible === 'View' ||
                (isAccessible === 'Edit' && (
                    <div className="grid">
                        <div className="col-12">
                            <BreadCrumb model={[{ label: 'Feedback' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                        </div>

                        <div className="col-12 m-10">
                            <div className="card">
                                <CustomTable tableName="Referrals" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export default Referral;
