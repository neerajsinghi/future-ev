import { getErrorResponse, getSuccessResponse, webService } from './WebServices';

export async function userLogin(username: string, password: string) {
    let responseObj = { success: false, data: null, message: '' };
    const body = {
        email: username,
        password: password
    };

    try {
        let response = await webService.post('http://3.110.123.55:1995/api/v1/email/login', body);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export function flattenData(data: { [x: string]: any; hasOwnProperty: (arg0: string) => any }, prefix = '', result = {} as any) {
    for (const key in data) {
        if (!data.hasOwnProperty(key)) continue;

        const value = data[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            flattenData(value, newKey, result); // Recurse for nested objects
        } else {
            // Handle potential conflicts with numbered suffixes
            let uniqueKey = newKey;
            let counter = 1;
            while (result.hasOwnProperty(uniqueKey)) {
                uniqueKey = `${newKey}_${counter}`;
                counter++;
            }
            result[uniqueKey] = value;
        }
    }
    return result;
}
