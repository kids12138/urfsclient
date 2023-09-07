<template>
  <div>
    <a-table
      :columns="type ? columns1 : columns2"
      :data-source="data"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a @click="showDetail()">
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag v-for="tag in record.tags" :key="tag" :color="tag.color">
              {{ tag.content }}
            </a-tag>
          </span>
        </template>
      </template>
    </a-table>
    <a-row justify="end" class="bg">
      <a-col :span="10">
        <a-pagination
          v-model:current="current"
          :total="50"
          show-less-items
          @change="handleTableChange"
      /></a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import DetailDialg from "./DetailDialog.vue";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
const type = ref(false);
onMounted(() => {
  if (store.state.dataType === "persional") {
    type.value = false;
  } else {
    type.value = true;
  }
});
watch(
  () => store.state.dataType,
  (val) => {
    if (val === "persional") {
      type.value = false;
    } else {
      type.value = true;
    }
  }
);
const columns1 = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
  },
];
const columns2 = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
];
const data = [
  {
    key: "1",
    name: "文件一",
    tags: [
      { color: "pink", content: "中文分词" },
      { color: "red", content: "图像分类" },
    ],
    desc: "这是一段描述",
    updateTime: "2023-9-4",
    author: "xxx",
  },
  {
    key: "2",
    name: "文件二",
    tags: [
      { color: "pink", content: "中文分词" },
      { color: "red", content: "图像分类" },
    ],
    desc: "这是一段描述",
    updateTime: "2023-9-4",
    author: "xxx",
  },
  {
    key: "3",
    name: "文件三",
    tags: [
      { color: "pink", content: "中文分词" },
      { color: "red", content: "图像分类" },
    ],
    desc: "这是一段描述",
    updateTime: "2023-9-4",
    author: "xxx",
  },
];
const showDetail = () => {
  store.commit("changeDataPage", "detail");
};

const current = ref(1);
const handleTableChange = (e: any) => {
  console.log(e);
};
</script>
<style scoped>
.bg {
  background-color: #fff;
  padding: 10px 0 10px 0;
}
:deep(.ant-pagination) {
  text-align: right;
}
</style>
