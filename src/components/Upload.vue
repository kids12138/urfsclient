<script setup lang="ts">
import { h, ref, reactive } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { info, error } from "tauri-plugin-log-api";
import { message } from "ant-design-vue";
import { appCacheDir } from "@tauri-apps/api/path";
import { FileOutlined, FolderOutlined } from "@ant-design/icons-vue";

const uploadItemList: any = reactive([]);

async function select_upload_fold() {
  const selected_folder = await open({
    multiple: false,
    directory: true,
  });

  if (typeof selected_folder === "string") {
    info("[ui] select upload folder :" + selected_folder);
    uploadItemList.push({ name: selected_folder, isDir: true });
  }
}

async function star_upload(source: string) {
  const appCacheDirPath = await appCacheDir();

  info(
    `[ui] star_upload source path:${source}, appCacheDirPath:${appCacheDirPath}`
  );

  try {
    await invoke("start_upload", {
      req: JSON.stringify({
        dataset_id: 'xxx',
        dataset_version_id: 'default',
        dataset_cache_dir: appCacheDirPath,
        dataset_source: source,
        server_endpoint: 'http://192.168.23.53:65004'
      })
    })
    message.success("正在上传");
  } catch (err: any) {
    message.error("上传出错：", err);
    error(`上传出错: ${err}`);
  }
}
</script>

<template>
  <div class="card">
    <a-button type="primary" @click="select_upload_fold()">上传数据集</a-button>
    <!-- <button type="button" @click="get_history()">历史任务</button> -->
  </div>

  <a-list class="demo-upload-list" item-layout="horizontal" :data-source="uploadItemList">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a key="star_upload" @click="star_upload(item.name)">开始上传</a>
        </template>
        <div>
          <a-list-item-meta description="">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <template #avatar>
              <a-avatar size="small" v-if="item.isDir === false">
                <template #icon>
                  <FileOutlined />
                </template>
              </a-avatar>
              <a-avatar size="small" v-if="item.isDir === true">
                <template #icon>
                  <FolderOutlined />
                </template>
              </a-avatar>
            </template>
          </a-list-item-meta>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>
<style scoped>
.card {
  margin-top: 40px;
  text-align: center;
}

:deep(.ant-list-item-meta-content) {
  width: 200px!important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.ant-list-item-action) {
  margin-left: 0px!important
}</style>
