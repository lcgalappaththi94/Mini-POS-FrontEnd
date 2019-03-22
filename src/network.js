const ip = 'https://mini-pos-backend.herokuapp.com';
const baseURL = `${ip}`;
const NetworkCall = (url, method, headers, body) => {
    let init = {method: method};
    if (headers) {
        init.headers = headers;
    }
    if (body) {
        init.body = body;
    }
    return fetch(baseURL + url, init);
};

module.exports = NetworkCall;