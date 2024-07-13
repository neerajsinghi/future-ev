'use client';

import { getBikeByStation, getBikeStand, getBikesNearby, getStations, getStationsByID, getVehicleTypes, setBikeStand } from "@/app/api/iotBikes";
import { stat } from "fs";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { createRef, RefObject, useEffect, useRef, useState } from "react";
import "./plan.css"
import CustomTable from "../components/table";
import { Tag } from "primereact/tag";
import QRCode from "react-qr-code";

export const dynamic = 'force-dynamic';

/*
DeviceID
VehicleTypeID
StationID
Status*/
interface BikesStationedProps {
    deviceID: string;
    vehicleTypeID: string;
    stationID: string;
    status: string;
}

const BikesStationed = ({ searchParams }: { searchParams: any }) => {
    const [items, setItems] = useState<any>([])
    const [station, setStation] = useState<any[]>([])
    const [devices, setDevices] = useState<{ name: string; code: string }[]>([])
    const [vehicleType, setVehicleType] = useState<{ name: string; code: string }[]>([])
    const [selectedStation, setSelectedStation] = useState<any>(null)
    const [selectedVehicleType, setSelectedVehicleType] = useState<any>(null)
    const [selectedDevice, setSelectedDevice] = useState<any>(null)
    const [selectedStatus, setSelectedStatus] = useState<any>(null)
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const qrcodeRefs = useRef<{ [key: string]: RefObject<any> }>({});
    const [formData, setFormData] = useState<BikesStationedProps>({
        deviceID: '',
        vehicleTypeID: '',
        stationID: '',
        status: '',
    });
    const statusVehicleNameTemplate = (rowData: any) => {
        return <Tag value={rowData.vehicleType.name} />;
    };
    const statusDeviceNameTemplate = (rowData: any) => {

        return <div>{rowData.deviceData.name}</div>;
    }
    /**deviceBatteryLevel
deviceIgnition
deviceSpeed
deviceStatus
deviceTotalDistance
deviceType
deviceValid */
    const statusDeviceBatteryLevelTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.batteryLevel}</div>;
    }
    const statusDeviceIgnitionTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.ignition}</div>;
    }
    const statusDeviceSpeedTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.speed}</div>;
    }
    const statusDeviceStatusTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.status}</div>;
    }
    const statusDeviceTotalDistanceTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.totalDistance}</div>;
    }
    const statusDeviceTypeTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.type}</div>;
    }
    const statusDeviceValidTemplate = (rowData: any) => {
        return <div>{rowData.deviceData.valid}</div>;
    }


    const statusStationNameTemplate = (rowData: any) => {

        return <div>{rowData.station.name}</div>;
    }
    const downloadQRCode = (qrRef: RefObject<any>, id: string) => async (e: any) => {
        const svgElement = qrRef.current.querySelector("svg");

        // Convert SVG to PNG using a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgBlob = new Blob([new XMLSerializer().serializeToString(svgElement)], { type: 'image/svg+xml' });
        const img = new Image();
        img.src = URL.createObjectURL(svgBlob);

        // Wait for the image to load
        await new Promise(resolve => img.onload = resolve);

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
        if (!qrcodeRefs.current[rowData.deviceData.deviceId]) {
            qrcodeRefs.current[rowData.deviceData.deviceId] = createRef();
        }
        return <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}
            ref={qrcodeRefs.current[rowData.deviceData.deviceId]}>

            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={rowData.deviceId.toString()}
                viewBox={`0 0 256 256`}

            />
            <Button text style={{ padding: "0px" }} onClick={downloadQRCode(qrcodeRefs.current[rowData.deviceData.deviceId], rowData.deviceData.deviceId.toString())}> Download </Button>

        </div>
    }
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'vehicleTypeId', label: 'Vehicle Type ID', _props: { scope: 'col' } },
        { key: 'vehicleType', label: 'Vehicle Type', _props: { scope: 'col' }, body: statusVehicleNameTemplate },
        { key: 'deviceName', label: 'Device Name', _props: { scope: 'col' }, body: statusDeviceNameTemplate },
        { key: 'deviceBatteryLevel', label: 'Battery Level', _props: { scope: 'col' }, body: statusDeviceBatteryLevelTemplate },
        { key: 'deviceIgnition', label: 'Ignition', _props: { scope: 'col' }, body: statusDeviceIgnitionTemplate },
        { key: 'deviceSpeed', label: 'Speed', _props: { scope: 'col' }, body: statusDeviceSpeedTemplate },
        { key: 'deviceStatus', label: 'Status', _props: { scope: 'col' }, body: statusDeviceStatusTemplate },
        { key: 'deviceTotalDistance', label: 'Total Distance', _props: { scope: 'col' }, body: statusDeviceTotalDistanceTemplate },
        { key: 'deviceType', label: 'Type', _props: { scope: 'col' }, body: statusDeviceTypeTemplate },
        { key: 'deviceValid', label: 'Valid', _props: { scope: 'col' }, body: statusDeviceValidTemplate },
        { key: 'deviceQR', label: 'Device QR', _props: { scope: 'col' }, body: qrCodeTemplate },
        { key: 'stationName', label: 'Station Name', _props: { scope: 'col' }, body: statusStationNameTemplate },

        { key: 'stationId', label: 'Station ID', _props: { scope: 'col' } },
        { key: 'status', label: 'Status', _props: { scope: 'col' } },
    ];

    const getAStations = async () => {
        const response = await getStations()
        if (response.success && response.data) {
            const stations = []
            for (let i = 0; i < response.data.length; i++) {
                stations.push({ name: response.data[i]["name"], code: response.data[i]["id"], location: response.data[i]["location"] })
            }
            setStation(stations)
        }
        setLoading1(false)
    }
    const getAVehicleTypes = async () => {
        const response = await getVehicleTypes()
        if (response.success) {
            const vehicleTypes = []
            for (let i = 0; i < response.data.length; i++) {
                vehicleTypes.push({ name: response.data[i]["name"], code: response.data[i]["id"] })
            }
            setVehicleType(vehicleTypes)
        }
        setLoading1(false)
    }
    useEffect(() => {
        fetchBikes()
        getAVehicleTypes()

        getAStations()
    }, [])

    const handleChange = async (name: keyof BikesStationedProps, value: any) => {

        if (name === 'vehicleTypeID') {
            setSelectedVehicleType(value)
        } else if (name === 'stationID') {
            setDevices([])
            setSelectedStation(value)
            const selectedBikes = []
            for (let i = 0; i < items.length; i++) {
                selectedBikes.push(items[i].deviceId)

            }
            const response = await getBikesNearby(value.location.coordinates[1], value.location.coordinates[0])
            if (response.success && response.data) {
                const devices = []
                for (let i = 0; i < response.data.length; i++) {
                    if (selectedBikes.includes(response.data[i]["deviceId"])) {
                        continue
                    }
                    devices.push({ name: response.data[i]["name"], code: response.data[i]["deviceId"] })
                }
                setDevices(devices)
            }
        } else if (name === 'deviceID') {
            setSelectedDevice(value)
        } else if (name === 'status') {
            setSelectedStatus(value)
        }

        setFormData({ ...formData, [name]: value.code });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send formData to your backend for processing
        const response = await setBikeStand(formData)
        if (response.success && response.data) {
            setShowDialog(false)
            fetchBikes()
        } else {
            console.log('Failed')
        }
    };
    const fetchBikes = async () => {
        if (searchParams && searchParams.search) {
            const response = await getBikeByStation(searchParams.search)
            if (response.success && response.data) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i]["stationId"]) {
                        const resp = await getStationsByID(response.data[i]["stationId"])
                        if (resp.success && resp.data) {
                            response.data[i]["station"] = resp.data
                        }
                    }
                }
                setItems([...response.data])
            }
            setLoading1(false)
            return
        }
        const response = await getBikeStand()
        if (response.success && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i]["stationId"]) {
                    const resp = await getStationsByID(response.data[i]["stationId"])
                    if (resp.success && resp.data) {
                        response.data[i]["station"] = resp.data
                    }
                }
            }
            setItems([...response.data])
        }
        setLoading1(false)
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'BikeStation' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: "0px" }}>
                        <Button type="button" icon="pi pi-plus-circle" label="Station" style={{ marginBottom: "0px" }} onClick={() => setShowDialog(true)} />
                    </div>

                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />                    </div>
                </div>
            </div>

            <Dialog header="Bikes Stationed" visible={showDialog} style={{ width: '50vw' }} modal onHide={() => { setShowDialog(false) }}>
                <form onSubmit={handleSubmit} className="p-fluid grid">
                    <div className="field col-12 lg:col-6">
                        <label htmlFor="VehicleTypeID">Vehicle Type ID</label>
                        <Dropdown id="VehicleTypeID" value={selectedVehicleType} options={vehicleType} onChange={(e) => handleChange('vehicleTypeID', e.value)} optionLabel="name" placeholder="Select a Vehicle Type" filter filterBy="name" />
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
                        <Dropdown id="Status" options={[{ name: "Active", code: "Active" }, { name: "Inactive", code: "Inactive" }]} value={selectedStatus} onChange={(e) => handleChange('status', e.value)} optionLabel="name" placeholder="Select a Status" />
                    </div>
                    <div className="field col-2 button-row">
                        <Button label="Submit" type="submit" />
                    </div>
                </form>
            </Dialog >
        </>
    );
};


export default BikesStationed;