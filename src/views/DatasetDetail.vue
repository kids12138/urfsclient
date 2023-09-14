<template>
  <div class="wrapper">
    <p>
      <a-row justify="space-between">
        <a-col :span="12"> <a-row>
            <a-col :span="24">数据集ID:{{ formState.id }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="12">数据集名称:{{ formState.name }}</a-col>
            <a-col :span="12">数据集描述:{{ formState.desc }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="12">副本个数:{{ formState.replica }}</a-col>
            <a-col :span="12"> <a-tag v-for="tag in formState.tags" :key="tag" :color="getLabel(tag).color">
                {{ getLabel(tag).content }}
              </a-tag></a-col>
          </a-row>
        </a-col>
        <a-col :span="12"><a-space warp>
            <a-button type="primary" @click="showUpload" v-if="show">上传</a-button>
            <a-button type="primary" @click="shareConfirm" disabled>分享</a-button>
            <a-button type="primary" @click="showDeleteConfirm">删除</a-button>
            <a-button type="primary" @click="edite">编辑</a-button>
            <a-button type="primary" v-if="show" disabled>下载</a-button>
          </a-space></a-col>
      </a-row>
    </p>
    <p>
      <a-select v-model:value="value" placeholder="Select a person" style="width: 200px" :options="options"
        @focus="handleFocus" @blur="handleBlur" @change="handleChange()"></a-select>
    </p>
    <p>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="数据集介绍">
          <a-textarea v-model:value="desc" class="m-1" disabled />
        </a-tab-pane>
        <a-tab-pane key="2" tab="数据集文件" force-render>
          <a-table :columns="columns" :data-source="data" /></a-tab-pane>
        <a-tab-pane key="3" tab="副本数据源"></a-tab-pane>
        <a-tab-pane key="4" tab="使用方法">
          <a-textarea v-model:value="use" class="m-1" disabled /></a-tab-pane>
      </a-tabs>
    </p>
    <operateDialg v-if="open2" @closeDatasetDialg="closeDatasetDialg" title="编辑数据集" />
    <a-modal v-model:open="open3" title="上传数据集" @ok="hideModal" :centered="true">
      <upload></upload>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { SelectProps } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode, watch, onMounted, reactive } from "vue";
import type { UnwrapRef } from "vue";
import { Modal } from "ant-design-vue";
import operateDialg from "../components/OperateDatasetDialg.vue";
import upload from "../components/Upload.vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import baseurl from "../util/baseURL"
import { http } from "@tauri-apps/api";
import getLabel from "../util/index"
const store = useStore();
const open2 = ref<boolean>(false);
const open3 = ref<boolean>(false);
const activeKey = ref("1");
const show = ref(false);
const id = ref<string>("")
interface FormState {
  name: string;
  desc: string;
  tags: [];
  replica: number;
  id: string
}
const formState: UnwrapRef<FormState> = reactive({
  name: "",
  desc: "",
  tags: [],
  replica: 0,
  id: ""
});
onMounted(() => {
  id.value = store.state.dataSetId
  getDetail(id.value)
  getVersion()
});
watch(activeKey, (val) => {
  if (val === "2") {
    show.value = true;
  } else {
    show.value = false;
  }
});
const edite = () => {
  open2.value = true;
};
const emit = defineEmits<{
  (event: "closeDetailDialg", val: boolean): void;
}>();
const handleOk = (e: MouseEvent) => {
  emit("closeDetailDialg", false);
};
const handleCancel = (e: MouseEvent) => {
  emit("closeDetailDialg", false);
};
const hideModal = (e: MouseEvent) => {
  open3.value = false;
};
interface optionType {
  label: string;
  value: string

}
const options: optionType[] = reactive([{ value: "default", label: "默认" }]);
const handleChange = () => {
  store.commit("changeDataSetVersion", value);
};
const handleBlur = () => {
  console.log("blur");
};
const handleFocus = () => {
  console.log("focus");
};
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const closeDatasetDialg = (val: boolean) => {
  open2.value = val;
  getDetail(id.value)
};
const showUpload = () => {
  open3.value = true;
};
const value = ref("默认");
const desc = ref("这是一段描述");
const use = ref("这是一段使用方法");
const columns = [
  {
    title: "文件名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
  },
];

interface DataItem {
  key: number;
  name: string;
  size: number;
  children?: DataItem[];
}

const data: DataItem[] = [
  {
    key: 1,
    name: "文件夹",
    size: 60,
    children: [
      {
        key: 11,
        name: "文件一",
        size: 42,
      },
      {
        key: 12,
        name: "文件二",
        size: 30,
        children: [
          {
            key: 121,
            name: "文件三",
            size: 16,
          },
        ],
      },
      {
        key: 13,
        name: "文件四",
        size: 72,
        children: [
          {
            key: 131,
            name: "文件五",
            size: 42,
            children: [
              {
                key: 1311,
                name: "文件六",
                size: 25,
              },
              {
                key: 1312,
                name: "文件七",
                size: 18,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: "文件夹",
    size: 32,
  },
];
const showDeleteConfirm = () => {
  Modal.confirm({
    title: "确认要删除该数据集吗",
    icon: createVNode(ExclamationCircleOutlined),
    content: "",
    okText: "确定",
    okType: "danger",
    cancelText: "取消",
    centered: true,
    onOk() {
      deleteDataset(id.value)
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
const shareConfirm = () => {
  Modal.confirm({
    title: "确认要分享改版本数据集?",
    icon: createVNode(ExclamationCircleOutlined),
    content: "分享成功，可以在公共数据集中查看",
    centered: true,
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
    class: "test",
  });
};
async function getDetail(id: String) {
  const res = await http.fetch(baseurl + '/api/v1/dataset/' + id, {
    method: 'GET',
    timeout: 6000
  })
  if (res.data.status_msg === "succeed") {
    formState.name = res.data.dataset.name
    formState.id = res.data.dataset.id
    formState.desc = res.data.dataset.desc
    formState.tags = res.data.dataset.tags
    formState.replica = res.data.dataset.replica
  }
}
async function getVersion() {
  const res = await http.fetch(baseurl + '/api/v1/dataset/' + id + "/versions", {
    method: 'GET',
    timeout: 6000
  })
  if (res.data.status_msg === "Succeed") {
    if(!res.data.versions){
      res.data.versions=[]
    }
    res.data.versions.forEach(item => {
      options.push({ value: item.id, label: item.name })
    })
  } else { message.warning("获取版本列表失败"); }
}
async function deleteDataset(id: String) {
  const res = await http.fetch(baseurl + '/api/v1/dataset/' + id, {
    method: 'DELETE',
    timeout: 6000
  })
  if (res.data.status_msg === "succeed") {
    message.success("删除数据集成功");
    store.commit("changedataSetNumber");
    store.commit("changeDataPage", "list");
  } else {
    message.warning("删除数据集失败");
  }
}
</script>
<style scoped>
.m-1 {
  margin-top: 5px;
}

.wrapper {
  padding: 50px;
  height: 100vh;
}

:deep(.ant-space) {
  float: right;
}
</style>
