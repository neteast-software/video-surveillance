<template>
  <div class="h-full py-4 bg relative border-r-(1px solid greyLine) max-w-58">
    <div class="flex-col h-full">
      <header
        class="flex-center bg-#EFF3F7 rounded-2 p-2 min-w-48 mb-4.5 mx-2.5"
      >
        <img
          :src="user"
          class="w-7.5 h-7.5 rounded-full border-(1 solid white)"
          alt=""
        />
        <div class="text-3.5 flex-w-rest ml-2.5">
          {{ nickName }}
          <div class="text-#A0AEC0 text-12px">{{ companyNameAndJob }}</div>
        </div>
        <NModal v-model:show="showEditPassword">
          <div class="flex-col w-600px h-520px bg-white rounded p-8">
            <div class="text-30px">修改密码</div>
            <div
              @click="showEditPassword = false"
              class="i-icons:close absolute top-20px right-20px w-6 h-6 cursor-pointer"
            ></div>
            <div class="mt-2 text-#A0AEC0 mb-6">
              为保障您的账号信息安全，请设置不低于8位数的字母+数字组合密码
            </div>
            <NForm ref="formRef" :model="formData" :rules="rules">
              <NFormItem class="mb-4" path="password">
                <div class="relative w-full">
                  <div class="mb-1 absolute -top-28px">
                    旧密码<span class="text-red">*</span>
                  </div>
                  <NInput
                    :input-props="{ autocomplete: 'new-password' }"
                    class="!text-14px"
                    v-model:value="formData.password"
                    show-password-on="click"
                    type="password"
                    placeholder="请输入"
                  >
                    >
                  </NInput>
                </div>
              </NFormItem>
              <NFormItem class="mb-4" path="newPassword">
                <div class="relative w-full">
                  <div class="mb-1 absolute -top-28px">
                    新密码<span class="text-red">*</span>
                  </div>
                  <NInput
                    :input-props="{ autocomplete: 'new-password' }"
                    class="!text-14px"
                    v-model:value="formData.newPassword"
                    show-password-on="click"
                    type="password"
                    placeholder="请输入"
                  >
                    >
                  </NInput>
                </div>
              </NFormItem>
              <NFormItem class="mb-4" path="newPassword2">
                <div class="relative w-full">
                  <div class="mb-1 absolute -top-28px">
                    确认密码<span class="text-red">*</span>
                  </div>
                  <NInput
                    :input-props="{ autocomplete: 'new-password' }"
                    class="!text-14px"
                    v-model:value="formData.newPassword2"
                    show-password-on="click"
                    type="password"
                    placeholder="请输入"
                  >
                    >
                  </NInput>
                </div>
              </NFormItem>
              <NButton
                type="primary"
                :round="false"
                @click="handleModifyPassword"
                style="
                  font-size: 18px;
                  height: 48px;
                  width: 100%;
                  border-radius: 8px;
                "
                >保存</NButton
              >
            </NForm>
          </div>
        </NModal>
        <NPopover
          trigger="click"
          placement="bottom-end"
          style="padding: 12px 0; border-radius: 8px"
        >
          <template #trigger>
            <div class="w-4 h-4 bg-white flex-center rounded-1 cursor-pointer">
              <div class="i-icons:caretdown w-3 h-3 text-lightGrey"></div>
            </div>
          </template>
          <div
            class="flex-center gap-2.5 py-3 pl-6 pr-8 hover-(text-primary bg-#DFEBFF) cursor-pointer"
            @click="handleShowEditPassword()"
          >
            <div class="i-icons:edit w-4 h-4"></div>
            修改密码
          </div>
          <div
            class="flex-center gap-2.5 py-3 pl-6 pr-8 hover-(text-primary bg-#DFEBFF) cursor-pointer"
            @click="handleLogOut()"
          >
            <div class="i-icons:export w-4 h-4"></div>
            退出登录
          </div>
        </NPopover>
      </header>
      <div class="text-3 text-lightGrey mx-2.5">菜单</div>
      <NScrollbar class="flex-h-rest">
        <NMenu
          ref="menuInstRef"
          :options="menuOptions"
          :value="menuKey"
          @update:value="handleMenuSelect"
        />
      </NScrollbar>
      <div class="h-1px bg-greyLine my-2 mx-2.5"></div>
      <div class="z-1 mx-2.5">
        <div class="text-(3 lightGrey) mb-2">数据</div>
        <div>
          <div v-show="options && options.length > 0" class="mb-2">
            智慧安全帽在线人数
          </div>
          <NAvatarGroup
            v-show="options && options.length > 0"
            :options="options"
            :size="36"
            :max="4"
            class="my-1"
          >
            <template #avatar="{ option: { name, src } }">
              <n-tooltip>
                <template #trigger>
                  <n-avatar :src="src" />
                </template>
                {{ name }}
              </n-tooltip>
            </template>
            <template #rest="{ options: restOptions, rest }">
              <n-avatar>+{{ rest }}</n-avatar>
            </template>
          </NAvatarGroup>
          <div class="w-full bg-#EFF3F7/70 rounded-2 px-2.5 py-4">
            <div class="text-3">
              智慧安全帽在线率
              <n-progress
                type="line"
                class="mt-2"
                :percentage="onlineRate?.safetyHelmetRate"
                color="#3563EF"
                rail-color="#A4BAF4"
              />
            </div>
            <div class="w-full h-1px bg-#E1E7EB my-3"></div>
            <div class="text-3">视频监控在线率</div>
            <n-progress
              type="line"
              class="mt-2"
              :percentage="onlineRate?.channelRate"
              color="#3563EF"
              rail-color="#A4BAF4"
            />
          </div>
        </div>
      </div>
    </div>
    <img
      src="../assets/imgs/sidebar-bg.png"
      class="absolute bottom-0 left-0 w-full z-0"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import {
  NAvatarGroup,
  NAvatar,
  NTooltip,
  NProgress,
  NMenu,
  NScrollbar,
  MenuInst,
  NPopover,
  useDialog,
} from "naive-ui";
import user from "@/assets/imgs/user.png";
import { menuOptions, clearRoute } from "../router";
import { NInput, NForm, NFormItem, NButton, NModal } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { getOnlineRate } from "@/utils/network/api/index";
import { OnlineRate } from "@/utils/network/types/index";
import { computed, watch, ref, onMounted, nextTick } from "vue";
import { logout } from "@/utils/network/api/root";
import storage from "@/utils/other/storage";
import { storeToRefs } from "pinia";
import { getUserInfo } from "@/utils/network/api/root";
import { useCommonInfoStore } from "@/stores/commonInfo";
import { modifyPassword } from "@/utils/network/api/baseSetting";

const { nickName, allowModify } = storeToRefs(useCommonInfoStore());
const router = useRouter();
const route = useRoute();
const menuInstRef = ref<MenuInst | null>(null);
const dialog = useDialog();

function handleMenuSelect(key: string) {
  if (key.includes("http://") || key.includes("https://")) {
    window.open(key);
  } else {
    router.push(key);
  }
}
const menuKey = computed(() => {
  // return router.currentRoute.value.path as string;
  return route.path;
});
watch(menuOptions, async (options) => {
  if (options) {
    console.log("menuOptions更新", options);
    await nextTick();
    setTimeout(() => {
      menuInstRef.value?.showOption(route.path);
    }, 100);
  }
});
const companyNameAndJob = ref("--");
const onlineRate = ref<OnlineRate>();
async function initData() {
  const { data } = await getOnlineRate();
  onlineRate.value = data;
  const { data: userInfo } = await getUserInfo();
  companyNameAndJob.value = `${userInfo.companyName || ""} ${
    userInfo.job || ""
  }`;
  console.log("userInfo", userInfo);
  //   dataRoleIds  roleIds
  if (!userInfo.roleIds) return;
  allowModify.value = userInfo.dataRoleIds.some((item) => {
    return userInfo.roleIds.includes(item);
  });
}

onMounted(initData);

const options = computed(() => {
  return onlineRate.value?.safetyHelmetVos.map((option) => {
    return {
      name: option.name,
      src: option.img || user,
    };
  });
});
const formRef = ref(null);
const formData = ref({
  password: "",
  newPassword: "",
  newPassword2: "",
});
const rules = {
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  newPassword2: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
  ],
};
const showEditPassword = ref(false);
function handleShowEditPassword() {
  showEditPassword.value = true;
}
function handleModifyPassword() {
  formRef.value
    ?.validate()
    .then(async (valid) => {
      if (valid) {
        console.log("修改密码成功");
        await modifyPassword({
          oldPwd: formData.value.password,
          newPwd: formData.value.newPassword,
          confirmPwd: formData.value.newPassword2,
        });
        window.$message.success("修改密码成功");
        showEditPassword.value = false;
        formData.value = {
          password: "",
          newPassword: "",
          newPassword2: "",
        };
      }
    })
    .catch(() => {});
}
function handleLogOut() {
  dialog.create({
    title: "退出登录",
    content: "确定要退出登录吗？退出后数据将会自动同步",
    positiveText: "确定退出",
    negativeText: "取消",
    // maskClosable: false, //点击遮罩
    onPositiveClick: async () => {
      try {
        await logout("admin");
        storage.remove("access_token");
        router.push("/login");
        clearRoute();
      } catch (error) {
        console.error("请求失败", error);
      }
    },
    onNegativeClick: () => {
      console.log("取消");
    },
  });
}
</script>

<style scoped>
.bg {
  background: linear-gradient(180deg, #ffffff 76%, #e3ebff 100%);
}
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  @apply text-(primary  3) absolute -top-7.5 right-2;
}
/* :deep(.n-scrollbar-rail__scrollbar) {
  display: none;
} */
:deep(.n-menu .n-menu-item) {
  @apply lt-laptop-(mt-3) mt-4;
}
:deep(.n-menu .n-submenu-children) {
  @apply relative;
}
:deep(.n-menu .n-submenu-children::before) {
  content: "";
  position: absolute;
  width: 1px;
  height: calc(100% - 24px);
  background: #dddddd;
  @apply left-9 top-5;
}
:deep(.n-menu .n-submenu-children .n-menu-item) {
  @apply relative;
}
:deep(.n-menu .n-submenu-children .n-menu-item::before) {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-image: url("../assets/svgs/angle.svg");
  background-position: left bottom;
  background-size: 8px 8px;
  @apply left-11 top-1/2 -translate-y-1/2;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content) {
  @apply ml-2;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content::before) {
  @apply left-9;
}
:deep(.n-menu .n-menu-item-content) {
  @apply !pl-3;
}
:deep(.n-menu .n-menu-item-content-header) {
  @apply text-4;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content-header) {
  @apply text-3.5;
}

::v-deep(.n-menu-item-content__icon) {
  margin-right: 4px !important;
}
::v-deep(.n-menu-item::before) {
  position: absolute;
  transform: translate(-8px, -7px) !important;
}
::v-deep(.n-submenu-children .n-submenu-children) {
  margin-left: 20px;
}
::v-deep(.n-submenu-children .n-submenu-children .n-menu-item-content-header) {
  color: #232d42;
  font-size: 12px !important;
}
</style>
