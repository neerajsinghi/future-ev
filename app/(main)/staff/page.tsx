'use client';
import { BreadCrumb } from "primereact/breadcrumb";
import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { getUsers, updateUser, addUser } from "@/app/api/iotBikes";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import "./plan.css";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { getCity } from "@/app/api/services";

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    address: Address;
    dob: string;
    joiningDate: string;
    statusBool: boolean;
    role: "admin";
    gender: "";
    access: AccessOptions;
    password: string;
    staffVerificationId: string;
    staffId: string;
    staffStatus: "On Duty" | "Leave" | "Out of working hours" | "";
    staffShiftStartTime: Date;
    staffShiftEndTime: Date;
}
interface AccessOptions {
    staff: "View" | "Edit" | "None";
    service: "View" | "Edit" | "None";
    customer: "View" | "Edit" | "None";
    bikes: "View" | "Edit" | "None";
    stations: "View" | "Edit" | "None";
    plans: "View" | "Edit" | "None";
    reports: "View" | "Edit" | "None";
    bikesStations: "View" | "Edit" | "None";
    coupons: "View" | "Edit" | "None";
    users: "View" | "Edit" | "None";
    charger: "View" | "Edit" | "None";
}
interface Address {
    address: string;
    city: string;
    country: string;
    postalCode: string;
}
const Staff = () => {
    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedGender, setSelectedGender] = useState<any>(null)
    const [showAccessDialog, setShowAccessDialog] = useState(false);
    const [city, setCity] = useState<any>([]);
    const [selectedCity, setSelectedCity] = useState<any>({});
    const [accessData, setAccessData] = useState<AccessOptions>({} as AccessOptions)
    const [selectedId, setSelectedId] = useState<string>("")
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        address: {
            address: '',
            city: '',
            country: '',
            postalCode: ''
        },
        dob: '',
        joiningDate: '',
        statusBool: true,
        role: "admin",
        gender: "",
        access: {
            staff: "None",
            customer: "None",
            bikes: "None",
            stations: "None",
            plans: "None",
            service: "None",
            reports: "None",
            bikesStations: "None",
            coupons: "None",
            users: "None",
            charger: "None"
        },
        password: '',
        staffVerificationId: '',
        staffId: '',
        staffStatus: "",
        staffShiftStartTime: new Date(),
        staffShiftEndTime: new Date()
    });

    const handleChange = (name: keyof UserFormData, value: any) => {
        console.log(name, value)
        if (name === 'gender') {
            setSelectedGender(value)
            setFormData({ ...formData, [name]: value.code });
            return
        }


        setFormData({ ...formData, [name]: value });
    };
    const changeStatus = async (status: boolean, id: string) => {
        const body: any = {
            statusBool: status,
        }
        const response = await updateUser(body, id)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }
    const changeAccess = async () => {
        const body: any = {
            access: accessData
        }
        const response = await updateUser(body, selectedId)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        const response = await addUser(formData)
        if (response.success) {
            setShowDialog(false)
            fetchData()
        } else {
            console.log('Failed')
        }
    };

    const statusAddressTemplate = (rowData: any) => {

        return <div>{rowData.address?.address}</div>;
    }
    const statusCityTemplate = (rowData: any) => {

        return <div>{rowData.address?.city}</div>;
    }
    const statusPostalCodeTemplate = (rowData: any) => {

        return <div>{rowData.address?.postalCode}</div>;
    }
    const statusStausTemplate = (rowData: any) => {
        return <Button className={`customer-badge status-${rowData}`} severity={rowData && rowData.statusBool ? 'success' : 'danger'} onClick={() => changeStatus(!rowData.statusBool, rowData.id)}>{rowData && rowData.statusBool ? "Active" : "InActive"}</Button>;
    }
    const accessTemplate = (rowData: any) => {
        return <>{rowData.access && <Button className="p-button-text" onClick={() => {
            setSelectedId(rowData.id)
            const access: AccessOptions = {
                staff: rowData.access.staff,
                customer: rowData.access.customer,
                bikes: rowData.access.bikes,
                stations: rowData.access.stations,
                plans: rowData.access.plans,
                service: rowData.access.services,
                reports: rowData.access.reports,
                bikesStations: rowData.access.bikesStations,
                coupons: rowData.access.coupons,
                users: rowData.access.users,
                charger: rowData.access.charger
            }
            for (let i = 0; i < rowData.access.length; i++) {
                if (rowData.access[i]["Key"] === "staff") {
                    access.staff = rowData.access[i]["Value"]
                }
                if (rowData.access[i].Key === "customer") {
                    access.customer = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "bikes") {
                    access.bikes = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "stations") {
                    access.stations = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "plans") {
                    access.plans = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "service") {
                    access.service = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "reports") {
                    access.reports = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "bikesStations") {
                    access.bikesStations = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "coupons") {
                    access.coupons = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "users") {
                    access.users = rowData.access[i].Value
                }
                if (rowData.access[i].Key === "charger") {
                    access.charger = rowData.access[i].Value
                }

            }
            setAccessData(access)
            setShowAccessDialog(prev => true)
        }} >Access</Button >
        }</>;
    }

    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'email', label: 'Email', _props: { scope: 'col' } },
        { key: 'phoneNumber', label: 'Phone', _props: { scope: 'col' } },
        { key: 'address', label: 'Address', _props: { scope: 'col' }, body: statusAddressTemplate },
        { key: 'city', label: 'City', _props: { scope: 'col' }, body: statusCityTemplate },
        { key: 'postalCode', label: 'Pincode', _props: { scope: 'col' }, body: statusPostalCodeTemplate },
        { key: 'dob', label: 'Dob', _props: { scope: 'col' } },
        { key: 'role', label: 'Role', _props: { scope: 'col' } },
        { key: 'gender', label: 'Gender', _props: { scope: 'col' } },
        { key: 'access', label: 'Access', _props: { scope: 'col' }, body: accessTemplate },
    ]
    useEffect(() => {

        fetchData();
        getCityD();
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
    const fetchData = async () => {
        let response = await getUsers("admin")
        if (response.success) {
            if (response.data) {

                setItems(response.data)
            }
        }
        setLoading1(false)
    }
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={
                        [
                            { label: 'Staff' },
                        ]
                    } home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="md:col-11" />

                <div className="md:col-1">
                    <Button label="Add Staff" onClick={() => setShowDialog(true)} />
                </div>
                <div className="col-12">
                    <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                </div>
            </div>
            <Dialog header="Add Staff" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                <form onSubmit={handleSubmit} className="p-fluid grid">

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="phone">Phone</label>
                        <InputText id="phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="address">Address</label>
                        <InputText id="address" value={formData.address.address} onChange={(e) => handleChange('address', { ...formData.address, address: e.target.value })} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="city">City</label>
                        <Dropdown value={selectedCity} options={city} onChange={(e) => {
                            setSelectedCity(e.value)
                            handleChange('address', { ...formData.address, city: e.target.value.code })
                        }} optionLabel="name" placeholder="Select a City" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="country">Country</label>
                        <InputText id="country" value={formData.address.country} onChange={(e) => { handleChange('address', { ...formData.address, country: e.target.value }) }} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="postalCode">Postal Code</label>
                        <InputText id="postalCode" value={formData.address.postalCode} onChange={(e) => handleChange('address', { ...formData.address, postalCode: e.target.value })} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="dob">DOB</label>
                        <InputText type="date" id="dob" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="joiningDate">Joining Date</label>
                        <InputText type="date" id="joiningDate" value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="staffId">Staff Verification Id Number</label>
                        <InputText id="staffId" value={formData.staffId} onChange={(e) => handleChange('staffId', e.target.value)} />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="staffShiftStartTime">Staff Shift Start Time</label>
                        <Calendar id="staffShiftStartTime" value={formData.staffShiftStartTime} onChange={(e) => handleChange('staffShiftStartTime', e.value)} showTime />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="staffShiftEndTime">Staff Shift End Time</label>
                        <Calendar id="staffShiftEndTime" value={formData.staffShiftEndTime} onChange={(e) => handleChange('staffShiftEndTime', e.value)} showTime />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="staffStatus">Staff Status</label>
                        <Dropdown options={[
                            { name: "On Duty", code: "On Duty" },
                            { name: "Leave", code: "Leave" },
                            { name: "Out of working hours", code: "Out of working hours" }
                        ]} value={formData.staffStatus} onChange={(e) => handleChange("staffStatus", e.value)} optionLabel="name" placeholder="Select Staff Status" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="staffVerificationId">Staff Verification Document Upload</label>
                        {formData.staffVerificationId == "" ? <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} /> : formData.staffVerificationId}
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="gender">Gender</label>
                        <Dropdown options={[
                            { name: "Male", code: "male" },
                            { name: "Female", code: "female" }
                        ]} value={selectedGender} onChange={(e) => handleChange("gender", e.value)} optionLabel="name" placeholder="Select Gender" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="password">Password</label>
                        <InputText id="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} type="password" />
                    </div>
                    <div className=" col-12 lg:col-12">
                        <label htmlFor="access">Access</label>
                        <div className=" grid">
                            <div className=" col-12 md:col-6">

                                <div className=" grid">
                                    <div className="col-3 mt-3">
                                        <label htmlFor="staff">Staff:  </label>
                                    </div>
                                    <SelectButton list={''} width={30} onChange={(e) => handleChange('access', { ...formData.access, staff: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.staff, code: formData.access.staff }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Customer:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, customer: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.customer, code: formData.access.customer }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Bikes:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, bikes: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.bikes, code: formData.access.bikes }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Stations:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, stations: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.stations, code: formData.access.stations }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Plans:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, plans: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.plans, code: formData.access.plans }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Services:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, services: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.service, code: formData.access.service }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Reports:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, reports: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.reports, code: formData.access.reports }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Bikes Stations:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, bikesStations: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.bikesStations, code: formData.access.bikesStations }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Coupons:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, coupons: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.coupons, code: formData.access.coupons }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">

                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Users:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, users: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.users, code: formData.access.users }}
                                        multiple={false} />
                                </div>
                            </div>
                            <div className=" col-12 md:col-6">
                                <div className=" grid mt-3">
                                    <div className="col-3">
                                        <label htmlFor="staff">Charger:</label>
                                    </div>
                                    <SelectButton width={30} onChange={(e) => handleChange('access', { ...formData.access, charger: e.value.code })} optionLabel="name" options={[
                                        { name: "View", code: "View" },
                                        { name: "Edit", code: "Edit" },
                                        { name: "None", code: "None" }
                                    ]} value={{ name: formData.access.charger, code: formData.access.charger }}
                                        multiple={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field col-12"></div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
            <Dialog header="Access" visible={showAccessDialog} style={{ width: '50vw' }} onHide={() => setShowAccessDialog(false)}>
                <>

                    <div className=" grid">
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">

                                <div className="col-3">
                                    <label htmlFor="staff">Staff:</label>
                                </div>
                                <SelectButton list={''} width={30} onChange={(e) => setAccessData({ ...accessData, staff: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.staff, code: accessData.staff }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Customer:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, customer: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.customer, code: accessData.customer }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Bikes:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, bikes: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.bikes, code: accessData.bikes }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Stations:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, stations: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.stations, code: accessData.stations }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Plans:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, plans: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.plans, code: accessData.plans }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Services:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, service: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.service, code: accessData.service }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Reports:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, reports: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.reports, code: accessData.reports }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Bikes Stations:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, bikesStations: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.bikesStations, code: accessData.bikesStations }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">

                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Coupons:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, coupons: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.coupons, code: accessData.coupons }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">
                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Users:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, users: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.users, code: accessData.users }}
                                    multiple={false} />
                            </div>
                        </div>
                        <div className=" col-12 md:col-6">
                            <div className=" grid mt-3">
                                <div className="col-3">
                                    <label htmlFor="staff">Charger:</label>
                                </div>
                                <SelectButton width={30} onChange={(e) => setAccessData({ ...accessData, charger: e.value.code })} optionLabel="name" options={[
                                    { name: "View", code: "View" },
                                    { name: "Edit", code: "Edit" },
                                    { name: "None", code: "None" }
                                ]} value={{ name: accessData.charger, code: accessData.charger }}
                                    multiple={false} />
                            </div>
                        </div>

                    </div>
                    <div className="field col-12"></div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" onClick={changeAccess} />
                    </div>
                </>
            </Dialog >
        </>

    )
}

export default Staff;