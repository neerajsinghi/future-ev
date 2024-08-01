import axios from 'axios';

export function getSuccessResponse(response, responseObj) {
    let obj = { ...responseObj };
    if (response.data.result || response.data.status) {
        obj.success = true;
        obj.data = response.data.result || response.data.data || response.data.profile;
    }
    obj.message = response.data.message || response.data.token;
    return obj;
}
export function getErrorResponse(responseObj) {
    let obj = { ...responseObj };
    obj.success = false;
    obj.message = obj.error;
    return obj;
}

export const webService = {
    get: async function (url, skipError = false, isLogin = true) {
        let headersOb = {};
        if (isLogin) {
            headersOb = {
                sessionId: `fghfw-32b2-9232d-0001`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
        }
        return await axios
            .get(url, {
                headers: headersOb
            })
            .catch((e) => {
                if (e.response !== undefined) {
                    console.log(e.response);
                    if (e.response.status === 401 || e.response.status === 403) {
                        messageF.error('You are not allowed to perform this function. Please sign out and relogin.');
                    } else if ((e.response.status === 504 || e.response.status === 502) && skipError === false) {
                        messageF.error('Server error');
                        return;
                    }
                }
                throw e.response;
            });
    },
    post: async function (url, apidata, skipError = false, isLogin = true) {
        let headersOb = {};
        if (isLogin) {
            headersOb = {
                sessionId: `fghfw-32b2-9232d-0001`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
        }
        return axios.post(url, apidata).catch((e) => {
            console.log('e in post', e);
            if (e.response !== undefined) {
                console.log(e.response);
                if (e.response.status === 401 || e.response.status === 403) {
                    messageF.error('You are not allowed to perform this function. Please sign out and relogin.');
                } else if ((e.response.status === 504 || e.response.status === 502) && skipError === false) {
                    messageF.error('Server error');
                    return;
                }
            }
            throw e.response;
        });
    },
    put: async function (url, apidata, skipError = false, isLogin = true) {
        let headersOb = {};
        if (isLogin) {
            headersOb = {
                sessionId: `fghfw-32b2-9232d-0001`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
        }
        return axios
            .put(url, apidata, {
                headers: headersOb
            })
            .catch((e) => {
                console.log('e in post', e);
                if (e.response !== undefined) {
                    console.log(e.response);
                    if (e.response.status === 401 || e.response.status === 403) {
                        messageF.error('You are not allowed to perform this function. Please sign out and relogin.');
                    } else if ((e.response.status === 504 || e.response.status === 502) && skipError === false) {
                        messageF.error('Server error');
                        return;
                    }
                }
                throw e.response;
            });
    },
    patch: async function (url, apidata, skipError = false, isLogin = true) {
        let headersOb = {};
        if (isLogin) {
            headersOb = {
                sessionId: `fghfw-32b2-9232d-0001`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
        }
        return axios
            .patch(url, apidata, {
                headers: headersOb
            })
            .catch((e) => {
                console.log('e in post', e);
                if (e.response !== undefined) {
                    console.log(e.response);
                    if (e.response.status === 401 || e.response.status === 403) {
                        messageF.error('You are not allowed to perform this function. Please sign out and relogin.');
                    } else if ((e.response.status === 504 || e.response.status === 502) && skipError === false) {
                        messageF.error('Server error');
                        return;
                    }
                }
                throw e.response;
            });
    },
    delete: async function (url, skipError = false, isLogin = true) {
        let headersOb = {};
        if (isLogin) {
            headersOb = {
                sessionId: `fghfw-32b2-9232d-0001`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            };
        }
        return axios
            .delete(url, {
                headers: headersOb
            })
            .catch((e) => {
                console.log('e in post', e);
                if (e.response !== undefined) {
                    console.log(e.response);
                    if (e.response.status === 401 || e.response.status === 403) {
                        messageF.error('You are not allowed to perform this function. Please sign out and relogin.');
                    } else if ((e.response.status === 504 || e.response.status === 502) && skipError === false) {
                        messageF.error('Server error');
                        return;
                    }
                }
                throw e.response;
            });
    }
};
