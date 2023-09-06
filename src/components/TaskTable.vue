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
          <a-progress
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#87d068',
            }"
            :percent="99.9"
          />
        </a>
      </template>
      <template v-else-if="column.key === 'operate'">
        <span @click="showDeleteConfirm()">
          <a>删除</a>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { Modal } from "ant-design-vue";
const columns = [
  {
    name: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
  },
  {
    title: "进度",
    dataIndex: "progress",
    key: "progress",
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
</script>
