import { baseUrl } from './common';
import { getErrorResponse, getSuccessResponse, webService } from './WebServices';

export async function getCity() {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.get(baseUrl + 'cities');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function setCity(data: any) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.post(baseUrl + 'city', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function updateCity(id: string, data: any) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.patch(baseUrl + 'city/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function deleteCity(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.delete(baseUrl + 'city/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function deleteStation(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.delete(baseUrl + 'station/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
//delete faq by id
export async function deleteFaq(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.delete(baseUrl + 'faq/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function deleteCoupons(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.delete(baseUrl + 'coupon/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function deletePlan(id: string) {
    debugger;
    let responseObj = { success: false, data: '' as any, message: '' };
    try {
        let response = await webService.delete(baseUrl + 'plan/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getFeedback() {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.get(baseUrl + 'feedback');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getReferral() {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.get(baseUrl + 'referral');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function updateStation(id: string, data: any) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.patch(baseUrl + 'station/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getColumns(userId: string, tableName: string) {
    let responseObj = { success: false, data: {} as any, message: '' };

    try {
        let response = await webService.get(baseUrl + 'selectedColumn/' + userId + '/' + tableName);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function setColumns(data: any) {
    let responseObj = { success: false, data: [] as any[], message: '' };

    try {
        let response = await webService.post(baseUrl + 'selectedColumn', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export function getUserID() {
    let userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData || !userData?.id) {
        return '';
    }
    return userData.id;
}
