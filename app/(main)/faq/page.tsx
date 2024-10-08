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
import useIsAccessible from '@/app/hooks/isAccessible';
import { showToast } from '@/app/hooks/toast';
import { deleteFaq } from '@/app/api/services';
import { useRouter } from 'next/navigation';
import { formatTimestamp } from '@/app/hooks/formatTimeString';
interface ProductFormData {
    question: string;
    answer: string;
}

const FAQ = () => {
    const router = useRouter();
    const isAccessible = useIsAccessible('faq');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const [faqId, setFaqId] = useState<any>();
    const [formData, setFormData] = useState<ProductFormData>({
        question: '',
        answer: ''
    });

    // console.log(isAccessible);

    const handleChange = (name: keyof ProductFormData, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        const response = await setFaq(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchData();
            showToast(response.message || 'Added FAQ', 'success');
        } else {
            showToast(response.message || ' Failed to Add FAQ', 'error');
            console.log('Failed');
        }
    };
    const changeFaqActive = async (id: string, status: boolean) => {
        const body: any = {
            isActive: status
        };
        const response = await updateFaq(body, id);
        if (response.success) {
            fetchData();
        }
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
        const response = await updateFaq(body, rowData.id);
        if (response.success) {
            fetchData();
        }
    };

    const deleteFaqD = async () => {
        const response = await deleteFaq(faqId);
        if (response.success) {
            fetchData();
            setShowDeleteDialog(false);
            router.refresh();
            showToast(response.message || 'Deleted FAQ', 'success');
        } else {
            showToast(response.message || 'Failed To Delete FAQ', 'error');
        }
    };

    const createdTimeTemplate = (rowData: any) => {
        return <p>{formatTimestamp(rowData.createdTime)}</p>;
    };

    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'question', label: 'Question', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
        { key: 'answer', label: 'Answer', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete },
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
                            setFaqId(rowData.id);
                            setShowDeleteDialog(true);
                        }}
                    ></Button>
                );
            }
        }
    ];

    useEffect(() => {
        fetchData();

        return () => {
            setItems([]);
        };
    }, []);
    const fetchData = async () => {
        let response = await getFaq();
        if (response.success) {
            if (response.data) {
                setItems(() => response.data);
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
                        <BreadCrumb model={[{ label: 'Faq' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                    </div>
                    <div className="col-12">
                        <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                            <Button type="button" icon="pi pi-plus-circle" label="Faq" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                        </div>
                    </div>
                    <div className="col-12 m-10">
                        <div className="card">
                            <CustomTable tableName="faqs" editMode={'cell'} columns2={[]} columns={columns} items={items} loading1={loading1} />
                        </div>
                    </div>
                </div>
            )}
            {isAccessible === 'Edit' && (
                <Dialog header="Add Faq" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="p-fluid grid">
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="question">Question</label>
                                <InputText id="question" value={formData.question} onChange={(e) => handleChange('question', e.target.value)} />
                            </div>
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="answer">Answer</label>
                                <InputText id="answer" value={formData.answer} onChange={(e) => handleChange('answer', e.target.value)} />
                            </div>
                            <div className="field col-12"></div>
                            <div className="field col-2 button-row">
                                <Button label="Submit" type="submit" />
                            </div>
                        </form>
                    </div>
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
                                    deleteFaqD();
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

export default FAQ;
