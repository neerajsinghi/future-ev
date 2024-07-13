"use client";

import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "./plan.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { getMyBookings, getMyWallet, getUsers, updateUser } from "@/app/api/iotBikes";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { Tooltip } from 'primereact/tooltip';
import Link from "next/link";
import { flattenData } from "@/app/api/user";
export const dynamic = 'force-dynamic';

const Users = ({ searchParams }: { searchParams: any }) => {
    const [items, setItems] = useState<any>([])
    const [loading1, setLoading1] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [dlImage, setDlImage] = useState<any>(null)
    const [idImage, setIdImage] = useState<any>(null)
    const [selectedId, setSelectedId] = useState<any>(null)
    const [showRidesDialog, setShowRidesDialog] = useState(false)
    const [showWalletDialog, setShowWalletDialog] = useState(false)
    const [walletData, setWalletData] = useState<any>([])
    const [ridesData, setRidesData] = useState<any>([])
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
        const body: any = {
            userBlocked: status,
        }
        const response = await updateUser(body, id)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }
    const validateDl = async () => {
        const body: any = {
            dlVerified: true,
        }
        const response = await updateUser(body, selectedId)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }
    const validateId = async () => {
        const body: any = {
            idVerified: true,
        }
        const response = await updateUser(body, selectedId)
        if (response.success && response.data) {
            fetchData()
        } else {
            console.log('Failed')
        }
    }

    const statusActiveTemplate = (rowData: any) => {
        return rowData && rowData.planActive && <Tag className={`customer-badge status-${rowData}`} onClick={() => changeStatus(!rowData.planActive, rowData.id)}>{rowData && rowData.planActive ? "DeActivate" : "InActive"}</Tag>;
    }
    const blockedUserTemplate = (rowData: any) => {
        return <Button className={`customer-badge status-${rowData}`} severity={rowData.userBlocked ? "danger" : "success"} tooltip="Click to block/unblock user" onClick={() => changeStatusBlocked(!rowData.userBlocked, rowData.id)}>{rowData && rowData.userBlocked ? "Un Block" : "Block "}</Button>;
    }
    const actionBodyTemplate = (rowData: any) => {
        const col = rowData.dlVerified && rowData.dlVerified === true ? "success" : rowData.dlVerified && rowData.dlVerified === true ? "warning" : "danger"
        return (
            <div className="flex justify-content-center">
                <Button disabled icon="pi pi-verified" text className="p-button-rounded  p-mr-2" severity={col} />
                {col != "success" && (rowData.dlImage || rowData.idImage) && <Button icon=" pi pi-info" text className="p-button-rounded p-button-success p-mr-2" tooltip="User have uploaded images clock on this to verify" onClick={
                    () => {
                        setSelectedId(rowData.id)
                        if (rowData.dlImage) {
                            setDlImage(rowData.dlImage)
                            setShowDialog(true)
                        }
                        if (rowData.idImage) {
                            setIdImage(rowData.idImage)
                            setShowDialog(true)
                        }

                    }
                } />}
            </div>
        );
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
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        {
            key: 'totalBalance', label: 'Total Balance', _props: { scope: 'col' }, body: balanceTemplate
        },
        { key: "totalRides", label: "Total Bookings", body: totalRidesTemplate },
        { key: 'dob', label: 'DOB', _props: { scope: 'col' } },
        { key: 'email', label: 'Email', _props: { scope: 'col' } },
        { key: 'phoneNumber', label: 'Phone Number', _props: { scope: 'col' } },
        { key: 'plan.name', label: 'Service', _props: { scope: 'col' } },
        { key: 'plan.city', label: 'Service City', _props: { scope: 'col' } },

        { key: "planActive", label: "Plan Active", _props: { scope: 'col' }, body: statusActiveTemplate },
        { key: "userBlocked", label: "User Blocked", _props: { scope: 'col' }, body: blockedUserTemplate },
        { key: 'referralCode', label: 'Referral Code', _props: { scope: 'col' } },
        { key: 'verified', label: 'Verified', _props: { scope: 'col' }, body: actionBodyTemplate }
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
                <div className="grid">
                    {
                        dlImage && <div className="col-12 md:col-6">
                            <Image src={dlImage} alt="dlImage" />
                        </div>
                    }
                    {
                        idImage && <div className="col-12 md:col-6">
                            <Image src={idImage} alt="idImage" />
                        </div>
                    }
                    {
                        dlImage && <div className="col-12 md:col-6">
                            <Button label="Validate DL" onClick={validateDl} />
                        </div>
                    }
                    {
                        idImage && <div className="col-12 md:col-6">
                            <Button label="Validate ID" onClick={validateId} />
                        </div>
                    }
                </div>
            </Dialog>
            <Dialog header="Rides Summary" visible={showRidesDialog} style={{ width: '50vw' }} onHide={() => setShowRidesDialog(false)}>
            </Dialog>

        </>
    );
}

export default Users;