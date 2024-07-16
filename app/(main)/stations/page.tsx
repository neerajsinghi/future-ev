'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import CustomTable from '../components/table';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import './plan.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { setStation, getStations, getUsers, updateStation } from '@/app/api/iotBikes';
import Link from 'next/link';
import { Tag } from 'primereact/tag';
import { getCity } from '@/app/api/services';
import { MultiSelect } from 'primereact/multiselect';
import { useRouter } from 'next/navigation';

/*
Name
Description
ShortName
Address
Location
Active
Group
SupervisorID
Stock
Public
Status
ServicesAvailable
*/
interface StationFormData {
    name: string;
    description: string;
    shortName: string;
    address: Address;
    location: Location;
    active: boolean;
    group: string;
    supervisorID: string;
    stock: number;
    public: boolean;
    status: string;
    servicesAvailable: string[];
}
interface Address {
    address: string;
    country: string;
    pin: string;
    city: string;
    state: string;
}
interface Location {
    type: string;
    coordinates: number[]; // [longitude, latitude]
}
const Stations = () => {
    const router = useRouter();
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    // const [column2, setColumn2] = useState<any>([
    //     { key: "vehicletype", label: "Vehicle Type", _props: { scope: 'col' } },
    //     { key: "name", label: "Name", _props: { scope: 'col' } },
    //     { key: "price", label: "Price", _props: { scope: 'col' } },
    //     { key: "batteryLevel", label: "Battery Level", _props: { scope: 'col' } },
    //     { key: "deviceId", label: "Device Id", _props: { scope: 'col' } },
    //     { key: "deviceImei", label: "Device Imei", _props: { scope: 'col' } },
    //     { key: "ignition", label: "Ignition", _props: { scope: 'col' } },
    //     { key: "posId", label: "Pos Id", _props: { scope: 'col' } },
    //     { key: "speed", label: "Speed", _props: { scope: 'col' } },
    //     { key: "status", label: "Status", _props: { scope: 'col' } },
    //     { key: "totalDistance", label: "Total Distance", _props: { scope: 'col' } },
    //     { key: "type", label: "Type", _props: { scope: 'col' } },
    //     { key: "valid", label: "Valid", _props: { scope: 'col' } },
    // ])
    const [formData, setFormData] = useState<StationFormData>({
        name: '',
        description: '',
        shortName: '',
        address: {
            address: '',
            country: '',
            pin: '',
            city: '',
            state: ''
        },
        location: {
            type: 'Point',
            coordinates: [0, 0]
        },
        active: true,
        group: '',
        supervisorID: '',
        stock: 0,
        public: true,
        status: 'available',
        servicesAvailable: []
    });
    const handleChange = (name: string, value: any) => {
        if (name.startsWith('address.')) {
            setFormData({
                ...formData,
                address: { ...formData.address, [name.substring(8)]: value }
            });
        } else if (name.startsWith('location.')) {
            const form = { ...formData };
            form.location.coordinates = [...form.location.coordinates];
            if (name === 'location.coordinates[0]') {
                form.location.coordinates[0] = value;
            }
            if (name === 'location.coordinates[1]') {
                form.location.coordinates[1] = value;
            }
            setFormData(form);
        } else if (name === 'supervisorID') {
            setSelectedUser(value);
            setFormData({ ...formData, [name]: value.code });
        } else if (name === 'servicesAvailable') {
            setSelectedServices(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        console.log(formData);
        for (let i = 0; i < selectedServices.length; i++) {
            if (selectedServices[i].name === 'ride now') {
                formData.servicesAvailable.push('hourly');
                return;
            }
            formData.servicesAvailable.push(selectedServices[i].name);
        }
        const response = await setStation(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchData();
        } else {
            console.log('Failed');
        }
    };
    const getCityD = async () => {
        let response = await getCity();
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ name: response.data[i].name, code: response.data[i].name });
                }
                setCity(() => data);
            }
        }
    };
    const fetchData = async () => {
        getCityD();
        const response1 = await getUsers('admin');
        if (response1.success && response1.data) {
            const data = [];
            for (let i = 0; i < response1.data.length; i++) {
                if (response1.data[i].role === 'admin' || response1.data[i].role === 'staff') {
                    data.push({ name: response1.data[i].name, code: response1.data[i].id });
                }
            }
            setUsers(data);
        }
        const response = await getStations();
        if (response.success && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].superVisorName = await response1.data.find((item: any) => item.id === response.data[i].supervisorID)?.name;
            }
            setItems(response.data);
        }

        setLoading1(false);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const statusAddressTemplate = (rowData: any) => {
        return <div>{rowData.address.address}</div>;
    };
    const statusCityTemplate = (rowData: any) => {
        return <div>{rowData.address.city}</div>;
    };
    const statusLongTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[0]}</div>;
    };
    const statusLatTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[1]}</div>;
    };
    const statusStockTemplate = (rowData: any) => {
        const id = rowData.id;
        return (
            <div>
                {rowData.stock ? (
                    <Link
                        href={{
                            pathname: '/bikesStationed',
                            query: {
                                search: id
                            }
                        }}
                    >
                        {rowData.stock}
                    </Link>
                ) : (
                    0
                )}
            </div>
        );
    };
    const changePublic = async (status: boolean, id: string) => {
        const body: any = {
            public: status
        };
        const response = await updateStation(id, body);
        if (response.success) {
            fetchData();
        }
    };
    const changeStatus = async (status: string, id: string) => {
        const body: any = {
            status: status
        };
        const response = await updateStation(id, body);
        if (response.success) {
            fetchData();
        }
    };
    const statusTemplate = (rowData: any) => {
        return (
            <Button tooltip="Click to change status" severity={rowData.status === 'available' ? 'success' : 'danger'} onClick={() => changeStatus(rowData.status === 'available' ? 'unavailable' : 'available', rowData.id)}>
                {rowData.status}
            </Button>
        );
    };
    const ViewStationOnMap = (rowData: any) => {
        return <i onClick={(e) => router.push(`/stations/${rowData.id}`)} className="pi pi-map-marker map-icon" style={{ fontSize: '1.5em' }}></i>;
    };
    //public template
    const statusPublicTemplate = (rowData: any) => {
        return (
            <Button tooltip="Click to change public status" severity={rowData.public ? 'success' : 'danger'} onClick={() => changePublic(!rowData.public, rowData.id)}>
                {rowData.public ? 'Yes' : 'No'}
            </Button>
        );
    };
    const columns = [
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'shortName', label: 'Short Name', _props: { scope: 'col' } },
        { key: 'address', label: 'Address', _props: { scope: 'col' }, body: statusAddressTemplate },
        { key: 'city', label: 'City', _props: { scope: 'col' }, body: statusCityTemplate },
        { key: 'long', label: 'Longitude', _props: { scope: 'col' }, body: statusLongTemplate },
        { key: 'lat', label: 'Latitude', _props: { scope: 'col' }, body: statusLatTemplate },
        { key: 'group', label: 'Group', _props: { scope: 'col' } },
        { key: 'superVisorName', label: 'Supervisor Name', _props: { scope: 'col' } },
        { key: 'stock', label: 'Stock', _props: { scope: 'col' }, body: statusStockTemplate },
        { key: 'status', label: 'Status', _props: { scope: 'col' }, body: statusTemplate },
        { key: 'viewOnMap', label: 'ViewMap', _props: { scope: 'col' }, body: ViewStationOnMap }
    ];

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'Station' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Station" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                    </div>
                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                    </div>
                </div>
            </div>

            {/* // * Dialog to add Stations */}

            <Dialog header="Add Station" visible={showDialog} style={{ width: '50vw', color: 'white' }} onHide={() => setShowDialog(false)}>
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="shortName">Short Name</label>
                        <InputText id="shortName" value={formData.shortName} onChange={(e) => handleChange('shortName', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="service">Services Available</label>
                        <MultiSelect value={selectedServices} options={['ride now', 'rental', 'charging', 'eCar']} onChange={(e) => handleChange('servicesAvailable', e.value)} />
                    </div>
                    {/* Address Fields */}
                    <div className="field col-12"></div>
                    <div className="field col-12">
                        <h4>Address</h4>
                    </div>
                    <div className="field col-12"></div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.address">Address Line</label>
                        <InputTextarea id="address.address" value={formData.address.address} onChange={(e) => handleChange('address.address', e.target.value)} />
                    </div>
                    {/* ... (other address fields - country, pin, city, state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.country">Country</label>
                        <InputText id="address.country" value={formData.address.country} onChange={(e) => handleChange('address.country', e.target.value)} />
                    </div>
                    {/* ... (other address fields - pin, city, state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.pin">Pin</label>
                        <InputText id="address.pin" value={formData.address.pin} onChange={(e) => handleChange('address.pin', e.target.value)} />
                    </div>
                    {/* ... (other address fields - city, state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.city">City</label>
                        <Dropdown
                            id="address.city"
                            value={selectedCity}
                            options={city}
                            onChange={(e) => {
                                setSelectedCity(e.value);
                                handleChange('address.city', e.value.code);
                            }}
                            optionLabel="name"
                            placeholder="Select a City"
                        />
                    </div>

                    {/* ... (other address fields - state) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address.state">State</label>
                        <InputText id="address.state" value={formData.address.state} onChange={(e) => handleChange('address.state', e.target.value)} />
                    </div>

                    {/* Location Fields */}
                    <div className="field col-12"></div>

                    <div className="field col-12">
                        <h4>Location</h4>
                    </div>
                    <div className="field col-12"></div>

                    {/* ... (fields for coordinates, other fields for group, supervisorID, stock, public, status) */}
                    {/* <div className="field col-12 md:col-12">
                        {isLoaded && (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '400px' }}
                                center={{ lat: 28.607375879782598, lng: 77.22906196175623 }} // Initial map center (adjust)
                                zoom={10}
                                onClick={onMapClick}
                            >
                                <MarkerF position={markers} />
                            </GoogleMap>
                        )}
                    </div> */}
                    <div className="field col-12"></div>

                    {/* ... (fields for group, supervisorID, stock, public, status) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="group">Group</label>
                        <InputText id="group" value={formData.group} onChange={(e) => handleChange('group', e.target.value)} />
                    </div>
                    {/* ... (fields for supervisorID, stock, public, status) */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="supervisorID">Supervisor ID</label>
                        <Dropdown id="supervisorID" value={selectedUser} options={users} onChange={(e) => handleChange('supervisorID', e.value)} optionLabel="name" placeholder="Select a Supervisor" />
                    </div>
                    {/* ... (submit button) */}
                    <div className="field col-12"></div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default Stations;
