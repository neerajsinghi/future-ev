'use client';

import { showToast } from '@/app/hooks/toast';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        showToast('Logout Successful', 'success');
        localStorage.clear();
        Cookies.remove('access');
        Cookies.remove('userId');
        window.location.href = '/';
    }, []);
};

export default Logout;
