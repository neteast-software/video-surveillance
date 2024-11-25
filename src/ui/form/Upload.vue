<template>
  <!-- <NUpload
    ref="uploadRef"
    :default-upload="false"
    :default-file-list="defaultFileList"
    v-bind="item.attrs"
    :custom-request="
      (options) => customUpload(options, item.attrs?.name, formData[item.name])
    "
    :headers="createUploadHeader(item.attrs?.headers)"
    :action="item.attrs?.action"
    @update:file-list="uploadFileList = $event"
    @change="onFileListChange"
    @before-upload="onBeforeUpload"
  >
    <template v-if="item.attrs?.listType === 'image-card'">
      <slot name="dragger">
        <div class="w-full h-full rounded-lg bg-base flex-center flex-col">
          <img src="../assets/image.svg" alt="scaleToFill" />
          <p class="mt-3">上传图片</p>
        </div>
      </slot>
    </template>
    <template v-else>
      <component
        v-if="item.slots?.dragger"
        :is="item.slots.dragger"
      ></component>
      <slot v-else name="dragger">
        <div
          class="px-12.5 py-10 border rounded-lg border-dashed border-grey1 bg-base flex flex-col items-center"
        >
          <img src="../assets/upload.svg" alt="scaleToFill" />
          <div class="my-4">将文件拖到此区域，或<span>点击上传</span></div>
          <div class="text-xs text-[#BBBDBF]">
            {{ item?.tip }}
          </div>
        </div>
      </slot>
    </template>
  </NUpload> -->
</template>

<script setup lang="ts">
import { NUpload, UploadCustomRequestOptions } from "naive-ui";
import type { UploadFormItem, FormData as FormDataType } from "./type";
import storage from "@/utils/other/storage";
import { UploadHeaders } from "./type";
import http from "@/utils/network/http";
// import {
//   CustomRequest,
//   CustomRequestOptions,
//   OnChange,
// } from "naive-ui/es/upload/src/interface";
import { UploadFileInfo, UploadInst } from "naive-ui";
import { computed, ref, watch } from "vue";
import { timeoutPromise } from "@/utils/other";
interface Props {
  item: UploadFormItem;
  formData: FormDataType;
  // sizeLimit?: number | string;
  defaultFileList?: any[];
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  "update:files": [fileList?: any[]];
}>();
const uploadFileList = ref<UploadFileInfo[]>([]);
// const defaultFileList = computed(() =>
//     Array.isArray(props.defaultFileList)
//         ? props.defaultFileList.map((item) => ({
//               id: item.id || item.fid,
//               name: item.name,
//               url: item.url,
//               status: 'finished',
//               uid: item.uid,
//               size: item.size,
//               type: item.type || item.mimetype,
//               raw: item.raw
//           }))
//         : []
// );
const defaultFileList: any[] = Array.isArray(props.defaultFileList)
  ? props.defaultFileList.map((item) => ({
      id: item.id || item.fid,
      name: item.name,
      url: item.url,
      status: "finished",
      uid: item.uid,
      size: item.size,
      type: item.type || item.mimetype,
      raw: item.raw,
    }))
  : [];
const actualFileList: any[] = [...props.defaultFileList];

function onBeforeUpload(data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) {
  const { file, fileList } = data;
  if (fileList.some((f) => f.name === file.name)) {
    window.$message?.error("文件已存在");
    return false;
  }
  const { sizeLimit, minSize } = props.item.attrs || {};
  const oversize =
    sizeLimit && Number(file.file?.size) > Number(sizeLimit) * 1024 * 1024;
  if (oversize) {
    window.$message?.error(`文件过大，上传文件大小不能超过${sizeLimit}MB`);
    return false;
  }
  const lowsize =
    minSize && Number(file.file?.size) < Number(minSize) * 1024 * 1024;
  if (lowsize) {
    window.$message?.error(`文件过小，上传文件大小不能小于${minSize}MB`);
    return false;
  }
  return true;
}

function createUploadHeader(headers: UploadHeaders = {}) {
  const Authorization = storage.get<string>("token");
  const newHeaders = Array.isArray(headers)
    ? Object.fromEntries(headers.map((item) => [item.name, item.value]))
    : headers;
  return {
    Authorization,
    ...newHeaders,
  };
}
// const customUpload = async (
//   options: CustomRequestOptions,
//   name = "",
//   uploadFormData: any
// ) => {
//   const { action, data, file, headers, onFinish, onError } = options;
//   if (!action || !file.file) return;
//   const uri = `${action}/${name}`;
//   const payload = new FormData();
//   if (data) {
//     Object.keys(data).forEach((key) => {
//       payload.append(
//         key,
//         data[key as keyof UploadCustomRequestOptions["data"]]
//       );
//     });
//   }
//   payload.append(name, file.file);
//   try {
//     const { data: res } = await http.post(uri, payload, {
//       headers: headers as Record<string, any>,
//       withoutLock: true,
//     });
//     actualFileList.push({ ...res.value.data[0], id: file.id });
//     onFinish();
//   } catch (error) {
//     console.error(error);
//     onError();
//   }
// };
// const onFileListChange: OnChange = ({ fileList }) => {
//   const { formData, item } = props;
//   const uploads: any[] | undefined = fileList.length ? [] : undefined;
//   fileList.forEach((file) => {
//     if (file.status !== "finished") return;
//     uploads?.push(actualFileList.find((f) => (f.id || f.fid) === file.id));
//   });
//   // formData[item.name] = fileList.length
//   //     ? fileList.map((file) => {
//   //           const m = actualFileList.find((f) => file.id === f.id);
//   //           return m;
//   //       })
//   //     : undefined;
//   emit("update:files", uploads);

//   // formData[item.name] = uploads;
// };
const uploadRef = ref<UploadInst | null>(null);

defineExpose({
  submit: () => {
    if (!uploadRef.value || !uploadFileList.value.length)
      return Promise.resolve(void 0);
    return new Promise<void>((resolve, reject) => {
      if (!uploadRef.value) return resolve();
      uploadRef.value?.submit();
      const unwatch = watch(
        uploadFileList,
        (fileList) => {
          const hasError = fileList.some((file) => file.status === "error");
          if (hasError) {
            unwatch();
            reject();
            return;
          }
          const allSuccess = fileList.every(
            (file) => file.status === "finished"
          );
          if (allSuccess) {
            setTimeout(() => {
              unwatch();
              resolve();
            }, 0);
            return;
          }
        },
        { immediate: true }
      );
      timeoutPromise(60000).finally(() => {
        unwatch();
        reject();
      });
    });
  },
});
</script>

<style scoped></style>
