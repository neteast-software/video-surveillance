<template>
  <div class="p-6 flex fill-parent gap-4 bg-white lt-laptop-(p-4)">
    <aside class="flex-w-rest flex-col gap-4">
      <div class="flex gap-4">
        <monitorStatus class="w-full"></monitorStatus>
        <probeStatus class="w-full"></probeStatus>
      </div>
      <div
        class="flex gap-4 flex-h-rest min-h-280px max-h-500px lt-laptop-(min-h-260px)"
      >
        <deviceStatus class="min-w-64%"></deviceStatus>
        <deviceTypeAlarm class="flex-w-rest"></deviceTypeAlarm>
      </div>
      <alarmTrend></alarmTrend>
    </aside>
    <historicalEvents class="w-26% h-full"> </historicalEvents>
  </div>
</template>

<script setup lang="ts">
import monitorStatus from "./monitorStatus.vue";
import probeStatus from "./probeStatus.vue";
import deviceStatus from "./deviceStatus.vue";
import deviceTypeAlarm from "./deviceTypeAlarm.vue";
import alarmTrend from "./alarmTrend.vue";
import historicalEvents from "./historicalEvents.vue";
</script>

<style scoped></style>
