//  request.js
import { http } from "@tauri-apps/api";

class Req {
    constructor(config) {

    }

    interceptors = {
        baseURL: 'http://192.168.23.29:65004',
        requert: {
            headers: {},
            body: {},
            use: () => {

            }
        },
        response: response => {
            return new Promise((rec, rej) => {
                console.log('ECT', response)
                if (response.data.type == 'success') {
                    rec(response.data)
                }
            })
        }
    }
    post = (url, data) => {
        return new Promise(resolve => {
            const requestBody = { ...data, ...this.interceptors.requert.body }
            const requestHeaders = { ...this.interceptors.requert.headers }
            this.interceptors.requert.use();
            http.fetch(this.interceptors.baseURL + url, {
                headers: requestHeaders,
                method: 'POST',
                // 常规的json格式请求体发送
                body: http.Body.json(requestBody)
            }).then(res => {
                // res为请求成功的回调数据
                resolve(this.interceptors.response(res))
            });
        })
    }
    get = (url, data) => {
        return new Promise(resolve => {
            const requestQuery = { ...data, ...this.interceptors.requert.body }
            const requestHeaders = { ...this.interceptors.requert.headers }
            this.interceptors.requert.use();
            http.fetch(this.interceptors.baseURL + url, {
                headers: requestHeaders,
                method: 'GET',
                // 常规的json格式请求体发送
                query: requestQuery
            }).then(res => {
                // res为请求成功的回调数据
                resolve(this.interceptors.response(res))
            });
        })
    }
}

export default Req