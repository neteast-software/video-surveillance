<template>
  <div class="relative bg w-screen h-screen">
    <div
      class="absolute left-50% -translate-x-50% bottom-30px flex flex-col items-center text-primary"
    >
      <div>国道G228先长乐松下至福清元洪公路工程二、三期项自</div>
      <div>建设单位:左海建设投资有限公司</div>
    </div>
    <div
      class="absolute right-10% top-16% w-410px h-500px bg-white p-10 rounded-4px"
    >
      <img class="mb-6" src="/public/img/login/loginTitle.png" alt="欢迎登录" />
      <NForm ref="formRef" :model="formData" :rules="rules">
        <NFormItem class="h-80px" path="account">
          <div class="w-full">
            <NInput
              :bordered="false"
              style="background-color: #f5f7fa; border-radius: 8px"
              v-model:value="formData.account"
              placeholder="请输入账号"
              class="!text-14px"
            >
              <template #prefix>
                <div class="i-icons:account text-#8A92A6 w-4 h-4 mr-2"></div>
              </template>
            </NInput>
          </div>
        </NFormItem>
        <NFormItem class="h-80px" path="password">
          <div class="w-full">
            <NInput
              :input-props="{ autocomplete: 'new-password' }"
              class="!text-14px"
              style="background-color: #f5f7fa; border-radius: 8px"
              :bordered="false"
              v-model:value="formData.password"
              show-password-on="click"
              type="password"
              placeholder="请输入密码"
            >
              >
              <template #prefix>
                <div class="i-icons:password text-#8A92A6 w-4 h-4 mr-2"></div>
              </template>
            </NInput>
          </div>
        </NFormItem>
        <div class="flex justify-between mt-3 mb-16">
          <!-- 自动登陆 -->
          <div class="text-#A0AEC0"><NCheckbox class="mr-2" />自动登录</div>
          <div class="text-primary">忘记密码？</div>
        </div>
        <NButton
          type="primary"
          :round="false"
          style="height: 48px; width: 100%; border-radius: 8px"
          class="!text-xl"
          @click="handleLogin"
          >登录</NButton
        >
      </NForm>
    </div>
    <!-- <p class="absolute bottom-5 text-primary left-1/2 -translate-x-1/2">
            © dian wang 2011 - 2022东际网丰信息服务有限公司 | 互联网安全备案号: 35020602002342 | 备案信息:
            闽ICP备2021013850号-2
        </p> -->
  </div>
</template>
<script setup lang="ts">
import { NInput, NForm, NFormItem, NButton, NCheckbox } from "naive-ui";
import storage from "@/utils/other/storage";
import { login } from "@/utils/network/api/root";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCommonInfoStore } from "@/stores/commonInfo";
const useCommonInfo = useCommonInfoStore();
const { nickName } = storeToRefs(useCommonInfo);
const { setNickName } = useCommonInfo;
const router = useRouter();
const formData = ref({
  account: "",
  password: "",
});
const formRef = ref(null);
function handleLogin() {
  formRef.value
    ?.validate()
    .then(async (valid) => {
      if (valid) {
        console.log("登录成功");
        const { data } = await login(
          formData.value.account,
          formData.value.password
        );
        setNickName(data.nickName);
        storage.set("access_token", data.access_token);
        window.$message.success("登录成功");
        router.push("/");
      }
    })
    .catch(() => {});
}
const rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    // { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    // { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
};
</script>
<style scoped>
.bg {
  background-image: url("/public/img/login/loginBg.jpg");
}
::v-deep(.n-form-item-feedback-wrapper) {
  margin-top: 5px !important;
}
::v-deep(.n-input__input-el) {
  height: 48px;
}
</style>
