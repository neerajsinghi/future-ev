'use client';

import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import CustomTable from '../components/table';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import './plan.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { setStation, getStations, getUsers, updateStation, getServices } from '@/app/api/iotBikes';
import Link from 'next/link';
import { Tag } from 'primereact/tag';

import { Toast } from 'primereact/toast';

import { getCity } from '@/app/api/services';
import { MultiSelect } from 'primereact/multiselect';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { ColumnEditorOptions, ColumnEvent, ColumnFilterElementTemplateOptions } from 'primereact/column';
import useIsAccessible from '@/app/hooks/isAccessible';
import { StandaloneSearchBox } from '@react-google-maps/api';

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
interface PlaceResultExtended extends google.maps.places.PlaceResult {
    // Add any custom properties here if needed
}
const Stations = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc',
        libraries: ['places']
    });
    const router = useRouter();
    const [searchStation, setSearchStation] = useState('');
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const stationId = searchParams.get('stationId');
    const [items, setItems] = useState<any>([]);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const [selectedCity, setSelectedCity] = useState<any[]>([]);
    const [serviceType, setServiceType] = useState<serviceTypes[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [markers, setMarkers] = useState<any>();
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.209 });
    const [zoom, setZoom] = useState<number>(12);
    const isAccessible = useIsAccessible('stations');
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
    const [searchBox, setSearchBox] = useState<any>();
    const [searchPredictions, setSearchPredictions] = useState<PlaceResultExtended[]>([]);

    const onPlacesChanged = useCallback(() => {
        if (searchBox) {
            debugger
            const places = searchBox.getPlaces() as PlaceResultExtended[];
            setSearchPredictions(places); // Update the dropdown with predictions
        }
    }, [searchBox]);


    const handlePlaceSelect = useCallback(
        (place: PlaceResultExtended) => {
            debugger
            if (place.geometry && place.geometry.location) {
                setMarkers(place.geometry.location);

                const form = { ...formData };
                form.location.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];
                setFormData(form);
            }

            setSearchPredictions([]); // Clear predictions after selection
        },
        [formData, setFormData]
    );
    const libraries = ["places"];

    const toast = useRef<any>(null);

    const showToast = (info: string, severity: 'info' | 'danger' | 'warning') => {
        toast?.current?.show({ severity: 'danger', summary: info, detail: '' });
    };

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
            setFormData({ ...formData, [name]: value.id });
        } else if (name === 'servicesAvailable') {
            console.log(value);
            setSelectedServices(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const changeCenter = (selectedCity: string) => {
        const selectedCityObject = city.find((place: { name: any }) => place.name === selectedCity);
        if (selectedCityObject && selectedCityObject.locationPolygon.coordinates.length > 0) {
            const coordinates = selectedCityObject.locationPolygon.coordinates[0];
            let centerCoordinates: any | undefined;

            // Handle different structures of coordinates (single set or nested arrays)
            if (Array.isArray(coordinates[0])) {
                centerCoordinates = coordinates[0][0]; // Assuming the first set of coordinates
            } else {
                centerCoordinates = coordinates[0];
            }

            if (centerCoordinates) {
                setCenter({ lat: centerCoordinates[1], lng: centerCoordinates[0] });
                setZoom(11); // Adjust zoom level as needed
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        // console.log(formData);
        formData.servicesAvailable.push(...selectedServices);
        const response = await setStation(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchData();
            // router.refresh();
        } else {
            console.log('Failed');
            showToast(response.message, 'danger');
        }
    };

    const getCityD = async () => {
        let response = await getCity();
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ code: response.data[i].name, ...response.data[i] });
                }
                setCity(() => data);
            }
        }
    };
    const getUserD = async () => {
        let response = await getUsers('admin');
        if (response.success) {
            if (response.data) {
                const data: any[] = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push({ code: response.data[i].name, ...response.data[i] });
                }
                setUsers(() => data);
            }
        }
    };

    const fetchData = async () => {
        getCityD();
        getUserD();
        let userIdL = userId ? userId : '';
        let stationIdL = stationId ? stationId : '';
        const response = await getStations(userIdL, stationIdL);
        if (response.success && response.data) {
            const data: any[] = [];

            for (let i = 0; i < response.data.length; i++) {
                response.data[i].superVisorName = response.data[i].supervisor.name;
                data.push(response.data[i]);
            }
            console.log(data);
            setItems(data);
        }

        setLoading1(false);
    };

    const getAvailableServiceTypes = async () => {
        const response = await getServices();
        if (response.data && response.success) {
            setServiceType(response.data);
        }
    };

    useEffect(() => {
        fetchData();
        getAvailableServiceTypes();
    }, []);
    const statusAddressTemplate = (rowData: any) => {
        console.log(rowData);
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
                            pathname: '/vehicleOnboarding',
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

    const cellEditor = (options: ColumnEditorOptions) => {
        return stationCellEditor(options);
    };

    const onCellEditComplete = async (e: any) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        const body = {
            [field]: newValue
        };
        const response = await updateStation(rowData.id, body);
        if (response.success) {
            fetchData();
        }
    };

    const stationCellEditor = (options: any) => {
        console.log(options);
        return (
            <MultiSelect
                value={options.value}
                options={[
                    { name: 'ride now', code: 'hourly' },
                    { name: 'rental', code: 'rental' },
                    { name: 'charging', code: 'charging' },
                    { name: 'eCar', code: 'eCar' }
                ]}
                onChange={(e) => {
                    e.preventDefault();
                    options?.editorCallback && options.editorCallback(e.value);
                }}
                optionLabel="name"
                optionValue="code"
                onKeyDown={(e) => e.stopPropagation()}
            />
        );
    };

    const statusTemplate = (rowData: any) => {
        return (
            <Button tooltip="Click to change status" severity={rowData.status === 'available' ? 'success' : 'danger'} onClick={() => changeStatus(rowData.status === 'available' ? 'unavailable' : 'available', rowData.id)}>
                {rowData.status ? rowData.status.toUpperCase() : 'NA'}
            </Button>
        );
    };
    // const ViewStationOnMap = (rowData: any) => {
    //     return <i onClick={(e) => router.push(`/stations/${rowData.id}`)} className="pi pi-map-marker map-icon" style={{ fontSize: '1.5em' }}></i>;
    // };
    //public template
    const statusPublicTemplate = (rowData: any) => {
        return (
            <Button tooltip="Click to change public status" severity={rowData.public ? 'success' : 'danger'} onClick={() => changePublic(!rowData.public, rowData.id)}>
                {rowData.public ? 'Yes' : 'No'}
            </Button>
        );
    };

    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <MultiSelect
                value={options.value}
                options={serviceType}
                onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
                itemTemplate={statusItemTemplate}
                placeholder="Select One"
                className="p-column-filter"
                showClear
            />
        );
    };

    const columns = [
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'shortName', label: 'Short Name', _props: { scope: 'col' } },
        {
            key: 'servicesAvailable',
            label: 'Service',
            _props: { scope: 'col', className: 'column-serviceType' },
            body: (rowData: any) => (rowData.servicesAvailable ? rowData.servicesAvailable.join(', ') : 'NA'),
            cellEditor: cellEditor,
            onCellEditComplete: onCellEditComplete
        },
        { key: 'address', label: 'Address', _props: { scope: 'col' }, body: statusAddressTemplate },
        { key: 'city', label: 'City', _props: { scope: 'col' }, body: statusCityTemplate, filterField: 'address.city' },
        { key: 'long', label: 'Longitude', _props: { scope: 'col' }, body: statusLongTemplate, filterField: 'location.coordinates[0]' },
        { key: 'lat', label: 'Latitude', _props: { scope: 'col' }, body: statusLatTemplate, filterField: 'location.coordinates[1]' },
        { key: 'group', label: 'Group', _props: { scope: 'col' } },
        { key: 'superVisorName', label: 'Supervisor Name', _props: { scope: 'col' } },
        { key: 'stock', label: 'Stock', _props: { scope: 'col' }, body: statusStockTemplate },
        { key: 'status', label: 'Status', _props: { scope: 'col' }, body: statusTemplate }
        // { key: 'viewOnMap', label: 'ViewMap', _props: { scope: 'col' }, body: ViewStationOnMap }
    ];
    const onMapClick = (event: any) => {
        setMarkers({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
        const form = { ...formData };
        form.location.coordinates = [event.latLng.lng(), event.latLng.lat()];
        setFormData(form);
    };

    useEffect(() => {
        console.log(items);
    }, [selectedServices]);
    return (
        <>
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {(isAccessible === 'Edit' || isAccessible === 'View') && (
                <div className="grid">
                    <Toast ref={toast} />
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
                            <CustomTable tableName="stations" mapNavigatePath="/stations/viewStationOnMap" editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                        </div>
                    </div>
                </div>
            )}

            {/* // * Dialog to add Stations */}
            {isAccessible === 'Edit' && (
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
                            <MultiSelect
                                value={selectedServices}
                                options={[
                                    { name: 'ride now', code: 'hourly' },
                                    { name: 'rental', code: 'rental' },
                                    { name: 'charging', code: 'charging' },
                                    { name: 'eCar', code: 'eCar' }
                                ]}
                                onChange={(e) => handleChange('servicesAvailable', e.value)}
                                optionLabel="name"
                                optionValue="code"
                            />
                        </div>
                        {/* Address Fields */}
                        <div className="col-12">
                            <h4>Address</h4>
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
                                filter
                                id="address.city"
                                value={selectedCity}
                                options={city}
                                onChange={(e) => {
                                    setSelectedCity(e.value);
                                    changeCenter(e.value.code);
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

                        <div className="field col-12">
                            <label htmlFor="address.address">Address Line</label>
                            <InputTextarea id="address.address" value={formData.address.address} onChange={(e) => handleChange('address.address', e.target.value)} />
                        </div>
                        {/* Location Fields */}
                        {selectedCity && (
                            <>


                                <div className="col-12">
                                    <h4 className="col-12">Location</h4>
                                    <InputText onChange={(e) => setSearchStation(e.target.value)} className="col-12" placeholder="Search Station" id="Search" />
                                </div>
                                {/* ... (fields for coordinates, other fields for group, supervisorID, stock, public, status) */}
                                <div className="field col-12 md:col-12">
                                    {isLoaded && (
                                        <>
                                            <div>    <StandaloneSearchBox onLoad={(ref) => setSearchBox(ref)} onPlacesChanged={onPlacesChanged}>
                                                <InputText type="text" placeholder="Search for places" />
                                            </StandaloneSearchBox>
                                                {/* Dropdown for location suggestions */}
                                                {searchPredictions.length > 0 && (
                                                    <Dropdown
                                                        style={{ zIndex: 1000 }}
                                                        value={searchPredictions[0]}
                                                        options={searchPredictions}
                                                        onChange={(e) => { handlePlaceSelect(e.value as PlaceResultExtended) }}
                                                        optionLabel="formatted_address"
                                                        placeholder="Select a Location"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <GoogleMap
                                                    mapContainerStyle={{ width: '100%', height: '400px' }}
                                                    center={center} // Initial map center (adjust)
                                                    zoom={zoom}
                                                    onClick={onMapClick}
                                                >
                                                    <MarkerF position={markers} />
                                                </GoogleMap>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ... (fields for group, supervisorID, stock, public, status) */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="group">Group</label>
                            <InputText id="group" value={formData.group} onChange={(e) => handleChange('group', e.target.value)} />
                        </div>
                        {/* ... (fields for supervisorID, stock, public, status) */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="supervisorID">Supervisor ID</label>
                            <Dropdown filter id="supervisorID" value={selectedUser} options={users} onChange={(e) => handleChange('supervisorID', e.value)} optionLabel="name" optionValue='id' placeholder="Select a Supervisor" />
                        </div>
                        {/* ... (submit button) */}
                        <div className="field col-12 button-row w-full">
                            <Button label="Submit" type="submit" className="px-5 py-2 w-full" />
                        </div>
                    </form>
                </Dialog >
            )}
        </>
    );
};

export default Stations;
