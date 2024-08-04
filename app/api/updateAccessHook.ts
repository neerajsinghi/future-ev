import { useState } from 'react';

// Custom hook for local storage
function useLocalStorage(key: string) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem('access');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return [];
        }
    });

    const setValue = (value: any) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage', error);
        }
    };

    const updateValue = (updates: any) => {
        console.log(updates);
        try {
            const updatedValue = storedValue.map((item: { Key: string; Value: 'Edit' | 'View' | 'None' | null }) => {
                if (updates[item.Key] !== undefined) {
                    return { ...item, Value: updates[item.Key] };
                }
                return item;
            });
            console.log(updatedValue);
            setValue(updatedValue);
        } catch (error) {
            console.error('Error updating localStorage', error);
        }
    };

    return { storedValue, setValue, updateValue };
}

export default useLocalStorage;
