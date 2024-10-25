<template>
  <NPopselect
    v-model:value="curDeviceStatus"
    :options="deviceStatus"
    :render-label="renderLabel"
    trigger="hover"
    :show-checkmark="false"
    v-model:show="selectState"
  >
    <Transition appear name="slideRight">
      <div
        class="flex-between bg-white py-2.5 px-4 h-12 rounded-2px gap-8 text-4 min-w-39 z-1"
      >
        {{ displayDeviceStatus }}
        <div class="bg-#EAEFFD w-7 h-7 rounded-2px flex-center">
          <div
            class="i-icons:arrow w-5 h-5 text-primary transition"
            :class="{ 'rotate-180': selectState }"
          ></div>
        </div>
      </div>
    </Transition>
  </NPopselect>
</template>

<script setup lang="ts">
import { NPopselect, SelectRenderLabel, NCheckbox } from "naive-ui";
import { computed, h, ref } from "vue";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
const deviceInfo = useDeviceInfoStore();
const { deviceStatus, curDeviceStatus } = storeToRefs(deviceInfo);

const selectState = ref(false);
const displayDeviceStatus = computed(() => {
  if (curDeviceStatus.value === undefined || curDeviceStatus.value === null)
    return "设备状态";
  const selectedStatus = deviceStatus.value.find(
    (status) => status.value === curDeviceStatus.value
  );
  if (!selectedStatus || curDeviceStatus.value === "全部") return "全部";
  return selectedStatus.label + "设备";
});

const renderLabel: SelectRenderLabel = (status) => {
  return h(
    "div",
    {
      class: "flex-between gap-2 w-36 px-2",
    },
    [
      h("div", { class: "flex-center gap-2" }, [
        h("div", {
          class: "w-2 h-2 bg-black rounded-full ",
          style: {
            backgroundColor: status.color,
          },
        }),
        h("div", {}, status.label as string),
      ]),
      h(NCheckbox, {
        class: "w-4 h-4 ",
        checked: status.value === curDeviceStatus.value, // 是否选中
      }),
    ]
  );
};
</script>

<style scoped></style>
