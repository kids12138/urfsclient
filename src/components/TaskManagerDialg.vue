<template>
  <div>
    <a-modal
      v-model:open="open"
      width="1000px"
      title="任务管理"
      @ok="handleOk"
      @cancel="handleCancel"
      :centered="true"
    >
      <p>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="运行中"><taskTable/></a-tab-pane>
          <a-tab-pane key="2" tab="已暂停"><taskTable/></a-tab-pane>
          <a-tab-pane key="3" tab="已完成"><taskTable/></a-tab-pane>
          <a-tab-pane key="4" tab="初始化"><taskTable/></a-tab-pane>
          <a-tab-pane key="5" tab="失败"><taskTable/></a-tab-pane>
        </a-tabs>
      </p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import taskTable from "./TaskTable.vue";
const open = ref<boolean>(true);
const activeKey = ref("1");
const emit = defineEmits<{
  (event: "closeTaskManagerDialg", val: boolean): void;
}>();
const handleOk = (e: MouseEvent) => {
  emit("closeTaskManagerDialg", false);
};
const handleCancel = (e: MouseEvent) => {
  emit("closeTaskManagerDialg", false);
};
</script>
