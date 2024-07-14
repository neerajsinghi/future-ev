"use client";

import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import "./plan.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { getMyBookings, getMyWallet, getUsers, updateUser } from "@/app/api/iotBikes";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Tooltip } from 'primereact/tooltip';
import Link from "next/link";
import { flattenData } from "@/app/api/user";
import { ColumnFilterElementTemplateOptions } from "primereact/column";
export const dynamic = 'force-dynamic';

const Users = ({ searchParams }: { searchParams: any }) => {
    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [dlFrontImage, setDlFrontImage] = useState<any>(null)
    const [idFrontImage, setIdFrontImage] = useState<any>(null)
    const [dlBackImage, setDlBackImage] = useState<any>(null)
    const [idBackImage, setIdBackImage] = useState<any>(null)
    const [idVerified, setIdVerified] = useState<any>(false)
    const [dlVerified, setDlVerified] = useState<any>(false)
    const [selectedId, setSelectedId] = useState<any>(null)
    const [blockedBy, setBlockedBy] = useState<any>("")
    const [BlockReason, setBlockReason] = useState<any>("")
    const [blockedDialog, setBlockedDialog] = useState(false)
    const [walletData, setWalletData] = useState<any>([])
    const [ridesData, setRidesData] = useState<any>([])
    const services = [
        { name: "Ride Now", value: "hourly" },
        { name: "Rental", value: "rental" },
        { name: "Charging", value: "charging" },
        { name: "ECar", value: "ECar" },
    ]
    const localUser = JSON.parse(localStorage.getItem("user") || "{}")
    const fetchData = async () => {

        const response = await getUsers("user")
        if (response.success && response.data) {
            const data = []
            for (let i = 0; i < response.data.length; i++) {
                if (searchParams.userId) {
                    if (searchParams.userId === response.data[i].id) {
                        data.push(flattenData(response.data[i]))

                    }
                } else {
                    data.push(flattenData(response.data[i]))

                }

            }
            debugger
            setItems(data)

        }

        setLoading1(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const fetchBookings = async (id: string) => {
        const response = await getMyBookings(id)
        if (response.success && response.data) {
            console.log(response.data)
        }
    }
    const fetchWallet = async (id: string) => {
        const response = await getMyWallet(id)
        if (response.success && response.data) {
            console.log(response.data)
            setWalletData(response.data)
        }
    }
    const statusAddressTemplate = (rowData: any) => {

        return <div>{rowData.address.address}</div>;
    }
    const statusCityTemplate = (rowData: any) => {

        return <div>{rowData.address.city}</div>;
    }
    const statusLongTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[0]}</div>;
    }
    const statusLatTemplate = (rowData: any) => {
        return <div>{rowData.location.coordinates[1]}</div>;
    }
    const statusStockTemplate = (rowData: any) => {
        return <div>{rowData.stock ? rowData.stock : 0}</div>;
    }
    const changeStatus = async (status: boolean, id: string) => {
        const body: any = {
            planActive: status,
        }
        const response = await updateUser(body, id)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }
    const changeStatusBlocked = async (status: boolean, id: string) => {
        setSelectedId(id)
        setBlockedDialog(true)
    }
    const onChangeStatusBlocked = async () => {
        debugger
        const body: any = {
            userBlocked: true,
            blockedBy: localUser.id,
            blockReason: BlockReason
        }
        const response = await updateUser(body, selectedId)
        if (response.success) {
            fetchData()
            setBlockedDialog(false)
        } else {
            console.log('Failed')
        }
    }
    const validateDl = async () => {
        debugger
        const body: any = {
            dlVerified: true,
        }
        const response = await updateUser(body, selectedId)
        if (response.success) {
            fetchData()
            setShowDialog(false)
        } else {
            console.log('Failed')
        }
    }
    const validateId = async () => {
        const body: any = {
            idVerified: true,
        }
        const response = await updateUser(body, selectedId)
        if (response.success) {
            fetchData()
            setShowDialog(false)
        } else {
            console.log('Failed')
        }
    }

    const statusActiveTemplate = (rowData: any) => {
        return rowData && rowData.planActive && <Tag className={`customer-badge status-${rowData}`} onClick={() => changeStatus(!rowData.planActive, rowData.id)}>{rowData && rowData.planActive ? "DeActivate" : "InActive"}</Tag>;
    }
    const blockedUserTemplate = (rowData: any) => {
        return <Button className={`customer-badge status-${rowData}`} severity={rowData.userBlocked ? "danger" : "success"} tooltip="Click to block/unblock user" disabled={rowData.userBlocked} onClick={() => changeStatusBlocked(!rowData.userBlocked, rowData.id)}>{rowData && rowData.userBlocked ? "Blocked" : "Active "}</Button>;
    }

    const balanceTemplate = (rowData: any) => {
        return <div >{rowData.totalBalance ? <Link href={{
            pathname: '/wallets',
            query: {
                userId: rowData.id
            }
        }}
        > {rowData.totalBalance} </Link> : 0}</div>;
    }

    const totalRidesTemplate = (rowData: any) => {
        return <div>{rowData.totalRides ? <Link
            href={{
                pathname: '/bookings',
                query: {
                    userId: rowData.id
                }
            }}
        > {rowData.totalRides} </Link> : 0}</div>;
    }

    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };
    const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={services} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        {
            key: 'totalBalance', label: 'Total Balance', _props: { scope: 'col' }, body: balanceTemplate
        },
        { key: "totalRides", label: "Total Bookings", body: totalRidesTemplate },
        { key: "status", label: "Status", _props: { scope: 'col' } },
        { key: 'phoneNumber', label: 'Phone Number', _props: { scope: 'col' } },
        { key: 'serviceType', label: 'Service', _props: { scope: 'col' }, body: (rowData: any) => rowData.plan && rowData.plan.name ? rowData.plan.name : "NA", elementFilter: typeFilterTemplate },
        { key: "userBlocked", label: "User Blocked", _props: { scope: 'col' }, body: blockedUserTemplate },
        { key: 'referralCode', label: 'Referral Code', _props: { scope: 'col' } },
        {
            key: 'idVerified', label: 'ID Verified', _props: { scope: 'col' }, body: (rowData: any) => rowData.idVerified ? <div onClick={() => {
                if (rowData.idFrontImage) {
                    setIdFrontImage(rowData.idFrontImage)
                }
                if (rowData.idBackImage) {
                    setIdBackImage(rowData.idBackImage)
                }
                if (rowData.idFrontImage && rowData.idBackImage) {
                    setSelectedId(rowData.id)
                    setShowDialog(true)
                }
                setIdVerified(true)
            }}><span style={{ color: rowData.idFrontImage && rowData.idBackImage ? "green" : "white" }}>Yes</span></div> : <div onClick={() => {
                if (rowData.idFrontImage) {
                    setIdFrontImage(rowData.idFrontImage)
                }
                if (rowData.idBackImage) {
                    setIdBackImage(rowData.idBackImage)
                }
                if (rowData.idFrontImage && rowData.idBackImage) {
                    setSelectedId(rowData.id)
                    setShowDialog(true)
                }
            }}><span style={{ color: rowData.idFrontImage && rowData.idBackImage ? "green" : "white" }}>No</span></div>
        },
        {
            key: 'dlVerified', label: 'DL Verified', _props: { scope: 'col' }, body: (rowData: any) => rowData.dlVerified ? <div
                onClick={
                    () => {
                        debugger
                        if (rowData.dlFrontImage) {
                            setDlFrontImage(rowData.dlFrontImage)
                        }
                        if (rowData.dlBackImage) {
                            setDlBackImage(rowData.dlBackImage)
                        }
                        if (rowData.dlFrontImage && rowData.dlBackImage) {
                            setSelectedId(rowData.id)
                            setShowDialog(true)

                        }
                        setDlVerified(true)
                    }
                }
            ><span style={{ color: rowData.dlFrontImage && rowData.dlBackImage ? "green" : "white" }}>Yes</span></div> : <div onClick={
                () => {
                    if (rowData.dlFrontImage) {
                        setDlFrontImage(rowData.dlFrontImage)
                    }
                    if (rowData.dlBackImage) {
                        setDlBackImage(rowData.dlBackImage)
                    }
                    if (rowData.dlFrontImage && rowData.dlBackImage) {
                        setSelectedId(rowData.id)
                        setShowDialog(true)
                    }
                }
            }
            > <span style={{ color: rowData.dlFrontImage && rowData.dlBackImage ? "green" : "white" }}>No</span></div >
        },
    ]

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[{ label: 'User' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <div className="flex justify-content-end" style={{ marginBottom: "0px" }}>
                        <Button type="button" icon="pi pi-plus-circle" label="User" style={{ marginBottom: "0px" }} onClick={() => setShowDialog(true)} />
                    </div>

                </div>
                <div className="col-12 m-10">
                    <div className="card">
                        <CustomTable editMode={undefined} columns2={[]} columns={columns} items={items} loading1={loading1} />

                    </div>
                </div>
            </div>
            <Dialog header="Image Validation" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                {
                    dlFrontImage && <h4>DL Verification Images</h4>
                }
                <div className="grid">

                    {
                        dlFrontImage && <div className="col-12 md:col-6">
                            <Image src={dlFrontImage} alt="dlFrontImage" width="200" height="200" />
                        </div>
                    }
                    {
                        dlBackImage && <div className="col-12 md:col-6">
                            <Image src={dlBackImage} alt="dlFrontImage" width="200" height="200" />
                        </div>
                    }
                    {
                        dlFrontImage && dlBackImage && !dlVerified && <div className="col-12 md:col-6">
                            <Button label="Validate DL" onClick={validateDl} />
                        </div>
                    }
                    {<div className="col-12">
                        {idFrontImage && <h4>ID Verification Images</h4>}
                    </div>
                    }
                    {
                        idFrontImage && <div className="col-12 md:col-6">
                            <Image src={idFrontImage} alt="idFrontImage" width="200" height="200" />
                        </div>
                    }
                    {
                        idBackImage && <div className="col-12 md:col-6">
                            <Image src={idBackImage} alt="idFrontImage" width="200" height="200" />
                        </div>
                    }

                    {
                        idFrontImage && idBackImage && !idVerified && <div className="col-12 md:col-6">
                            <Button label="Validate ID" onClick={validateId} />
                        </div>
                    }
                </div>
            </Dialog>
            <Dialog header="Block User" visible={blockedDialog} style={{ width: '25vw' }} onHide={() => setBlockedDialog(false)}>
                <div className="grid">
                    <div className="col-12">
                        <InputTextarea value={BlockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Block Reason" style={{ width: '22vw' }} />
                    </div>
                    <div className="col-12">
                        <Button label="Block" onClick={onChangeStatusBlocked} />
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default Users;