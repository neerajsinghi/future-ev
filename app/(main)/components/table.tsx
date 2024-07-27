'use client';

import useIsMobile from '@/app/api/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useEffect, useRef, useState } from 'react';

const CustomTable = ({ columns, columns2 = [], items, loading1, editMode, mapNavigatePath }: { columns: any[]; columns2: any[]; items: any[]; loading1: any; editMode: string | undefined; mapNavigatePath?: string }) => {
    const isMobile = useIsMobile();

    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [statuses] = useState<string[]>(['personal', 'bike', 'car']);
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const dt = useRef<DataTable<any>>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        initFilters1();

        return () => { };
    }, []);
    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.status} />;
    };
    const initFilters1 = () => {
        const initialFilters: any = {};
        columns.forEach((col) => {
            const field = col.key;
            if (col.body == null) {
                initialFilters[field] = {
                    operator: field == 'status' || field == 'type' ? FilterOperator.OR : FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                };
            }
        });
        // debugger;
        setFilters1(initialFilters);
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },

            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            type: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS || FilterMatchMode.STARTS_WITH }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };
    const clearFilter1 = () => {
        initFilters1();
    };
    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value);
        console.log({ ...filters1 });
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };
    const renderHeader1 = () => {
        return (
            <div className="flex items-center gap-2 justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label={isMobile ? '' : 'Clear'} outlined onClick={clearFilter1} className="px-3" />
                <div className="flex item p-input-icon-left">
                    <span style={{ position: 'relative' }}>
                        <i className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                        <InputText value={globalFilterValue1} style={{ paddingLeft: '30px', width: '40vw', maxWidth: '250px' }} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                    </span>
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ margin: '0px 10px', fontSize: '20px' }} />
                    {pathname == '/stations' && mapNavigatePath && (
                        <Button onClick={(e) => router.push(mapNavigatePath)} style={{ padding: '0px 10px', borderRadius: '50%' }}>
                            <i className="pi pi-map-marker" style={{ fontSize: '18px' }}></i>
                        </Button>
                    )}
                </div>
            </div>
        );
    };
    const header1 = renderHeader1();
    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };
    const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />
        );
    };

    const rowExpansionTemplate = (data: any) => {
        console.log(data.data);
        return (
            <div className="p-3" style={{ border: '2px solid white' }}>
                <DataTable value={data.data}>
                    {columns2.map((col) =>
                        !col.hidden ? (
                            <Column
                                key={col.key}
                                field={col.key}
                                header={col.label}
                                sortable
                                filter
                                body={col.body ? col.body : col.key === 'status' ? statusBodyTemplate : null}
                            //  filterElement={col.key === 'type' ? typeFilterTemplate : null}
                            />
                        ) : null
                    )}
                </DataTable>
            </div>
        );
    };
    const exportCSV = (selectionOnly: boolean) => {
        //export items as csv
        dt.current?.exportCSV({ selectionOnly });
    };

    return (
        <>
            <DataTable
                ref={dt}
                editMode={editMode}
                exportFunction={(e) => (typeof e.data === 'object' ? JSON.stringify(e.data).replace(',', ' ') : e.data)}
                value={items}
                paginator
                className="p-datatable-gridlines"
                showGridlines
                rows={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                dataKey="id"
                filters={filters1}
                filterDisplay="menu"
                loading={loading1}
                responsiveLayout="scroll"
                emptyMessage="No customers found."
                header={header1}
                size={'normal'}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                reorderableColumns
            >
                {columns.map((col, i) => {
                    return !col.hidden ? (
                        <Column
                            key={i}
                            field={col.key}
                            header={col.label}
                            sortable
                            filter={col.body == null || col.key === 'status' || col.key === 'type'}
                            body={col.body ? col.body : col.key === 'status' ? statusBodyTemplate : null}
                            filterElement={col.key === 'type' ? typeFilterTemplate : null}
                            editor={col.cellEditor ? (options) => col.cellEditor(options) : null}
                            onCellEditComplete={col.onCellEditComplete}
                        />
                    ) : null;
                })}
            </DataTable>
        </>
    );
};

export default CustomTable;
function isStatusOrTypeField(field: any) {
    throw new Error('Function not implemented.');
}

function getMatchMode(field: any) {
    throw new Error('Function not implemented.');
}
