<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        <a>
          {{ record.id }}
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
import { Modal } from "ant-design-vue";
import { invoke } from "@tauri-apps/api/tauri";
import { message } from "ant-design-vue";
import { info, error } from "tauri-plugin-log-api";
import { onMounted, reactive, onUnmounted, ref } from 'vue'
import baseurl from "../util/baseURL"
import { http } from "@tauri-apps/api";
const timer = ref()
onMounted(() => {
  data.length=0
  timer.value = setInterval(get_history, 2000);
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
    width: "500px"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: "300px"
  },
  {
    title: "操作",
    key: "operate",
  },
];
interface dataType {
  id: string,
  state: string | Number | any
}
const data: dataType[] = reactive([]);
const showDeleteConfirm = () => {
  Modal.confirm({
    title: "确认要删除该数据集吗",
    content: "",
    okText: "确定",
    okType: "danger",
    cancelText: "取消",
    centered: true,
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

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
          data.length = 0
          arr.forEach((item) => {
            if (typeof item.state === "string" && item.state === props.state) {
              data.push({ id: item.name, state: item.state })

            } else if (typeof item.state === "object"&&item.state.Uploading) {
              data.push({ id: item.name, state: parseFloat(item.state.Uploading) })
            }
          })
          console.log(data,props.state)
        }
      }


    }

  } catch (err: any) {
    message.error("获取文件上传历史错误：", err);
    console.log(err, "err")
  }
}
// const getName = (id: String) => {
//   http.fetch(baseurl + '/api/v1/dataset/' + id, {
//     method: 'GET',
//     timeout: 6000
//   }).then(res=>{if(res.data["status_msg"]=="succeed"){
//     return res.data.dataset.name
//    }})
// };
</script>
<style scoped>
.m-l {
  margin-right: 20px;
}
</style>
