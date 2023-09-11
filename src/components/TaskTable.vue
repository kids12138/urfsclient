<template>
  <a-table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>名称</span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'progress'">
        <a>
          <a-progress :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }" :percent="99.9" />
        </a>
      </template>
      <template v-else-if="column.key === 'operate'">
        <span @click="stop_upload()" class="m-l">
          <a @click="stop_upload()">暂停</a>
        </span>
        <span @click="terminate_upload()" class="m-l">
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
import { onMounted } from 'vue'
onMounted(() => {
  get_history()
})
const columns = [
  {
    name: "名称",
    dataIndex: "name",
    key: "name",
    width: "150px"
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: "150px"
  },
  {
    title: "进度",
    dataIndex: "progress",
    key: "progress",
    width: "300px"
  },
  {
    title: "操作",
    key: "operate",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    size: 32,
    progress: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    size: 42,
    progress: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    size: 32,
    progress: "Sidney No. 1 Lake Park",
  },
];
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

async function stop_upload() {
  try {
    await invoke("stop_upload", {
      req: JSON.stringify({
        dataset_id: "xxx",
        dataset_version_id: "default",
      }),
    });
    message.success("暂停上传成功");
  } catch (err: any) {
    message.error("暂停上传出错：", err);
    error(`暂停上传出错: ${err}`);
  }
}

async function terminate_upload() {
  try {
    await invoke("terminate_upload", {
      req: JSON.stringify({
        dataset_id: "xxx",
        dataset_version_id: "default",
      }),
    });
    message.success("终止上传成功");
  } catch (err: any) {
    message.error("终止上传出错：", err);
    error(`终止上传出错: ${err}`);
  }
}
async function get_history() {
  try {
    info("[ui] click get_history btn");
    let data=await invoke("get_history", { req: JSON.stringify({ req: "{}" }) });
    console.log(data["payload_json"],"TEST")
    message.success("获取文件上传历史成功");
  } catch (err: any) {
    message.error("终止上传错误：", err);
  }
}
</script>
<style scoped>
.m-l {
  margin-right: 20px;
}
</style>
