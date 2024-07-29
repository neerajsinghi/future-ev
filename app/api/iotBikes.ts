import { baseUrl } from './common';
import { getErrorResponse, getSuccessResponse, webService } from './WebServices';

export async function getBikes() {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bikes');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getBikesNearby(lat: number, long: number) {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bikes/near?lat=' + lat + '&long=' + long + '&distance=1000');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getPlans(type = '') {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.get(baseUrl + 'plan?type=' + type);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function setPlan(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'plan', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function updatePlan(data: any, id: string) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.patch(baseUrl + 'plan/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getFaq() {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.get(baseUrl + 'faq');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function setFaq(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'faq', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function updateFaq(data: any, id: string) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.patch(baseUrl + 'faq/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getVehicleTypes() {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'vehicle/type');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function setVehicleType(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'vehicle/type', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function updateStation(id: string, data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.patch(baseUrl + 'station/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getStations() {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'station');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getBikeByStation(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bike/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getBikeByDevice(id: string) {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bike/device/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getStationsByID(id: string) {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'station/id/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function setBikeStand(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'bike', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getBikeStand() {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bike');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function createService(data: any) {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.post(baseUrl + 'service', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getServices() {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'service');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getCoupons() {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'coupon');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function createCoupon(data: any) {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.post(baseUrl + 'coupon', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getChargers() {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'charger');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getUsers(type = '') {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'users?type=' + type);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

// export async function getUsersByCategory(category: string, value: string | number | Date) {
//     let responseObj = { success: false, data: [] as any[], message: '' };
//     try {
//         let url = `${baseUrl}users?category=${category}&value=${value}`;
//         let response = await webService.get(url);
//         responseObj = getSuccessResponse(response, responseObj);
//     } catch {
//         responseObj = getErrorResponse(responseObj);
//     }
//     return responseObj;
// }

export async function addUser(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    data['phoneNumber'] = data.phone;
    try {
        let response = await webService.post(baseUrl + 'register', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function updateUser(data: any, id: string) {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.patch(baseUrl + 'users/' + id, data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function addCharger(data: any) {
    let responseObj = { success: false, data: null, message: '' };
    try {
        let response = await webService.post(baseUrl + 'coupon', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getMyWallet(id: string) {
    let responseObj = { success: false, data: {} as any, message: '' };
    try {
        let response = await webService.get(baseUrl + 'wallet/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getWallet() {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'wallet/');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
export async function getMyBookings(id: string) {
    let responseObj = { success: false, data: [], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bookings/my/' + id);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getBookings(bType = '') {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'bookings?type=' + bType);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function sendNotif(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'notification/multiple', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getNotif() {
    let responseObj = { success: false, data: [] as any[], message: '' };
    try {
        let response = await webService.get(baseUrl + 'notification');
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function setStation(data: any) {
    let responseObj = { success: false, data: null, message: '' };

    try {
        let response = await webService.post(baseUrl + 'station', data);
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}

export async function getStatistics(duration: number) {
    let responseObj = { success: false, data: [] as any[], message: '' };
    //get startdate and enddate based on duration
    let startDate = new Date();
    let endDate = new Date();
    switch (duration) {
        case 1:
            startDate.setDate(startDate.getDate() - 1);
            break;
        case 2:
            endDate.setDate(endDate.getDate() - 1);
            startDate.setDate(startDate.getDate() - 2);
            break;
        case 7:
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 30:
            startDate.setDate(startDate.getDate() - 30);
            break;
        case 365:
            startDate.setDate(startDate.getDate() - 365);
            break;
        default:
            startDate.setDate(startDate.getDate() - 1);
            break;
    }
    try {
        let response = await webService.get(baseUrl + 'statistics?startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString());
        responseObj = getSuccessResponse(response, responseObj);
    } catch {
        responseObj = getErrorResponse(responseObj);
    }
    return responseObj;
}
