'use client';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useEffect, useRef, useState } from 'react';

const CustomTable = ({ columns, columns2 = [], items, loading1, editMode }: { columns: any[]; columns2: any[]; items: any[]; loading1: any; editMode: string | undefined }) => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [statuses] = useState<string[]>(['personal', 'bike', 'car']);
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        initFilters1();

        return () => {};
    }, []);
    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.status} />;
    };
    const initFilters1 = () => {
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
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
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
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} className="px-3" />
                <span className="p-input-icon-left">
                    <span style={{ position: 'relative' }}>
                        <i className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '1.5px' }} />
                        <InputText value={globalFilterValue1} style={{ paddingLeft: '30px' }} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                    </span>
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ margin: '0px 10px' }} />
                </span>
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
                    {columns2.map((col) => (
                        <Column
                            key={col.key}
                            field={col.key}
                            header={col.label}
                            sortable
                            filter={col.key === 'type' || col.key === 'status' ? true : false}
                            body={col.body ? col.body : col.key === 'status' ? statusBodyTemplate : null}
                            filterElement={col.key === 'type' ? typeFilterTemplate : null}
                        />
                    ))}
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
            >
                {columns.map((col, i) => {
                    console.log(col);
                    return (
                        <Column
                            key={i}
                            field={col.key}
                            header={col.label}
                            sortable
                            filter={col.key === 'type' || col.key === 'status' ? true : false}
                            body={col.body ? col.body : col.key === 'status' ? statusBodyTemplate : null}
                            filterElement={col.key === 'type' ? typeFilterTemplate : null}
                            editor={col.cellEditor ? (options) => col.cellEditor(options) : null}
                            onCellEditComplete={col.onCellEditComplete}
                        />
                    );
                })}
                <Column expander={columns2.length > 0} style={{ width: '5rem' }} />
            </DataTable>
        </>
    );
};

export default CustomTable;
