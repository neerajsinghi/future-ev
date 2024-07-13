'use client';
import { getMyWallet, getWallet } from "@/app/api/iotBikes";

import { useEffect, useState } from "react";
import CustomTable from "../components/table";
import { BreadCrumb } from "primereact/breadcrumb";
import "./plan.css";
export const dynamic = 'force-dynamic';

const Wallet = ({ searchParams }: { searchParams: any }) => {
    const columns = [
        { key: 'id', label: 'Id', _props: { scope: 'col' } },
        { key: 'userId', label: 'User ID', _props: { scope: 'col' } },
        { key: 'depositedMoney', label: 'Deposit', _props: { scope: 'col' } },
        { key: "paymentID", label: "Payment ID", _props: { scope: "col" } },
        { key: 'usedMoney', label: 'Used', _props: { scope: 'col' } },
        { key: "BookingID", label: "Booking ID", _props: { scope: "col" } },
        { key: "planID", label: "Plan ID", _props: { scope: "col" } },
        { key: "createdTime", label: "Created Time", _props: { scope: "col" } }
    ]
    const [items, setItems] = useState<any>([])
    const [totalAmountInWallet, setTotalAmountInWallet] = useState(0)
    const [loading1, setLoading1] = useState(true);
    useEffect(() => {
        fetchData();
        return () => {
            setItems([])
        }
    }, [])
    const fetchData = async () => {
        debugger
        let response: any = {}
        if (searchParams.userId && searchParams.userId !== "undefined") {
            response = await getMyWallet(searchParams.userId)
        } else {
            response = await getWallet()
        }
        if (response.success && response.data) {
            const data = []
            let totalAmountInWallet = 0
            if (searchParams.userId) {
                totalAmountInWallet = response.data.TotalBalance
                data.push(...response.data.Wallets)
            } else
                for (let i = 0; i < response.data.length; i++) {
                    totalAmountInWallet += response.data[i].TotalBalance

                    data.push(...response.data[i].Wallets)
                }
            setTotalAmountInWallet(totalAmountInWallet)
            setItems(data)
            setLoading1(false)
        }
    }
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <BreadCrumb model={[
                        { label: 'Wallets' },
                    ]} home={{ icon: 'pi pi-home', url: '/' }} />
                </div>
                <div className="col-12">
                    <h3>Total Amount: {totalAmountInWallet}</h3>
                </div>
                <div className="col-12">
                    <CustomTable editMode={undefined}
                        columns2={[]}
                        columns={columns}
                        items={items}
                        loading1={loading1}
                    />
                </div >
            </div>

        </>
    )
}

export default Wallet;