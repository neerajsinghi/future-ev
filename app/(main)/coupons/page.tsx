'use client';

import { createCoupon, getCoupons, getServices, getVehicleTypes } from '@/app/api/iotBikes';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { deleteCoupons, getCity } from '@/app/api/services';
import { format } from 'date-fns';
import useIsAccessible from '@/app/hooks/isAccessible';
import { showToast } from '@/app/hooks/toast';
import { useRouter } from 'next/navigation';
import "./plan.css";
interface CouponProps {
    serviceType: string[];
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

interface serviceTypes {
    id: string;
    name: string;
    type: string;
    description: string;
    price: number;
    active: boolean;
    discount: number;
    status: string;
    createdTime: string;
}

interface vehicleProps {
    id: string;
    name: string;
    price: number;
    description: string;
    created_time: string;
}
const Coupon = () => {
    const isAccessible = useIsAccessible('coupons');
    const router = useRouter();
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [serviceType, setserviceType] = useState<serviceTypes[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [coupon, setCoupon] = useState<any>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [vehicleTypes, setVehicleTypes] = useState<vehicleProps[]>([]);
    const [formData, setFormData] = useState<CouponProps>({
        serviceType: [],
        city: [],
        vehicleType: [],
        code: generateCouponCode(10),
        couponType: '',
        minValue: 0,
        maxValue: 0,
        maxUsageByUser: 0,
        discount: 0,
        validityFrom: new Date(),
        validTill: new Date(),
        description: ''
    });

    // Define your discount template
    const discountTemplate = (rowData: CouponProps) => {
        return <div>{rowData.code ? rowData.discount : 'NA'}</div>;
    };

    // Define date format template
    const dateTemplate = (rowData: any, field: string) => {
        const date = new Date(rowData[field]);
        return date.getFullYear() === 1 ? 'N/A' : format(date, 'yyyy-MM-dd');
    };
    const ViewBookings = (rowData: any) => {
        return rowData.bookingCount ? <Button label={rowData.bookingCount} onClick={() => router.push(`/coupons/ridenowcoupons/${rowData.bookingCount}`)} /> : <div>{rowData.bookingCount}</div>;
    }
    const ViewWallet = (rowData: any) => {
        return rowData.walletCount ? < Button label={rowData.walletCount} onClick={() => router.push(`/coupons/rentalcoupons/${rowData.walletCount}`)} /> : <div>{rowData.walletCount}</div>;
    }
    // Define your columns
    const columns = [
        { key: 'code', label: 'Coupon Code', _props: { scope: 'col' }, filterField: 'code' },
        { key: 'discount', label: 'Discount', _props: { scope: 'col' }, body: discountTemplate, filterField: 'discount' },
        { key: 'minValue', label: 'Min Value', _props: { scope: 'col' }, filterField: 'minValue' },
        { key: 'maxValue', label: 'Max Value', _props: { scope: 'col' }, filterField: 'maxValue' },
        { key: 'maxUsageByUser', label: 'Max Usage By User', _props: { scope: 'col' }, filterField: 'maxUsageByUser' },
        { key: 'validFrom', label: 'Valid From', _props: { scope: 'col' }, body: (rowData: CouponProps) => dateTemplate(rowData, 'validFrom'), filterField: 'validFrom' },
        { key: 'validTill', label: 'Valid Till', _props: { scope: 'col' }, body: (rowData: CouponProps) => dateTemplate(rowData, 'validTill'), filterField: 'validTill' },
        {
            key: 'couponType', label: 'Coupon Type', _props: { scope: 'col' }, filterField: 'couponType', body: (rowData: any) => {
                return <div style={{ textTransform: "capitalize" }}>{rowData.couponType}</div>;

            },
        },
        { key: 'bookingCount', label: 'Bookings', _props: { scope: 'col' }, body: ViewBookings },
        { key: 'walletCount', label: 'Rentals', _props: { scope: 'col' }, body: ViewWallet },
        { key: 'description', label: 'Description', _props: { scope: 'col' }, filterField: 'description' },
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
                            setCoupon(rowData.id);
                            setShowDeleteDialog(true);
                        }}
                    ></Button>
                );
            }
        }
    ];

    // Filter items based on coupon code and validity

    const getCouponsData = async () => {
        const response = await getCoupons();
        if (response.success && response.data) {
            setItems(response.data);
        }
        setLoading(false);
    };

    const getAvailableServiceTypes = async () => {
        debugger
        const response = await getServices();
        if (response.data && response.success) {
            setserviceType(response.data);
        }
        setLoading(false);
    };
    const getAvailableVehicleTypes = async () => {
        const response = await getVehicleTypes();
        if (response.data && response.success) {
            setVehicleTypes(response.data);
        }
        setLoading(false);
    };

    const fetchCities = async () => {
        const data: any = [];
        const response = await getCity();
        if (response.success && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                data.push({ name: response.data[i].name, code: response.data[i].name });
            }
            setCities(() => data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getCouponsData();
        getAvailableServiceTypes();
        fetchCities();
        getAvailableVehicleTypes();
    }, []);
    const handleChange = (name: keyof CouponProps, value: any) => {
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.couponType === 'discount') {
            if (formData.discount === 0) {
                showToast('Please Enter Discount', 'error');
                return;
            }
            if (formData.maxValue === 0) {
                showToast('Please Enter Max Value', 'error');
                return;
            }
            if (formData.maxUsageByUser === 0) {
                showToast('Please Enter Max Usage By User', 'error');
                return;
            }
            if (formData.city.length === 0) {
                showToast('Please Select City', 'error');
                return;
            }
            if (formData.serviceType.length === 0) {
                showToast('Please Select Service Type', 'error');
                return;
            } else {
                for (let i = 0; i < formData.serviceType.length; i++) {
                    if (formData.serviceType[i] === 'Ride Now') {
                        formData.serviceType[i] = 'hourly';
                    } else if (formData.serviceType[i] === 'Rental') {
                        formData.serviceType[i] = 'rental';
                    }
                }
            }

        }
        const response = await createCoupon(formData);
        if (response.success) {
            getCouponsData();
            setShowDialog(false);
            showToast(response.message || 'added Coupon', 'success');
        } else {
            showToast(response.message || 'Error adding Coupon', 'error');
        }
    };

    const deleteCouponD = async () => {
        const response = await deleteCoupons(coupon);
        if (response.success) {
            router.refresh();
            setShowDeleteDialog(false);
            showToast(response.message || 'Deleted Coupon', 'success');
        } else {
            showToast(response.message || 'Failed To Delete Coupon', 'error');
        }
    };

    function generateCouponCode(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let couponCode = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            couponCode += characters[randomIndex];
        }
        return couponCode;
    }

    return (
        <>
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {(isAccessible === 'Edit' || isAccessible === 'View') && (
                <div className="grid">
                    <div className="col-12">
                        <BreadCrumb model={[{ label: 'Coupon' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                    </div>
                    <div className="col-12">
                        <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                            <Button type="button" icon="pi pi-plus-circle" label="Coupons" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                        </div>
                    </div>
                    <div className="col-12 m-10">
                        <div className="card">
                            <CustomTable tableName="coupons" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />{' '}
                        </div>
                    </div>
                </div>
            )}

            {isAccessible === 'Edit' && (
                <Dialog
                    header="Add Coupons"
                    visible={showDialog}
                    style={{ width: '50vw' }}
                    modal
                    onHide={() => {
                        setShowDialog(false);
                    }}
                >
                    <form onSubmit={handleSubmit} className="p-fluid grid">
                        <div className="field col-12 lg:col-6">
                            <label htmlFor="couponType">Coupon Type</label>
                            <Dropdown filter value={formData.couponType} options={['discount', 'freeRide', 'referral']} onChange={(e) => handleChange('couponType', e.value)} optionLabel="name" placeholder="Select a Coupon Type" style={{ textTransform: "capitalize" }} />
                        </div>
                        {formData.couponType && formData.couponType != '' && <>{formData.couponType != 'freeRide' && formData.couponType != 'referral' && (
                            <div className="field col-12 lg:col-6">
                                <label htmlFor="serviceType">Service Type</label>
                                <MultiSelect
                                    filter
                                    id="serviceType"
                                    value={formData.serviceType}
                                    placeholder="Select a Service Type"
                                    options={serviceType?.map((service: serviceTypes) => service.name)}
                                    onChange={(e) => handleChange('serviceType', e.value)}
                                />
                            </div>
                        )}

                            {(formData.couponType == '' || formData.couponType != 'referral') && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="city">City</label>
                                    <MultiSelect filter id="city" value={formData.city} options={cities.map((city) => city.name)} onChange={(e) => handleChange('city', e.value)} placeholder="Select a City" />
                                </div>
                            )}

                            {(formData.couponType == '' || formData.couponType != 'referral') && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="vehicleType">Vehicle Type</label>
                                    <MultiSelect filter id="vehicleType" value={formData.vehicleType} options={vehicleTypes?.map((vehicle) => vehicle.name)} onChange={(e) => handleChange('vehicleType', e.value)} placeholder="Select a Vehicle Type" />
                                </div>
                            )}

                            {(formData.couponType == '' || formData.couponType != 'referral') && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="code">Coupon Code</label>
                                    <InputText id="code" placeholder="Enter Code Name" value={formData.code} onChange={(e) => handleChange('code', e.target.value)} />
                                </div>
                            )}

                            {formData.couponType != 'freeRide' && formData.couponType != 'referral' && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="minValue">Min Value</label>
                                    <InputNumber id="minValue" value={formData.minValue} onValueChange={(e) => handleChange('minValue', e.value)} />
                                </div>
                            )}
                            {formData.couponType != 'freeRide' && formData.couponType != 'referral' && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="maxValue">Max Value</label>
                                    <InputNumber id="maxValue" value={formData.maxValue} onValueChange={(e) => handleChange('maxValue', e.value)} />
                                </div>
                            )}
                            {formData.couponType === 'referral' && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="maxValue">Referral Bonus</label>
                                    <InputNumber id="maxValue" value={formData.maxValue} onValueChange={(e) => handleChange('maxValue', e.value)} />
                                </div>
                            )}
                            {formData.couponType != 'freeRide' && formData.couponType != 'referral' && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="maxUsageByUser">Max Usage By User</label>
                                    <InputNumber id="maxUsageByUser" value={formData.maxUsageByUser} onValueChange={(e) => handleChange('maxUsageByUser', e.value)} />
                                </div>
                            )}
                            {formData.couponType != 'freeRide' && formData.couponType != 'referral' && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="discount">Discount</label>
                                    <InputNumber suffix=" %" id="discount" value={formData.discount} onValueChange={(e) => handleChange('discount', e.value)} />
                                </div>
                            )}
                            {(formData.couponType == '' || formData.couponType != 'referral') && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="validityFrom">Validity From</label>
                                    <Calendar id="validityFrom" value={formData.validityFrom} onChange={(e) => handleChange('validityFrom', e.value)} />
                                </div>
                            )}
                            {(formData.couponType == '' || formData.couponType != 'referral') && (
                                <div className="field col-12 lg:col-6">
                                    <label htmlFor="validTill">Valid Till</label>
                                    <Calendar id="validTill" value={formData.validTill} onChange={(e) => handleChange('validTill', e.value)} />
                                </div>
                            )}
                            <div className="field col-12">
                                <label htmlFor="description">Description</label>
                                <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                            </div>
                        </>}

                        <div className="field col-2 button-row w-full">
                            <Button label="Submit" type="submit" />
                        </div>
                    </form>
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
                                    deleteCouponD();
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

export default Coupon;
