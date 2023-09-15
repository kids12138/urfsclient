<template>
    <a-table :columns="columns" :data-source="data" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
                <a>
                    {{ record.name }}
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
                    <a @click="stop_upload(record.id)">暂停</a>
                </span>
                <span @click="terminate_upload(record.id)" class="m-l" v-if="record.state !== 'Stop'">
                    <a>终止</a>
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
import { useInternalMessage } from "ant-design-vue/es/message/useMessage";
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
        width: "300px",
        align:"center"
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: "400px",
        align:"center"
    },
    {
        title: "操作",
        key: "operate",
        align:"center"
    },
];
interface dataType {
    id: string,
    state: string | Number | any,
    name: string
}
const data: dataType[] = reactive([]);
async function stop_upload(id: string) {
    try {
        const res = await invoke("stop_upload", {
            req: JSON.stringify({
                dataset_id: id.split(":")[0],
                dataset_version_id: id.split(":")[1],
            }),
        });
        message.success("暂停上传成功");
    } catch (err: any) {
        message.error("暂停上传出错：", err);
        console.log(err, "err")
        // error(`暂停上传出错: ${err}`);
    }
}

async function terminate_upload(id: string) {
    try {
        console.log(id)
        const res = await invoke("terminate_upload", {
            req: JSON.stringify({
                dataset_id: id.split(":")[0],
                dataset_version_id: id.split(":")[1],
            }),
        });
        message.success("终止上传成功");
    } catch (err: any) {
        message.error("终止上传出错：", err);
        console.log(err, "err")
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
            Data = Data["payload_json"]
            if (typeof Data === "string") {
                Data = JSON.parse(Data)
                let arr = []
                for (let i = 0; i < Object.keys(Data).length; i++) {
                    arr.push({ name: Object.keys(Data)[i], state: Data[Object.keys(Data)[i]] })
                }
                if (arr instanceof Array && arr.length !== 0) {
                    arr.forEach((item: { name: string, state: any }) => {
                        if (typeof item.state === "string") {
                            if (item.state === props.state) {
                                data.push({ id: item.name, state: item.state, name: "" })
                            }
                        } else if (typeof item.state === "object" && props.state == "Uploading") {
                            data.push({ id: item.name, state: parseFloat(item.state.Uploading), name: "" })
                        }
                    })
                    getName(data)
                }
            }

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
    data.forEach(async (item: { id: string, name: string }) => {
        const datasetId = item.id.split(":")[0]
        const datasetVersion = item.id.split(":")[1]
        try {
            const res: any = await http.fetch(config.baseURL + '/api/v1/dataset/' + datasetId, {
                method: 'GET',
                timeout: config.timeout
            })
            if (res.data["status_msg"] == "succeed") {
                item.name = res.data.dataset.name + ":" + datasetVersion
                console.log(item.name)
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
