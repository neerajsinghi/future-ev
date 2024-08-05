'use client';

import { showToast } from '@/app/hooks/toast';
import { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        showToast('Logout Successful', 'success');
        localStorage.clear();
        window.location.href = '/';
    }, []);
};

export default Logout;
