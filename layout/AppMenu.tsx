/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    // const { layoutConfig } = useContext(LayoutContext);
    const access = localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access') as string) : [];
    const parsedData = access.reduce((result: { [x: string]: any }, item: { Key: string; Value: string | any[] }) => {
        const key = item.Key === 'totalActiveVeficles' ? 'totalActiveVehicles' : item.Key;
        result[key] = Array.isArray(item.Value) && item.Value.length === 0 ? 0 : item.Value;
        return result;
    }, {} as { [key: string]: any });
    console.log(parsedData);
    const items = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
        { label: 'GodView', icon: 'pi pi-fw pi-eye', to: '/godView' },
        { label: 'Vehicle Type', icon: 'pi pi-fw pi-car', to: '/vehicleType' },

        {
            label: 'Services',
            items: [
                {
                    label: 'Ride Now',
                    icon: 'pi pi-fw pi-book',
                    to: '/services/ridenow',
                    items: [
                        { label: 'Ride Now', icon: 'pi pi-fw pi-book', to: '/services/ridenow ' },
                        { label: 'Ride Now Transactions', icon: 'pi pi-fw pi-book', to: '/services/ridenowTransaction' }
                    ]
                },
                {
                    label: 'Rental',
                    icon: 'pi pi-fw pi-cloud',
                    to: '/services/rental',
                    items: [
                        {
                            label: 'Rental',
                            icon: 'pi pi-fw pi-cloud',
                            to: '/services/rental'
                        },
                        { label: 'Rental Transactions', icon: 'pi pi-fw pi-cloud', to: '/services/rentalTransactions' }
                    ]
                },
                {
                    label: 'Charging Station',
                    icon: 'pi pi-fw pi-circle',
                    to: '/services/charging',
                    items: [
                        { label: 'Charging Station', icon: 'pi pi-fw pi-circle', to: '/services/charging' },
                        { label: 'Charging Station Bookings', icon: 'pi pi-fw pi-circle', to: '/services/chargingbookings' }
                    ]
                },
                {
                    label: 'Car Rental',
                    icon: 'pi pi-fw pi-circle',
                    to: '/services/ecar',
                    items: [
                        { label: 'Car Rental', icon: 'pi pi-fw pi-circle', to: '/services/ecar' },
                        { label: 'Car Rental Bookings', icon: 'pi pi-fw pi-circle', to: '/services/ecarbooking' }
                    ]
                }
            ]
        },
        { label: 'Staff', icon: 'pi pi-fw pi-users', to: '/staff' },
        { label: 'City', icon: 'pi pi-fw pi-map', to: '/city' },
        { label: 'Stations', icon: 'pi pi-fw pi-map-marker', to: '/stations' },

        // { label: 'Bikes', icon: 'pi pi-spin pi-fw pi-circle', to: '/bikes' },
        // { label: 'Plan', icon: 'pi pi-fw pi-clipboard', to: '/plan' },
        { label: 'Vehicle Onboarding', icon: 'pi pi-fw pi-map-marker', to: '/vehicleOnboarding' },
        { label: 'Coupons', icon: 'pi pi-fw pi-ticket', to: '/coupons' },
        { label: 'Users', icon: 'pi pi-fw pi-user', to: '/users' },
        { label: 'FAQ', icon: 'pi pi-fw pi-wallet', to: '/faq' },
        { label: 'Notification', icon: 'pi pi-fw pi-wallet', to: '/notification' },
        { label: 'Feedback', icon: 'pi pi-fw pi-wallet', to: '/feedback' },
        { label: 'Refer', icon: 'pi pi-fw pi-wallet', to: '/referrals' }
    ];
    const ItemsSelected = items.filter((item) => {
        if (item.label === 'Dashboard') {
            return item;
        }
        if (item.label === 'GodView' && parsedData.godView != 'None') {
            return item;
        }
        if (item.label === 'Vehicle Type' && parsedData.vehicleType != 'None') {
            return item;
        }
        if (item.label === 'Services' && parsedData.services != 'None') {
            if (item.label === 'Services') {
                return item?.items?.filter((subItem) => {
                    if (subItem.label === 'Ride Now' && parsedData.rideNow != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Ride Now Transactions' && parsedData.rideNowTransactions != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Rental' && parsedData.rental != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Rental Transactions' && parsedData.rentalTransactions != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Car Rental' && parsedData.carRental != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Car Rental Bookings' && parsedData.carRentalBookings != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Charging Station' && parsedData.chargingStation != 'None') {
                        return subItem;
                    }
                    if (subItem.label === 'Charging Station Bookings' && parsedData.chargingStationBookings != 'None') {
                        return subItem;
                    }
                });
            }
            return item;
        }
        if (item.label === 'Staff' && parsedData.staff != 'None') {
            return item;
        }
        if (item.label === 'City' && parsedData.city != 'None') {
            return item;
        }
        if (item.label === 'Stations' && parsedData.stations != 'None') {
            return item;
        }
        if (item.label === 'Vehicle Onboarding' && parsedData.vehicleOnboarding != 'None') {
            return item;
        }
        if (item.label === 'Coupons' && parsedData.coupons != 'None') {
            return item;
        }
        if (item.label === 'Users' && parsedData.users != 'None') {
            return item;
        }
        if (item.label === 'FAQ' && parsedData.faq != 'None') {
            return item;
        }
        if (item.label === 'Notification' && parsedData.notification != 'None') {
            return item;
        }
    });
    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: ItemsSelected
        },

        // {
        //     label: 'Reports',
        //     items: [
        //         { label: 'Stand Status', icon: 'pi pi-fw pi-book', to: '/report/stands' },
        //         { label: 'On Road Vehicles', icon: 'pi pi-fw pi-cloud', to: '/report/onroad' },
        //         { label: 'Transaction Report', icon: 'pi pi-fw pi-road', to: '/report/transactions' }
        //     ]
        // },
        {
            label: 'Logout',
            items: [{ label: 'Logout', icon: 'pi pi-fw pi-sign-out', to: '/logout' }]
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
