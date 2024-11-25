<template>
  <article
    class="richtext prose"
    :class="{ 'with-border': !readonly }"
    :style="{ width }"
  >
    <Toolbar
      v-if="!readonly"
      class="toolbar"
      :editor="editorRef"
      :mode="mode"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      :model-value="content"
      @onCreated="onEditorCreated"
      @onChange="onEditorChange"
      :style="{ height }"
    />
    <!-- 注意: defaultContent (JSON 格式) 和 defaultHtml (HTML 格式) ，二选一 -->
  </article>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount,
  shallowRef,
  computed,
  watch,
  ref,
  onMounted,
  nextTick,
} from "vue";
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import storage from "@/utils/storage";
import http from "@/utils/network/http";
export type RichTextValue =
  | string
  | {
      content: string;
      summary?: string;
    };
export interface Props {
  mode?: string;
  summary?: boolean;
  width?: string | number;
  height?: string | number;
  value: RichTextValue;
  readonly?: boolean;
  toolbarConfig?: Partial<IToolbarConfig>;
  editorConfig?: Partial<IEditorConfig>;
}
const props = withDefaults(defineProps<Props>(), {
  mode: "default",
  summary: false,
  width: "100%",
  height: 300,
  value: "",
  toolbarConfig: () => ({ excludeKeys: ["fontFamily"] }),
});
// 编辑器实例
const editorRef = shallowRef<IDomEditor>();
const width = computed(() =>
  typeof props.width == "number" ? `${props.width}px` : props.width
);
const height = computed(() =>
  typeof props.height == "number" ? `${props.height}px` : props.height
);
const content = computed(() =>
  typeof props.value === "string" ? props.value : props.value.content
);
const emit = defineEmits(["update:value", "change"]);

// const actualModel = computed<RichTextValue>({
//     get: () => props.value,
//     set: (value) => emits('update:value', value)
// });

// 配置
const toolbarConfig = computed<Partial<IToolbarConfig>>(() => {
  return {
    ...props.toolbarConfig,
  };
});
type InsertFnType = (url: string, alt?: string, href?: string) => void;
async function customUpload(file: File, insertFn: InsertFnType) {
  // 上传文件
  const formData = new FormData();
  formData.append("file", file);
  const { data: res } = await http.post("/file/upload/file", formData, {
    headers: { Scope: "file_server" },
  });
  insertFn(res.value.data[0].url);
}
const editorConfig = computed<Partial<IEditorConfig>>(() => {
  const MENU_CONF = props.editorConfig?.["MENU_CONF"] || {};
  const accessToken = storage.get<string>("access_token");
  const headers = {
    ...MENU_CONF["uploadImage"]?.headers,
    Scope: "file_server",
    Authorization: `Bearer ${accessToken}`,
  };
  MENU_CONF["uploadImage"] = {
    headers,
    customUpload,
  };
  MENU_CONF["fontFamily"] = {
    fontFamilyList: undefined,
  };

  return {
    placeholder: "请输入内容...",
    ...props.editorConfig,
    readOnly: props.readonly,
    MENU_CONF,
  };
});

function onEditorChange(editor: IDomEditor) {
  emit("change", {
    content: editor.getHtml(),
    summary: props.summary ? editor.getText() : "",
  });
}

// 编辑器创建完成触发
const onEditorCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例
  emit("update:value", {
    content: editor.getHtml(),
    summary: props.summary ? editor.getText() : "",
  });
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
  editorRef.value = undefined;
});
</script>
<style>
.w-e-full-screen-container {
  z-index: 256;
}
</style>
<style scoped>
.richtext {
  --w-e-modal-button-bg-color: #015c5f;
}
.with-border {
  @apply border border-solid border-['#ccc'];
}
.toolbar {
  @apply border-b border-solid border-['#ccc'];
}
:deep(.w-e-modal .button-container button) {
  color: #fff !important;
}
</style>
