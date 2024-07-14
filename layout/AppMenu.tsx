/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const access = localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as string) : [];

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Vehicle Type', icon: 'pi pi-fw pi-car', to: '/vehicleType' },

            {
                label: 'Services',
                items: [
                    {
                        label: 'Ride Now', icon: 'pi pi-fw pi-book', to: '/services/ridenow', items: [{ label: 'Ride Now', icon: 'pi pi-fw pi-book', to: '/services/ridenow ' }, { label: 'Ride Now Bookings', icon: 'pi pi-fw pi-book', to: '/services/ridenowbooking' },]
                    },
                    {
                        label: 'Rental', icon: 'pi pi-fw pi-cloud', to: '/services/rental',
                        items: [{
                            label: 'Rental', icon: 'pi pi-fw pi-cloud', to: '/services/rental',
                        }, { label: 'Rental Bookings', icon: 'pi pi-fw pi-cloud', to: '/services/rentalbookings' },]
                    },
                    { label: 'Charging Station', icon: 'pi pi-fw pi-circle', to: '/services/charging', items: [{ label: 'Charging Station', icon: 'pi pi-fw pi-circle', to: '/services/charging' }, { label: 'Charging Station Bookings', icon: 'pi pi-fw pi-circle', to: '/services/chargingbookings' }] },
                    { label: "Car Rental", icon: "pi pi-fw pi-circle", to: "/services/ecar", items: [{ label: "Car Rental", icon: "pi pi-fw pi-circle", to: "/services/ecar", }, { label: "Car Rental Bookings", icon: "pi pi-fw pi-circle", to: "/services/ecarbooking" }] },

                ]
            },
            { label: 'Staff', icon: 'pi pi-spin pi-fw pi-circle', to: '/staff' },
            { label: 'Stations', icon: 'pi pi-fw pi-map-marker', to: '/stations' },

            { label: 'Bikes', icon: 'pi pi-spin pi-fw pi-circle', to: '/bikes' },
            { label: 'Plan', icon: 'pi pi-fw pi-clipboard', to: '/plan' },
            { label: "Bike Stationed", icon: "pi pi-fw pi-map-marker", to: "/bikesStationed" },
            { label: 'Coupons', icon: 'pi pi-fw pi-ticket', to: '/coupons' },
            { label: 'Users', icon: 'pi pi-fw pi-user', to: '/users' },
            { label: "Chargers", icon: "pi pi-fw pi-battery", to: "/chargers" },
            { label: 'FAQ', icon: 'pi pi-fw pi-wallet', to: '/faq' },
            { label: 'Notification', icon: 'pi pi-fw pi-wallet', to: '/notification' },
            ]
        },

        {
            label: "Reports",
            items: [
                { label: "Stand Status", icon: "pi pi-fw pi-book", to: "/report/stands" },
                { label: "On Road Vehicles", icon: "pi pi-fw pi-cloud", to: "/report/onroad" },
                { label: "Transaction Report", icon: "pi pi-fw pi-road", to: "/report/transactions" },
            ]
        },
        {
            label: "Logout",
            items: [
                { label: "Logout", icon: "pi pi-fw pi-sign-out", to: "/logout" },
            ]
        }

    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}


            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
