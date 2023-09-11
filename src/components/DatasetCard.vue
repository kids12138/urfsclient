<template>
  <div style="background-color: #ececec; padding: 20px">
    <a-row :gutter="16">
      <a-col :span="8" v-for="(item, index) in cardList" :key="index">
        <a-card :title="item.name" :bordered="false" class="cardStyle" @click="showDetail(item.id)">
          <a-tag v-for="(Item, index) in item.tags" :key="index" :color="Item.color">{{ Item.content }}</a-tag>
          <p class="mt-1">{{ item.desc }}</p>
          <p>
            <!-- <span class="m-1">{{ item.updateTime }}</span
            ><span class="m-1" v-if="show">{{ item.author }}</span> -->
          </p>
        </a-card>
      </a-col>
    </a-row>
    <a-row justify="end" class="bg">
      <a-col :span="10">
        <a-pagination v-model:current="current" :total="50" show-less-items @change="handleTableChange" /></a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { http } from "@tauri-apps/api";
import baseURL from "../BASEURL"
const store = useStore();
const show = ref<boolean>(false);
onMounted(() => {
  if (store.state.dataType === "persional") {
    show.value = false;
    getList()
  } else {
    show.value = true;
    getList()
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
  },
);
watch(
  () => store.state.dataSetNumber,
  (val) => {
    getList()
  },
);
interface cardType {
  name: string;
  desc: string;
  tags: label[];
  id: string;
  replica: Number;

}
interface label {
  color: string;
  content: string;
}
const cardList: cardType[] = reactive([]);
const current = ref(1);
const handleTableChange = (e: any) => {
  console.log(e);
};
const showDetail = (id: String) => {
  store.commit("changeDataPage", "detail");
  store.commit("changeDatasetId", id);
};
async function getList() {
  await http.fetch(baseURL + '/api/v1/datasets', {
    method: 'GET',
  }).then(res => {
    res.data.datasets.forEach((item: any) => {
      cardList.push({ id: item.id, name: item.name, replica: item.replica, desc: item.desc, tags: [{ color: 'green', content: '其他' }] })
    })

  });
}
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
