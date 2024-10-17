<template>
  <NPopselect
    v-model:value="curDeviceStatus"
    :options="DeviceStatus"
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
const { DeviceStatus, curDeviceStatus } = storeToRefs(deviceInfo);

const selectState = ref(false);
// 显示设备状态，拼接上“设备”关键字，除了“全部”
const displayDeviceStatus = computed(() => {
  // 打印当前状态的值，方便调试
  console.log(curDeviceStatus.value);
  if (curDeviceStatus.value === undefined || curDeviceStatus.value === null) {
    return "设备状态";
  }
  // 查找 curDeviceStatus 对应的状态对象
  const selectedStatus = DeviceStatus.value.find(
    (status) => status.value === curDeviceStatus.value
  );
  // 如果找不到对应的状态或是选择了 "全部" (id 为 0)，返回默认状态
  if (!selectedStatus || curDeviceStatus.value === 0) {
    return "全部";
  }
  // 返回选中状态的 label，并拼接 "设备"
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
        checked: status.value === curDeviceStatus.value, // 如果当前选项的值等于 selectValue，则选中
      }),
    ]
  );
};
</script>

<style scoped></style>
