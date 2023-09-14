<template>
  <a-layout>
    <a-layout-header>
      <a-row justify="space-between">
        <a-col :span="8">
          <a-row>
            <a-col :span="2" class="logo"></a-col>
            <a-col :span="14">
              <a-tabs v-model:activeKey="activeKey" @tabClick="showList()">
                <a-tab-pane key="1" tab="数据集"></a-tab-pane> </a-tabs
            ></a-col> </a-row
        ></a-col>
        <a-col :span="5" class="min-width">
          <a-row justify="end">
            <a-col :span="2"
              ><div class="upload" @click="openTaskManager()"></div
            ></a-col>
            <a-col :span="3" class="pt-05">
              <a-avatar :size="50">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </a-col>
            <a-col :span="2">
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item key="1"> 创建数据集 </a-menu-item>
                    <a-menu-item key="2" disabled> 系统设置 </a-menu-item>
                    <a-menu-item key="3"> 退出 </a-menu-item>
                  </a-menu>
                </template>
                <div class="arrowDown"></div>
              </a-dropdown>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout class="main_layout">
      <a-layout class="main_content_layout">
        <a-layout-content class="main_content">
          <slot />
        </a-layout-content>
      </a-layout>
    </a-layout>
    <operateDialg
      v-if="open1"
      @closeDatasetDialg="closeDatasetDialg"
      title="创建数据集"
    />
    <settingDialg v-if="open2" @closeSettingDialg="closeSettingDialg" />
    <taskManagerDialg
      v-if="open3"
      @closeTaskManagerDialg="closeTaskManagerDialg"
    />
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const activeKey = ref("1");
import { UserOutlined } from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import operateDialg from "../components/OperateDatasetDialg.vue";
import settingDialg from "../components/SystemSettingDialg.vue";
import taskManagerDialg from "../components/TaskManagerDialg.vue";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const open1 = ref<boolean>(false);
const open2 = ref<boolean>(false);
const open3 = ref<boolean>(false);
const handleButtonClick = (e: Event) => {
  console.log("click left button", e);
};
const handleMenuClick: MenuProps["onClick"] = (e) => {
  if (e.key == 3) {
    router.push({
      path: "/",
    });
    message.success("退出成功");
  } else if (e.key == 1) {
    open1.value = true;
  } else {
    open2.value = true;
  }
};
const closeDatasetDialg = (val: boolean) => {
  open1.value = val;
};
const closeSettingDialg = (val: boolean) => {
  open2.value = val;
};
const closeTaskManagerDialg = (val: boolean) => {
  open3.value = val;
};
const openTaskManager = () => {
  open3.value = true;
};
const showList = () => {
  store.commit("changeDataPage", "list");
};
</script>
<style scoped>
.ant-layout-header {
  height: 70px;
  overflow: hidden;
  padding-left: 10px;
}
.main_layout {
  width: 100%;
  /* height: 100vh; */
  background-color: #f0f0f0;
}
.logo {
  background: url("../static/logo.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 5px;
  height: 70px;
  min-width: 120px;
}
:deep(.ant-tabs-nav) {
  height: 70px;
}
:deep(.ant-tabs-tab-btn) {
  font-size: 20px;
  font-weight: 800;
}
:deep(.ant-tabs-ink-bar) {
  display: none;
}
.arrowDown {
  background: url("../static/arrowDown.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-width: 20px;
  min-height: 20px;
  margin-top: 30px;
}
.pt-05 {
  margin-top: 5px;
}
:deep(.ant-avatar) {
  font-size: 40px !important;
}
:deep(.ant-badge-count:hover) {
  cursor: pointer;
}
.upload {
  background: url("../static/upload.svg");
  background-repeat: no-repeat;
  background-repeat: no-repeat;
  background-size: 100%;
  width: 30px;
  height: 30px;
  margin-top: 25px;
}
.upload:hover {
  cursor: pointer;
}
.min-width{min-width: 350px;}
</style>
