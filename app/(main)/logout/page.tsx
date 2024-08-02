'use client';

import { showToast } from '@/app/hooks/toast';
import { useEffect } from 'react';

const Logout = () => {
    showToast('Logout Successful', 'success');

    useEffect(() => {
        localStorage.clear();
        window.location.href = '/';
    }, []);
};

export default Logout;
