<template>
  <div>
    <a-modal
      v-model:open="open"
      :title="title"
      @ok="handleOk"
      @cancel="handleCancel"
      :centered="true"
      width="800px"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="数据集名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="数据集描述" name="desc">
          <a-textarea v-model:value="formState.desc" />
        </a-form-item>
        <a-form-item label="标签类型" name="type">
          <a-select
            v-model:value="formState.type"
            mode="tags"
            style="width: 100%"
            :options="options"
            @change="handleChange()"
          ></a-select>
        </a-form-item>
        <a-form-item label="副本数">
          <a-form-item name="copy" no-style>
            <a-input-number
              v-model:value="formState['input-number']"
              :min="1"
              :max="10"
            />
          </a-form-item>
          <span class="ant-form-text">
            <a-alert message="副本数最小为0" type="warning" show-icon
          /></span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { Dayjs } from "dayjs";
import { reactive, ref, toRaw } from "vue";
import type { UnwrapRef } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { message } from "ant-design-vue";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons-vue";
interface FormState {
  name: string;
  desc: string;
  type: [];
  copy: number;
}
const props = defineProps({
  title: {
    default: "",
    type: String,
  },
});

const open = ref<boolean>(true);
const handleOk = (e: MouseEvent) => {
  onSubmit();
};
const handleCancel = (e: MouseEvent) => {
  reqclick();
};
const emit = defineEmits<{
  (event: "closeDatasetDialg", val: boolean): void;
}>();
//const emit = defineEmits(['chilFun']) // 自定义chilFun事件
const reqclick = () => {
  emit("closeDatasetDialg", false); //1212:传个父组件的数据
};
const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 10 };
const formState: UnwrapRef<FormState> = reactive({
  name: "",
  desc: "",
  type: [],
  copy: 0,
});
const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: "请输入数据集名称",
      trigger: "change",
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      reqclick();
      message.success("创建数据集成功");
    })
    .catch((error: any) => {
      console.log("error", error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};
const options = [
  { label: "111", value: 111 },
  { label: "222", value: 222 },
];
const handleChange = () => {};
</script>
<style scoped>
:deep(.ant-alert-warning){
  background-color: #fff;
  border: 0px;
  height: 20px;
  position: relative;
  top:5px
}
</style>
