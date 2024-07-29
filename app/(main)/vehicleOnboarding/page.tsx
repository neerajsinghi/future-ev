'use client';

import { getBikeByStation, getBikeStand, getBikes, getBikesNearby, getStations, getStationsByID, getVehicleTypes, setBikeStand, updateBikeStand } from '@/app/api/iotBikes';
import { stat } from 'fs';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { createRef, RefObject, use, useCallback, useEffect, useRef, useState } from 'react';
import './plan.css';
import CustomTable from '../components/table';
import { Tag } from 'primereact/tag';
import QRCode from 'react-qr-code';
import { getCity } from '@/app/api/services';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/app/api/common';
import { InputSwitch } from 'primereact/inputswitch';
import Link from 'next/link';
import { ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

/*
City
Type
DeviceID
VehicleTypeID
StationID
Status
Description
InsuranceDate
InsurancePolicy
VehicleRegistration
PermitsRequired []
*/
interface BikesStationedProps {
    city: string;
    type: string;
    deviceID: string;
    vehicleTypeID: string;
    stationID: string;
    status: 'booked' | 'available' | 'damaged' | 'maintenance' | 'deployment' | '';
    insuranceDate: Date;
    insurancePolicy: string;
    vehicleRegistration: string;
    permitsRequired: string[];
}

const BikesStationed = ({ searchParams }: { searchParams: any }) => {
    const router = useRouter();
    const [items, setItems] = useState<any>([]);
    const [station, setStation] = useState<any[]>([]);
    const [devices, setDevices] = useState<{ name: string; code: string }[]>([]);
    const [vehicleType, setVehicleType] = useState<{ name: string; code: string }[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [selectedStation, setSelectedStation] = useState<any>(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState<any>('Normal');
    const [cityBasedVehicleType, setCityBasedVehicleType] = useState<any>(null);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [progresspercent, setProgresspercent] = useState(0);
    const qrcodeRefs = useRef<{ [key: string]: RefObject<any> }>({});
    const [formData, setFormData] = useState<BikesStationedProps>({
        city: '',
        type: '',
        deviceID: '',
        vehicleTypeID: '',
        stationID: '',
        status: '',
        insuranceDate: new Date(),
        insurancePolicy: '',
        vehicleRegistration: '',
        permitsRequired: []
    });

    const statusVehicleNameTemplate = (rowData: any) => {
        return <Tag value={rowData?.vehicleType?.name} />;
    };
    const statusDeviceNameTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.name}</div>;
    };
    const statusDeviceBatteryLevelTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.batteryLevel}</div>;
    };
    const statusDeviceIgnitionTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.ignition}</div>;
    };
    const statusDeviceSpeedTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.speed}</div>;
    };
    const statusDeviceStatusTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.status}</div>;
    };
    const statusDeviceTotalDistanceTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.totalDistance}</div>;
    };
    const statusDeviceTypeTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.type}</div>;
    };
    const statusDeviceValidTemplate = (rowData: any) => {
        return <div>{rowData?.deviceData?.valid}</div>;
    };

    const ImmobiliseToggleTemplate = (rowData: any) => {
        const immobolise = async () => {
            let response = await fetch(`https://futureev.trestx.com/api/v1/vehicle/immobilize/${rowData.deviceId}`);
            let data = await response.json();
            if (data.status) {
                router.refresh();
            }
            console.log(data);
            return data;
        };
        return (
            <InputSwitch
                checked={rowData?.immobilized || false}
                onClick={() => {
                    immobolise();
                }}
            />
        );
    };

    const vehicleIdTemplate = (rowData: any) => {
        return <Link href={`/vehicleOnboarding/${rowData.deviceId}`}>{rowData?.id}</Link>;
    };

    const statusStationNameTemplate = (rowData: any) => {
        console.log(rowData);
        return <div>{rowData?.station?.name}</div>;
    };

    const downloadQRCode = (qrRef: RefObject<any>, id: string) => async (e: any) => {
        const svgElement = qrRef?.current?.querySelector('svg');

        // Convert SVG to PNG using a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgBlob = new Blob([new XMLSerializer().serializeToString(svgElement)], { type: 'image/svg+xml' });
        const img = new Image();
        img.src = URL.createObjectURL(svgBlob);

        // Wait for the image to load
        await new Promise((resolve) => (img.onload = resolve));

        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);

        // Get the PNG data URL and trigger download
        const pngDataUrl = canvas.toDataURL('image/png');

        const anchor = document.createElement('a');
        anchor.href = pngDataUrl;
        anchor.download = id + '.png'; // Changed extension
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const qrCodeTemplate = (rowData: any) => {
        if (!qrcodeRefs.current[rowData?.deviceData?.deviceId]) {
            qrcodeRefs.current[rowData?.deviceData?.deviceId] = createRef();
        }
        return rowData.deviceId ? (
            <div style={{ height: 'auto', margin: '0 auto', maxWidth: 64, width: '100%' }} ref={qrcodeRefs.current[rowData?.deviceData?.deviceId]}>
                <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={rowData?.deviceId?.toString()} viewBox={`0 0 256 256`} />
                <Button text style={{ padding: '0px' }} onClick={downloadQRCode(qrcodeRefs?.current[rowData?.deviceData?.deviceId], rowData?.deviceData?.deviceId?.toString())}>
                    {' '}
                    Download{' '}
                </Button>
            </div>
        ) : null;
    };

    const cellEditor = (options: ColumnEditorOptions) => {
        return (
            <Dropdown
                options={[
                    { name: 'Booked', code: 'booked' },
                    { name: 'Available', code: 'available' },
                    { name: 'Damaged', code: 'damaged' },
                    { name: 'Under Maintenance', code: 'maintenance' },
                    { name: 'Ready For Deployment', code: 'deployment' }
                ]}
                value={{ name: options.rowData.status.charAt(0).toUpperCase() + options.rowData.status.slice(1), code: options.rowData.status }}
                onChange={(e) => options?.editorCallback && options.editorCallback(e.value.code)}
                optionLabel="name"
                placeholder="Select a Status"
            />
        );
    };

    const onCellEditComplete = async (e: ColumnEvent) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        const body = {
            [field]: newValue
        };
        const response = await updateBikeStand(body, rowData.id);
        if (response.success) {
            router.refresh();
            //  fetchData();
        }
    };

    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' }, body: vehicleIdTemplate, filterField: 'id' },
        { key: 'vehicleType', label: 'Vehicle Type', _props: { scope: 'col' }, body: statusVehicleNameTemplate, filterField: 'vehicleType.name' },
        { key: 'deviceName', label: 'Device Name', _props: { scope: 'col' }, body: statusDeviceNameTemplate, filterField: 'deviceData.name' },
        { key: 'deviceId', label: 'Immobolise Vehicle', _props: { scope: 'col' }, body: ImmobiliseToggleTemplate, filterField: 'immobilized' },
        { key: 'deviceBatteryLevel', label: 'Battery Level', _props: { scope: 'col' }, body: statusDeviceBatteryLevelTemplate, filterField: 'deviceData.batteryLevel' },
        { key: 'deviceSpeed', label: 'Speed', _props: { scope: 'col' }, body: statusDeviceSpeedTemplate },
        { key: 'deviceTotalDistance', label: 'Total Distance', _props: { scope: 'col' }, body: statusDeviceTotalDistanceTemplate, filterField: 'deviceData.totalDistance' },
        { key: 'deviceType', label: 'Type', _props: { scope: 'col' }, body: statusDeviceTypeTemplate, filterField: 'deviceData.type' },
        { key: 'deviceQR', label: 'Device QR', _props: { scope: 'col' }, body: qrCodeTemplate, filterField: 'deviceData.deviceId' },
        { key: 'stationName', label: 'Station Name', _props: { scope: 'col' }, body: statusStationNameTemplate, filterField: 'station.name' },
        { key: 'status', label: 'Status', _props: { scope: 'col' }, cellEditor: cellEditor, onCellEditComplete: onCellEditComplete }
    ];

    const getAStations = async () => {
        const response = await getStations();
        if (response.success && response.data) {
            const stations = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i]['address']['city'] === selectedCity) {
                    console.log(response.data[i]['address']);
                    // Correct comparison with selectedCity
                    stations.push({
                        name: response.data[i]['name'],
                        code: response.data[i]['id'],
                        location: response.data[i]['location'],
                        city: response.data[i]['address']['city']
                    });
                }
            }
            console.log(stations);
            setStation(stations); // Use setItems to update the state with the filtered stations
        }
        setLoading1(false);
    };

    const getAVehicleTypes = async () => {
        const response = await getVehicleTypes();
        if (response.success) {
            const vehicleTypes = [];
            for (let i = 0; i < response.data.length; i++) {
                vehicleTypes.push({ name: response.data[i]['name'], code: response.data[i]['id'] });
            }
            setVehicleType(vehicleTypes);
        }
        setLoading1(false);
    };
    const fetchCities = async () => {
        const data: any = [];
        const response = await getCity();
        if (response.success && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                data.push({ name: response.data[i].name, code: response.data[i].name, vehicleType: response.data[i].vehicleType });
            }

            setCities(() => data);
        }
    };

    useEffect(() => {
        // console.log(cities.filter((item));
    }, [selectedCity]);

    const fetchBikesCallback = useCallback(async () => {
        if (searchParams && searchParams.search) {
            const response = await getBikeByStation(searchParams.search);
            if (response.success && response.data) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i]['stationId']) {
                        const resp = await getStationsByID(response.data[i]['stationId']);
                        if (resp.success && resp.data) {
                            response.data[i]['station'] = resp.data;
                        }
                    }
                }
                setItems([...response.data]);
            }
            setLoading1(false);
            return;
        }
        const response = await getBikeStand();
        if (response.success && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i]['stationId']) {
                    const resp = await getStationsByID(response.data[i]['stationId']);
                    if (resp.success && resp.data) {
                        response.data[i]['station'] = resp.data;
                    }
                }
            }
            setItems([...response.data]);
        }
        setLoading1(false);
    }, [searchParams]);
    useEffect(() => {
        fetchBikes();
        getAVehicleTypes();
        getCity();
    }, [fetchBikesCallback]);
    useEffect(() => {
        if (selectedCity) {
            getAStations();
        }
    }, [selectedCity]);

    const handleChange = async (name: keyof BikesStationedProps, value: any) => {
        let valueL = '';
        if (name === 'vehicleTypeID') {
            setSelectedVehicleType(value);
            valueL = value.code;
        } else if (name === 'city') {
            setSelectedCity(value);
            valueL = value.code;
        } else if (name === 'stationID') {
            setDevices([]);
            setSelectedStation(value);
            const selectedBikes = [];
            for (let i = 0; i < items.length; i++) {
                selectedBikes.push(items[i].deviceId);
            }
            const response = await getBikes();
            if (response.success && response.data) {
                console.log(response.data);
                const devices = [];
                for (let i = 0; i < response.data.length; i++) {
                    if (selectedBikes.includes(response.data[i]['deviceId'])) {
                        continue;
                    }
                    devices.push({ name: response.data[i]['name'], code: response.data[i]['deviceId'] });
                }
                setDevices(devices);
                valueL = value.code;
            }
        } else if (name === 'deviceID') {
            setSelectedDevice(value);
            valueL = value.code;
        } else if (name === 'status') {
            setSelectedStatus(value);
            valueL = value.code;
        } else {
            valueL = value;
        }

        setFormData({ ...formData, [name]: valueL });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        const response = await setBikeStand(formData);
        if (response.success && response.data) {
            setShowDialog(false);
            fetchBikes();
        } else {
            console.log('Failed');
        }
    };
    const fetchBikes = async () => {
        if (searchParams && searchParams.search) {
            const response = await getBikeByStation(searchParams.search);
            if (response.success && response.data) {
                setItems([...response.data]);
            }
            setLoading1(false);
            return;
        }
        const response = await getBikeStand();
        if (response.success && response.data) {
            setItems([...response.data]);
        }
        setLoading1(false);
    };
    const onUpload = async (e: any, name: string, multiple: boolean) => {
        debugger;
        if (!multiple) {
            const file = e.files[0];

            if (!file) return;

            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgresspercent(progress);
                },
                (error) => {
                    alert(error);
                },
                () => {
                    debugger;
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFormData({ ...formData, [name]: downloadURL });
                    });
                }
            );
        } else if (multiple && name === 'permitsRequired') {
            const urls = [];
            for (let i = 0; i < e.files.length; i++) {
                const file = e.files[i];
                debugger;
                if (!file) return;

                const storageRef = ref(storage, `files/${file.name}`);
                const uploadTask = await uploadBytesResumable(storageRef, file);
                const val = await getDownloadURL(uploadTask.ref);
                urls.push(val);
            }
            setFormData({ ...formData, [name]: urls });
        }
    };
    useEffect(() => {
        fetchCities();
        // getAVehicleTypes();
        // getAStations();
    }, [formData.permitsRequired]);

    useEffect(() => {
        let res = cities?.filter((city) => city.name === selectedCity);
        setCityBasedVehicleType(res);
    }, [cities, selectedCity]);
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'BikeStation' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Onboard Vehicle" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                    </div>
                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={"cell"} columns2={[]} columns={columns} items={items} loading1={loading1} />{' '}
                    </div>
                </div>
            </div>

            <Dialog
                header="Onboard Vehicle"
                visible={showDialog}
                style={{ width: '50vw' }}
                modal
                onHide={() => {
                    setShowDialog(false);
                }}
            >
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="name">City</label>
                        <Dropdown value={selectedCity} options={cities.map((city) => city.name)} onChange={(e) => handleChange('city', e.value)} placeholder="Select a City" />
                    </div>

                    <div className="field col-12 lg:col-6">
                        <label htmlFor="VehicleTypeID">Vehicle Type ID</label>
                        <Dropdown
                            id="VehicleTypeID"
                            // defaultValue="Normal"
                            // disabled
                            value={selectedVehicleType}
                            options={selectedCity ? cityBasedVehicleType : vehicleType}
                            onChange={(e) => handleChange('vehicleTypeID', e.value)}
                            optionLabel={selectedCity ? 'vehicleType' : 'name'}
                            placeholder="Select a Vehicle Type"
                            filterBy="name"
                        />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="StationID">Station ID</label>
                        <Dropdown id="StationID" options={station} value={selectedStation} onChange={(e) => handleChange('stationID', e.value)} optionLabel="name" placeholder="Select a Station" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="DeviceID">Device ID</label>
                        <Dropdown id="DeviceID" options={devices} value={selectedDevice} onChange={(e) => handleChange('deviceID', e.value)} optionLabel="name" placeholder="Select a Device" />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="Status">Status</label>

                        <Dropdown
                            id="Status"
                            options={[
                                { name: 'Booked', code: 'booked' },
                                { name: 'Available', code: 'available' },
                                { name: 'Damaged', code: 'damaged' },
                                { name: 'Under Maintenance', code: 'maintenance' },
                                { name: 'Ready For Deployment', code: 'deployment' }
                            ]}
                            value={selectedStatus}
                            onChange={(e) => handleChange('status', e.value)}
                            optionLabel="name"
                            placeholder="Select a Status"
                        />
                    </div>

                    {/* 
                    insuranceDate: Date; Calendar   
                    insurancePolicy: string; upload file
                    vehicleRegistration: string;upload file
                                    permitsRequired: string[];upload files */}
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="insuranceDate">Insurance Date</label>
                        <Calendar id="insuranceDate" value={formData.insuranceDate} onChange={(e) => handleChange('insuranceDate', e.value)} />
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="insurancePolicy">Insurance Policy</label>
                        {formData.insurancePolicy == '' ? (
                            <FileUpload
                                id="insurancePolicy"
                                customUpload
                                mode={'basic'}
                                auto
                                uploadHandler={(e) => {
                                    onUpload(e, 'insurancePolicy', false);
                                }}
                                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                                multiple={false}
                            />
                        ) : (
                            <div>Uploaded</div>
                        )}
                    </div>
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="vehicleRegistration">Vehicle Registration</label>
                        {formData.vehicleRegistration == '' ? (
                            <FileUpload
                                id="vehicleRegistration"
                                mode={'basic'}
                                customUpload
                                auto
                                uploadHandler={(e) => {
                                    onUpload(e, 'vehicleRegistration', false);
                                }}
                                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                                multiple={false}
                            />
                        ) : (
                            <div>Uploaded</div>
                        )}
                    </div>
                    <div className="field col-12 lg:6">
                        <label htmlFor="permitsRequired">Permits Required</label>
                        {formData.permitsRequired.length <= 0 ? (
                            <FileUpload
                                id="permitsRequired"
                                customUpload
                                uploadHandler={(e) => {
                                    onUpload(e, 'permitsRequired', true);
                                }}
                                multiple
                                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                            />
                        ) : (
                            <div>Uploaded</div>
                        )}
                    </div>
                    <div className=" button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default BikesStationed;
