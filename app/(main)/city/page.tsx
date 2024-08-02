'use client';
import { deleteCity, getCity, setCity } from '@/app/api/services';
import useIsAccessible from '@/app/hooks/isAccessible';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '../components/table';
import { GoogleMap, useLoadScript, DrawingManager, Polygon } from '@react-google-maps/api';
import './plan.css';
import { Toast } from 'primereact/toast';
import { showToast } from '@/app/hooks/toast';

interface LocationPolygon {
    type: string;
    coordinates: number[][][][];
}

interface CityData {
    code: string;
    id: string;
    name: string;
    active: boolean;
    numberOfStations: number | null;
    numberOfVehicles: number | null;
    locationPolygon: LocationPolygon;
    services: string[] | null;
    vehicleType: string;
}

interface TableColumn {
    key: string;
    label: string;
    _props?: { scope: string };
    body: any;
}

interface FormData {
    name: string;
    services: string[];
    vehicleType: string;
}

const City: React.FC = () => {
    const isAccessible = useIsAccessible('city');
    const [city, setCities] = useState<CityData[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [SelectedCity, setSelectedCity] = useState<any>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [polygonPath, setPolygonPath] = useState<{ lat: number; lng: number }[]>([]);
    const polygonRef = useRef<google.maps.Polygon | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAsiZAMvI7a1IYqkik0Mjt-_d0yzYYDGJc',
        libraries: ['drawing']
    });

    const getCityD = async () => {
        let response = await getCity();
        if (response.success) {
            if (response.data) {
                const data: CityData[] = response.data.map((item: any) => ({
                    code: item.name,
                    ...item
                }));
                console.log(data);
                setCities(data);
                setLoading1(false);
            }
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data: any) => {
        debugger;
        const polyPath = polygonPath;
        if (polygonPath[0] !== polygonPath[polygonPath.length - 1]) {
            polyPath.push(polygonPath[0]);
        }
        const locationPolygon: LocationPolygon = {
            type: 'MultiPolygon',
            coordinates: [[polyPath.map(({ lat, lng }) => [lng, lat])]]
        };
        const body = { ...data, locationPolygon };
        console.log({ ...data, locationPolygon, active: true });
        console.log(body);
        const response = await setCity(body);
        if (response.success) {
            getCityD();
            setShowDialog(false);
            setPolygonPath([]);
            reset();
            showToast(response.message || 'Added City', 'success');
        } else {
            console.log({ response });
            showToast(response.message || 'Error adding Station', 'error');
        }
        setShowDialog(false);
        setPolygonPath([]);
        reset();
    };

    const handlePolygonComplete = (polygon: google.maps.Polygon) => {
        const path = polygon.getPath().getArray();
        setPolygonPath(path.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() })));
        polygonRef.current = polygon;
    };

    const handlePolygonEdit = () => {
        if (polygonRef.current) {
            const path = polygonRef.current.getPath().getArray();
            setPolygonPath(path.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() })));
        }
    };

    const dialogFooter = (
        <div>
            <div className="col-12"></div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit(onSubmit)} disabled={!!errors.name || !!errors.services || !!errors.vehicleType || polygonPath.length === 0} />
        </div>
    );

    const deleteCityD = async () => {
        const response = await deleteCity(SelectedCity);
        if (response.success) {
            getCityD();
            setShowDeleteDialog(false);
            showToast(response.message || 'Deleted City', 'success');
        } else {
            showToast(response.message || 'Failed To Deleted City', 'error');
        }
    };

    useEffect(() => {
        getCityD();
    }, []);

    const deleteTemplate = (rowData: any) => {
        return (
            <Button
                type="button"
                icon="pi pi-trash"
                onClick={() => {
                    setSelectedCity(rowData.id);
                    setShowDeleteDialog(true);
                }}
            ></Button>
        );
    };

    const columns = [
        { key: 'id', label: 'ID', _props: { scope: 'col' } },
        { key: 'name', label: 'Name', _props: { scope: 'col' } },
        { key: 'active', label: 'Active', _props: { scope: 'col' } },
        { key: 'services', label: 'Services', _props: { scope: 'col' } },
        { key: 'vehicleType', label: 'Vehicle Type', _props: { scope: 'col' } },
        {
            key: 'action',
            label: 'Action',
            _props: { scope: 'col' },
            body: deleteTemplate
        }
    ];

    return (
        <div>
            {/* {isAccessible === 'None' && <h1>You Dont Have Access To This Page</h1>} */}
            {/* {isAccessible === 'Edit' ||
                (isAccessible === 'View' && ( */}
            <>
                <h1>Cities</h1>
                <div className="grid">
                    <div className="col-12">
                        <BreadCrumb model={[{ label: 'City' }]} home={{ icon: 'pi pi-home', url: '/' }} />
                    </div>

                    <div className="col-12">
                        <div className="flex justify-content-end" style={{ marginBottom: '0px' }}>
                            <Button type="button" icon="pi pi-plus-circle" label="City" style={{ marginBottom: '0px' }} onClick={() => setShowDialog(true)} />
                        </div>
                    </div>
                    <div className="col-12 m-10">
                        <div className="card">
                            <CustomTable tableName="cities" mapNavigatePath="/stations/viewStationOnMap" editMode={undefined} columns2={[]} columns={columns} items={city} loading1={loading1} />
                        </div>
                    </div>
                </div>
            </>
            {/* // ))} */}

            {/* {isAccessible === 'Edit' && ( */}
            <Dialog header="Add City" visible={showDialog} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => setShowDialog(false)}>
                <form className="grid">
                    <div className="input-container">
                        <div className="input">
                            <label htmlFor="name">Name</label>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Name is required' }}
                                render={({ field }: { field: any }) => (
                                    <>
                                        <InputText placeholder="Enter City Name" id="name" {...field} />
                                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="input">
                            <label htmlFor="services">Services Available</label>
                            <Controller
                                name="services"
                                control={control}
                                defaultValue={[]}
                                rules={{ required: 'At least one service is required' }}
                                render={({ field }: { field: any }) => (
                                    <>
                                        <MultiSelect
                                            value={field.value}
                                            placeholder="Select Service Type"
                                            options={[
                                                { name: 'ride now', code: 'hourly' },
                                                { name: 'rental', code: 'rental' },
                                                { name: 'charging', code: 'charging' },
                                                { name: 'eCar', code: 'eCar' }
                                            ]}
                                            onChange={(e) => field.onChange(e.value)}
                                            optionLabel="name"
                                            optionValue="code"
                                        />
                                        {errors.services && <small className="p-error">{errors.services.message}</small>}
                                    </>
                                )}
                            />
                        </div>

                        <div className="input">
                            <label htmlFor="vehicleType">Vehicle Type</label>
                            <Controller
                                name="vehicleType"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Vehicle type is required' }}
                                render={({ field }) => (
                                    <>
                                        <Dropdown filter id="vehicleType" value={field.value} options={['normal', 'fast']} onChange={(e) => field.onChange(e.value)} placeholder="Select a Type" />
                                        {errors.vehicleType && <small className="p-error">{errors.vehicleType.message}</small>}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full col-12 map-container">
                        <label>Draw Polygon</label>
                        {isLoaded ? (
                            <GoogleMap
                                options={{
                                    gestureHandling: 'greedy'
                                }}
                                mapContainerStyle={{ width: '100%', height: '400px', marginTop: '10px' }}
                                center={{ lat: 28.6139, lng: 77.209 }} // Centering on Delhi
                                zoom={8}
                            >
                                <DrawingManager
                                    onPolygonComplete={handlePolygonComplete}
                                    options={{
                                        drawingControl: true,
                                        drawingControlOptions: {
                                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                                        },
                                        polygonOptions: {
                                            editable: true,
                                            draggable: true
                                        }
                                    }}
                                />
                                {polygonPath.length > 0 && (
                                    <Polygon
                                        path={polygonPath}
                                        options={{
                                            editable: true,
                                            draggable: true
                                        }}
                                        onMouseUp={handlePolygonEdit}
                                        onDragEnd={handlePolygonEdit}
                                    />
                                )}
                            </GoogleMap>
                        ) : (
                            <div>Loading...</div>
                        )}
                        {polygonPath.length === 0 && <small className="p-error">Drawing a polygon is required</small>}
                    </div>
                </form>
            </Dialog>
            {/* )} */}

            {showDeleteDialog && (
                <Dialog header="Delete Plan" visible={showDeleteDialog} style={{ width: '50vw' }} onHide={() => setShowDeleteDialog(false)}>
                    <div className="grid">
                        <div className="col-12 text-center">
                            <h2>Are you sure you want to delete this Plan?</h2>
                        </div>
                        <div className="button-row col-12 gap-3 center-center">
                            <Button
                                label="Yes"
                                style={{ background: '#ff3333' }}
                                onClick={() => {
                                    deleteCityD();
                                }}
                            />
                            <Button
                                label="No"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                }}
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default City;
