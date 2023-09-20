<template>
    <a-table :columns="columns" :data-source="taskList" :pagination="false" :loading=show>
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
                <span style="width:180px!important">{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'version'">
                <span>
                    {{ record.version }}
                </span>
            </template>
            <template v-if="column.key === 'size'">
                <span v-if="record.state == 'Init'">
                    计算中
                </span>
                <span v-else>
                    {{ record.size }}
                </span>
            </template>
            <template v-if="column.key === 'path'">
                <span>
                    {{ record.path }}
                </span>
            </template>
            <template v-if="column.key === 'createDate'">
                <span>
                    {{ record.createDate }}
                </span>
            </template>
            <template v-if="column.key === 'status'">
                <a-progress :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }" :percent="parseInt(record.state)" v-if="typeof (record.state) == 'number'" />
                <span v-if="typeof (record.state) == 'string'">
                    {{ record.state }}
                </span>
            </template>
            <template v-else-if="column.key === 'operate'">
                <span class="m-l" v-if="props.state == 'Uploading'">
                    <a @click="stop_upload(record)">暂停</a>
                </span>
                <span @click="terminate_upload(record)" class="m-l">
                    <a>删除</a>
                </span>
                <span @click="restart_upload(record)" class="m-l" v-if="props.state === 'Stop' || props.state === 'Failed'">
                    <a>重新上传</a>
                </span>
            </template>
        </template>
    </a-table>
</template>
<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/tauri";
import { message, px2remTransformer } from "ant-design-vue";
import { info, error } from "tauri-plugin-log-api";
import { onMounted, reactive, onUnmounted, ref } from 'vue'
import config from "../util/config"
import { http } from "@tauri-apps/api";
import { formatSize } from "../util/index"
import moment from "moment";
const timer = ref()
onMounted(() => {
    // timer.value = setInterval(get_history, 1000);
    // sessionStorage.clear()
    get_history()
})
onUnmounted(() => {
    clearTimeout(timer.value)
    timer.value = ""
})
const props = defineProps({
    state: {
        type: String,
        default: ""
    }
});
const columns = [
    {
        title: "名称",
        dataIndex: "name",
        key: "id",
        width: "150px",
        align: "center",
        resizable: false,
    },
    {
        title: "版本",
        dataIndex: "version",
        key: "version",
        width: "120px",
        align: "center",
        resizable: false,
    },
    {
        title: "大小",
        dataIndex: "size",
        key: "size",
        width: "150px",
        align: "center",
        resizable: false,
    },
    {
        title: "路径",
        key: "path",
        align: "center",
        width: "120px",
        dataIndex: "path",
        resizable: false,
    },
    {
        title: "创建时间",
        key: "createDate",
        align: "center",
        width: "220px",
        dataIndex: "createDate",
        resizable: false,
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: "180px",
        resizable: false,
    },
    {
        title: "操作",
        key: "operate",
        align: "center",
        width: "220px",
        resizable: false,
    },
];
interface dataType {
    id: string,
    state: string | Number | any,
    size: string | Number,
    path: string,
    createDate: string,
    version: string

}
interface taskType {
    id: string,
    state: string | Number | any,
    name: string | null,
    size: string | Number,
    path: string,
    createDate: string,
    version: string

}
let data: dataType[] = [];
let allTaskData: taskType[] = [];
let taskData: taskType[] = [];
const taskList: taskType[] = reactive([]);
const show = ref<boolean>(true);
async function restart_upload(record: dataType) {
    try {
        var res: any = await invoke("start_upload", {
            req: JSON.stringify({
                dataset_id: record.id,
                dataset_version_id: record.version,
                dataset_source: record.path,
                server_endpoint: config.baseURL
            })
        });
        let Data = JSON.parse(res)
        if (Data.status_code == 0) {
            message.success('上传请求已发送');
            info(`上传请求返回: ${res}`);
        }
        else {
            message.warning("上传请求失败")
        }

    } catch (err: any) {
        message.error('上传出错：', err);
        error(`上传出错: ${err}`);
    }
}
async function stop_upload(record: dataType) {
    try {
        const res: any = await invoke("stop_upload", {
            req: JSON.stringify({
                dataset_id: record.id,
                dataset_version_id: record.version,
            }),
        });
        let Data = JSON.parse(res)
        if (Data.status_code == 0) {
            message.success("暂停上传成功");
        } else {
            message.warning("暂停上传失败")
        }
    } catch (err: any) {
        message.error("暂停上传出错：", err);
        // error(`暂停上传出错: ${err}`);
    }
}

async function terminate_upload(record: dataType) {
    try {
        const res: any = await invoke("terminate_upload", {
            req: JSON.stringify({
                dataset_id: record.id,
                dataset_version_id: record.version,
            }),
        });
        let Data = JSON.parse(res)
        if (Data.status_code == 0) {
            message.success("删除任务成功");
        } else {
            message.warning("删除任务失败",Data)
        }
    } catch (err: any) {
        message.error("删除任务出错：", err);
        // error(`终止上传出错: ${err}`);
    }
}
async function get_history() {
    try {
        info("[ui] click get_history btn");
        let res: any = await invoke("get_history", { req: JSON.stringify({ req: "{}" }) });
        if (typeof res === "string") {
            let Data = JSON.parse(res)
            Data = JSON.parse(Data["payload_json"])
            if(Data["payload_json"]){
            data.length = 0
            Data.forEach((item: { dataset_id: string, local_dataset_path: string, create_timestamp: string, dataset_status: any, dataset_version_id: string, local_dataset_size: string }) => {
                if (typeof item.dataset_status === "string") {
                    data.push({ id: item.dataset_id, state: item.dataset_status, size: formatSize(item.local_dataset_size.toString()), path: item.local_dataset_path, createDate: moment(parseInt(item.create_timestamp) * 1000).format('YYYY-MM-DD-HH:mm:ss'), version: item.dataset_version_id, })
                } else {
                    data.push({ id: item.dataset_id, state: parseFloat(item.dataset_status.Uploading), size: formatSize(item.local_dataset_size.toString()), path: item.local_dataset_path, createDate: moment(parseInt(item.create_timestamp) * 1000).format('YYYY-MM-DD-HH:mm:ss'), version: item.dataset_version_id, })
                }
            })
            getTaskList(data)}
            else{show.value=true}
        }
    } catch (err: any) {
        message.error("获取文件上传历史错误：", err);
        console.log(err, "err")
    }
}
const getTaskList = (data: any) => {
    if (!data) {
        data = []
    }
    data.forEach(async (item: {
        id: string,
        name: string,
        size: string | Number,
        path: string,
        createDate: string,
        version: string,
        state: string | Number | any,
    }) => {
        const datasetId = item.id
        try {
            const res: any = await http.fetch(config.baseURL + '/api/v1/dataset/' + datasetId, {
                method: 'GET',
                timeout: config.timeout
            })
            if (res.data["status_msg"] == "succeed") {
                item.name = res.data.dataset.name
            }

        } catch (err: any) {
            message.error("err", err);
        }
    })
    allTaskData.length = 0
    data.forEach((item: any) => {
        allTaskData.push(item)
    })
    timer.value = setInterval(updateState, 1000);

};
async function updateState() {
    taskData.length = 0
    allTaskData.forEach((item: any) => {
        if (typeof item.state == "string") {
            taskData.push(item)
        } else {
            if (typeof item.state == "number") {
                taskData.push(item)
            }
        }
    }
    )
    try {
        info("[ui] click get_history btn");
        let res: any = await invoke("get_history", { req: JSON.stringify({ req: "{}" }) });
        if (typeof res === "string") {
            let Data = JSON.parse(res)
            Data = JSON.parse(Data["payload_json"])
            interface stateData {
                id: string,
                state: string | Object
            }
            let stateData: stateData[] = reactive([]);
            Data.forEach((item: { dataset_id: string, dataset_status: any }) => {
                if (typeof item.dataset_status === "string") {
                    if (typeof item.dataset_status === "string") {
                        stateData.push({ id: item.dataset_id, state: item.dataset_status, })
                    }
                } else if (typeof item.dataset_status === "object" && props.state == "Uploading") {
                    stateData.push({ id: item.dataset_id, state: parseFloat(item.dataset_status.Uploading) })
                }
            })
            taskData.forEach((item: { id: string; state: string | Object; }) => {
                stateData.forEach(Item => {
                    if (item.id === Item.id) {
                        item.state = Item.state
                    }
                })
            })
            // console.log("过滤前表格", taskData, "当前状态", props.state)
            taskData= taskData.filter(item => {
                if (typeof item.state == "string" && item.state === props.state) {
                   return item
                } else if (typeof item.state == "number" && props.state === "Uploading") {
                   return item
                }
            })
            taskList.length=0
            taskData.forEach(item=>{
                taskList.push(item)
            })
            show.value=false
            // console.log("过滤后表格", taskList, "当前状态", props.state)

        }
    } catch (err: any) {
        message.error("获取文件上传历史错误：", err);
        console.log(err, "err")
    }
}
</script>
<style scoped>
.m-l {
    margin-right: 20px;
}

:deep(.ant-table) {
    min-height: 352px !important;
}

:deep(.ant-empty-normal) {
    margin: 10px 0 !important;
}

:deep(.ant-table-placeholder) {
    height: 100px;

}

:deep(.ant-empty) {
    display: none;
}
</style>
