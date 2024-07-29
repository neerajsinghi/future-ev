'use client';

import { getBikes } from "@/app/api/iotBikes";
import { BreadCrumb } from "primereact/breadcrumb";
import { createRef, RefObject, useEffect, useRef, useState } from "react";
import CustomTable from "../components/table";
import QRCode from "react-qr-code";
import { Button } from "primereact/button";



const Bikes = () => {

    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const qrcodeRefs = useRef<{ [key: string]: RefObject<any> }>({});



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
        if (!qrcodeRefs.current[rowData.deviceId]) {
            qrcodeRefs.current[rowData.deviceId] = createRef();
        }
        return <div>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}
                ref={qrcodeRefs.current[rowData.deviceId]}>

                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={rowData.deviceId.toString()}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <Button text style={{ padding: "0px" }} onClick={downloadQRCode(qrcodeRefs.current[rowData.deviceId], rowData.deviceId.toString())}> Download </Button>

        </div>
    }
    const columns = [
        { key: 'deviceId', label: 'ID', _props: { scope: 'col' }, filterField: "deviceId" },
        { key: 'deviceImei', label: 'Device Imei', _props: { scope: 'col' }, filterField: "deviceImei" },
        { key: 'name', label: 'Name', _props: { scope: 'col' }, filterField: "name" },
        { key: 'phone', label: 'Phone', _props: { scope: 'col' }, filterField: "phone" },
        { key: 'alarm', label: 'Alarm', _props: { scope: 'col' }, filterField: "alarm" },
        { key: 'batteryLevel', label: 'Battery Level', _props: { scope: 'col' }, filterField: "batteryLevel" },
        { key: 'course', label: 'Course', _props: { scope: 'col' }, filterField: "course" },
        { key: 'dealer', label: 'Dealer', _props: { scope: 'col' }, filterField: "dealer" },
        { key: 'ignition', label: 'Ignition', _props: { scope: 'col' }, filterField: "ignition" },
        { key: 'posId', label: 'Pos Id', _props: { scope: 'col' }, filterField: "posId" },
        { key: 'speed', label: 'Speed', _props: { scope: 'col' }, filterField: "speed" },
        { key: 'status', label: 'Status', _props: { scope: 'col' }, filterField: "status" },
        { key: 'totalDistance', label: 'Total Distance', _props: { scope: 'col' }, filterField: "totalDistance" },
        { key: 'type', label: 'Type', _props: { scope: 'col' }, filterField: "type" },
        { key: 'valid', label: 'Valid', _props: { scope: 'col' }, filterField: "valid" },
        { key: 'qrCode', label: 'QR Code', _props: { scope: 'col' }, body: qrCodeTemplate, filterField: "qrCode" },
    ]

    useEffect(() => {

        fetchData();

        return () => {
            setItems([])
        }
    }, [])
    const fetchData = async () => {
        let response = await getBikes()
        if (response.success) {
            if (response.data) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i]["deviceId"]) {
                        qrcodeRefs.current[response.data[i]["deviceId"]] = createRef();
                    }
                }
                setItems(() => response.data)
            }
        }
        setLoading1(false)
    }

    return (
        <div className="grid">
            <div className="col-12">
                <BreadCrumb model={[{ label: 'Bikes' }]} home={{ icon: 'pi pi-home', url: '/' }} />
            </div>
            <div className="col-12">
                <div className="card">
                    <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />
                </div>
            </div>
        </div>
    )
}

export default Bikes;
