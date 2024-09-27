<template>
    <DataFrame title="区域人流量" class="h-78">
        <div class="h-0 flex-1">
            <LineChart :source="source" y-axis-name="数量/" x-axis-name="/时间" :legend="legend"></LineChart>
        </div>
    </DataFrame>
</template>

<script setup lang="ts">
import DataFrame from '@ebuild/ui/other/DataFrame.vue';
import LineChart from '@ebuild/ui/chart/LineChart.vue';
import { getRegionPersonFlow } from '@ebuild/utils/network/api/security';
import { onMounted, reactive, ref } from 'vue';
import { createChartSource } from '@ebuild/utils/other/business';

const source = ref<(string | number)[][]>([]);
async function initData() {
    const { data } = await getRegionPersonFlow();
    console.log('人流量数据', data);
    const { dataBody } = data || {};
    source.value = createChartSource(dataBody);
}
onMounted(initData);
const legend = reactive({
    right: 0
});
</script>

<style scoped></style>
