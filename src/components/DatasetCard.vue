<template>
  <div style="background-color: #ececec; padding: 20px">
    <a-row :gutter="16">
      <a-col :span="8" v-for="(item, index) in cardList" :key="index">
        <a-card
          :title="item.name"
          :bordered="false"
          class="cardStyle"
          @click="showDetail()"
        >
          <a-tag
            v-for="(Item, index) in item.label"
            :key="index"
            :color="Item.color"
            >{{ Item.content }}</a-tag
          >
          <p class="mt-1">{{ item.des }}</p>
          <p>
            <span class="m-1">{{ item.updateTime }}</span
            ><span class="m-1" v-if="show">{{ item.author }}</span>
          </p>
        </a-card>
      </a-col>
    </a-row>
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
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ReqGY from "../api/dataSet.js";
const router = useRouter();
const store = useStore();
const show = ref<boolean>(false);
onMounted(() => {
  if (store.state.dataType === "persional") {
    show.value = false;
    ReqGY.getDatasetList().then(res=>{
    })
  } else {
    show.value = true;
  }
});
watch(
  () => store.state.dataType,
  (val) => {
    if (val === "persional") {
      show.value = false;
    } else {
      show.value = true;
    }
  }
);
interface cardType {
  name: string;
  des: string;
  label: label[];
  updateTime: string;
  author: string;
}
interface label {
  color: string;
  content: string;
}
const cardList: cardType[] = reactive([]);
cardList.push({
  name: "title",
  des: "this is des",
  label: [
    { color: "pink", content: "中文分词" },
    { color: "red", content: "图像分类" },
  ],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
cardList.push({
  name: "title",
  des: "this is des",
  label: [{ color: "pink", content: "中文分词" }],
  updateTime: "2023-9-4",
  author: "鹏城实验室",
});
const current = ref(1);
const handleTableChange = (e: any) => {
  console.log(e);
};
const showDetail = () => {
  store.commit("changeDataPage", "detail");
};
</script>
<style scoped>
.cardStyle {
  margin-bottom: 25px;
}
.ant-card {
  height: 220px;
}
.bg {
  background-color: #fff;
  padding: 10px 0 10px 0;
}
:deep(.ant-card-head-title) {
  color: #646cff;
}
:deep(.ant-card-head-title:hover) {
  cursor: pointer;
}
.m-1 {
  margin: 20px;
}
.mt-1 {
  margin-top: 10px;
}
:deep(.ant-pagination) {
  text-align: right;
}
</style>
