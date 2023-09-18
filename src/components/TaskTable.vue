<template>
    <a-table :columns="columns" :data-source="data" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
                <a>
                    {{ record.name }}
                </a>
            </template>
            <template v-if="column.key === 'version'">
                <a>
                    {{ record.version }}
                </a>
            </template>
            <template v-if="column.key === 'size'">
                <a v-if="record.state == 'Init'">
                    计算中
                </a>
                <a v-else>
                    {{ record.state }}
                </a>
            </template>
            <template v-if="column.key === 'path'">
                <a>
                    {{ record.path }}
                </a>
            </template>
            <template v-if="column.key === 'createDate'">
                <a>
                    {{ record.createDate }}
                </a>
            </template>
            <template v-if="column.key === 'status'">
                <a-progress :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }" :percent="record.state" v-if="typeof (record.state) == 'number'" />
                <a v-if="typeof (record.state) == 'string'">
                    {{ record.state }}
                </a>
            </template>
            <template v-else-if="column.key === 'operate'">
                <span class="m-l" v-if="record.state !== 'Stop'">
                    <a @click="stop_upload(record)">暂停</a>
                </span>
                <span @click="terminate_upload(record)" class="m-l" v-if="record.state !== 'Stop'">
                    <a>终止</a>
                </span>
                <span @click="restart_upload(record)" class="m-l"
                    v-if="record.state === 'Stop' || record.state === 'Failed'">
                    <a>重新上传</a>
                </span>
            </template>
        </template>
    </a-table>
</template>
<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/tauri";
import { message } from "ant-design-vue";
import { info, error } from "tauri-plugin-log-api";
import { onMounted, reactive, onUnmounted, ref } from 'vue'
import config from "../util/config"
import { http } from "@tauri-apps/api";
import { formatSize } from "../util/index"
import moment from "moment";
const timer = ref()
onMounted(() => {
    data.length = 0
    timer.value = setInterval(get_history, 5000);
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
        width: "120px",
        align: "center"
    },
    {
        title: "版本",
        dataIndex: "version",
        key: "version",
        width: "120px",
        align: "center"
    },
    {
        title: "大小",
        dataIndex: "size",
        key: "size",
        width: "80px",
        align: "center"
    },
    {
        title: "路径",
        key: "path",
        align: "center",
        width: "120px",
        dataIndex: "path",
    },
    {
        title: "创建时间",
        key: "createDate",
        align: "center",
        width: "220px",
        dataIndex: "createDate",
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: "120px",
    },
    {
        title: "操作",
        key: "operate",
        align: "center"
    },
];
interface dataType {
    id: string,
    state: string | Number | any,
    name: string | null,
    size: string | Number,
    path: string,
    createDate: string,
    version: string

}
const data: dataType[] = reactive([]);
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
        if (res.status_code == 0) {
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
        if (res.status_code == 0) {
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
        if (res.status_code == 0) {
            message.success("终止上传成功");
        } else {
            message.warning("终止上传失败")
        }
    } catch (err: any) {
        message.error("终止上传出错：", err);
        // error(`终止上传出错: ${err}`);
    }
}
async function get_history() {
    try {
        info("[ui] click get_history btn");
        data.length = 0
        let res = await invoke("get_history", { req: JSON.stringify({ req: "{}" }) });
        if (typeof res === "string") {
            let Data = JSON.parse(res)
            Data = JSON.parse(Data["payload_json"])
            Data.forEach((item: { dataset_id: string, local_dataset_path: string, create_timestamp: string, dataset_status: any, dataset_version_id: string, local_dataset_size: string }) => {
                if (typeof item.dataset_status === "string") {
                    if (item.dataset_status === props.state) {
                        data.push({ id: item.dataset_id, state: item.dataset_status, size: formatSize(item.local_dataset_size.toString()), path: item.local_dataset_path, createDate: moment(parseInt(item.create_timestamp) * 1000).format('YYYY-MM-DD-HH:mm:ss'), version: item.dataset_version_id, name: "" })
                    }
                } else if (typeof item.dataset_status === "object" && props.state == "Uploading") {
                    data.push({ id: item.dataset_id, state: parseFloat(item.dataset_status.Uploading), size: formatSize(item.local_dataset_size.toString()), path: item.local_dataset_path, createDate: moment(parseInt(item.create_timestamp) * 1000).format('YYYY-MM-DD-HH:mm:ss'), version: item.dataset_version_id, name: "" })
                }
            })
            getName(data)
        }
    } catch (err: any) {
        message.error("获取文件上传历史错误：", err);
        console.log(err, "err")
    }
}
const getName = (data: any) => {
    if (!data) {
        data = []
    }
    data.forEach(async (item: { id: string, name: string, }) => {
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



};
</script>
<style scoped>
.m-l {
    margin-right: 20px;
}
</style>
