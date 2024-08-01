import { useState, useEffect } from 'react';

interface AccessItem {
    Key: string;
    Value: 'None' | 'View' | 'Edit';
}

const useIsAccessible = (key: string): string | null => {
    const [isAccessible, setIsAccessible] = useState<'None' | 'View' | 'Edit' | null>(null);

    useEffect(() => {
        const accessData: AccessItem[] = JSON.parse(localStorage.getItem('access') || '[]');
        const accessItem = accessData.find((item) => item.Key === key);

        if (accessItem) {
            switch (accessItem.Value) {
                case 'Edit':
                    setIsAccessible('Edit');
                    break;
                case 'View':
                    setIsAccessible('View');
                    break;
                case 'None':
                    setIsAccessible('None');
                    break;
                default:
                    setIsAccessible('None');
            }
        } else {
            setIsAccessible('None');
        }
    }, [key]);

    return isAccessible;
};

export default useIsAccessible;
