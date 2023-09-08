import Req from "../utils/request.js";
const myReq = new Req()

const ReqGY = {

    getDatasetList: async info => { return myReq.post('/api/v1/datasets', info) },



}

export default ReqGY