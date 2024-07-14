'use client';
import { getCity } from '@/app/api/services';
import { APIProvider, ControlPosition, Map, MapControl } from '@vis.gl/react-google-maps';


import { useEffect, useState } from 'react';



const GodView = () => {
    const [city, setCity] = useState<any>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        let response = await getCity()
        if (response.success && response.data) {
            setCity(response.data)
            setLoading(false)
        }
    }
    return <APIProvider apiKey={'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc'}>
        <div></div>
        <div style={{ height: '100vh', width: '100%' }}>
            <Map zoom={10} center={{ lat: 53.54992, lng: 10.00678 }} />
        </div>
    </APIProvider>

}

export default GodView;