'use client';

import useIsAccessible from '@/app/hooks/isAccessible';

const Reports = () => {
    const isAccessible = useIsAccessible('reports');

    return (
        <div>
            {isAccessible === 'None' && <h1>You Dont Have Access To View This Page</h1>}
            {(isAccessible === 'Edit' || isAccessible === 'View') && <h1>Reports</h1>}
        </div>
    );
};

export default Reports;
