<template>
  <div class="flex flex-col gap-3.5 bg-white no-scrollbar flex-w-rest h-full">
    <section v-if="isLogin" class="flex items-start justify-between h-full">
      <section ref="monitorWrap" class="flex-w-rest h-full p-5 lt-laptop-(p-3)">
        <MonitorGallery
          :isFullscreen="isFullscreen"
          v-model:activeMonitor="activeMonitor"
          :deviceId="deviceId"
        ></MonitorGallery>
      </section>
      <div class="h-full w-1px bg-greyLine"></div>
      <div class="bg-white py-6 rounded-4 h-full w-27% max-w-420px">
        <header
          class="flex-y-center gap-1 text-5 font-600 px-5 lt-laptop-(px-3)"
        >
          <div class="bg-primary h-16px w-4px rounded-1px"></div>
          设备信息
        </header>
        <MonitorList
          class="flex flex-7 gap-3.5"
          :style="{ maxHeight: height + 'px' }"
          :regionId="rigionId"
          :activeMonitor="activeMonitor"
        ></MonitorList>
      </div>
    </section>

    <template v-else>
      <NSpin class="absolute-center" size="large">
        <template #description> 登录中 </template>
      </NSpin>
    </template>
    <template v-if="mounted">
      <!-- <Teleport to="#fullscreen">
        <NButton circle quaternary @click="enter">
          <i
            ><Icon :icon="enterFullScreen" class="w-6 h-6 cursor-pointer"></Icon
          ></i>
        </NButton>
      </Teleport> -->
    </template>
  </div>
</template>

<script setup lang="ts">
import MonitorGallery from "./MonitorGallery.vue";
import MonitorList from "./MonitorList.vue";
import { onMounted, ref } from "vue";
import { useElementSize, useMounted } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { useFullscreen } from "@vueuse/core";
import enterFullScreen from "@/Icons/fullscreen.svg";
import { NButton, NSpin } from "naive-ui";
import { login as loginApi, heartBeat } from "@/utils/network/api/security";
import storage from "@/utils/other/storage";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const mounted = useMounted();
const monitorWrap = ref<HTMLElement>();
const { height } = useElementSize(monitorWrap);
const { isFullscreen, enter } = useFullscreen(monitorWrap);
const rigionId = ref(0);
const router = useRouter();
const route = useRoute();

const activeMonitor = ref(0); // 当前选中的监控

const isLogin = ref(false);
const token = "admin";

async function testToken() {
  await heartBeat();
}
async function login() {
  storage.remove("access_token");
  const { data: accessToken } = await loginApi(token || "");
  storage.set("access_token", accessToken);
  isLogin.value = true;
}
onMounted(async () => {
  try {
    await testToken();
    isLogin.value = true;
  } catch (error) {
    login();
  }
});

const deviceId = ref();
onMounted(() => {
  deviceId.value = route.query.deviceId || "";
  if (deviceId.value) {
    // isFullscreen.value = true;
  }
});
</script>

<style scoped></style>
