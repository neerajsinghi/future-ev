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
