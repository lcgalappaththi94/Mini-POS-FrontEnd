const ip = 'localhost';
const baseURL = `http://${ip}:8081`;
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