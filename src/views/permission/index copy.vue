<template>
  <div class="flex flex-col h-full">
    <TitleBar class="mb-8" title="角色权限"></TitleBar>
    <div class="flex h-0 flex-1">
      <RoleBar class="mr-6" @change="selectedRoleId = $event"></RoleBar>
      <section class="w-0 flex-1 pt-8">
        <NTabs
          class="h-full"
          type="line"
          animated
          pane-wrapper-class="h-0 flex-1"
          :pane-style="{ height: '100%', paddingTop: 0 }"
        >
          <NTabPane
            display-directive="show:lazy"
            name="角色人员"
            tab="角色人员"
          >
            <!-- <RoleCrew></RoleCrew> -->
            <viewer
              class="h-full"
              v-if="selectedRoleId"
              :uri="`/system/role/authUser/toAllocatedList?roleId=${selectedRoleId}`"
              :payload="{ roleId: selectedRoleId }"
              :key="selectedRoleId"
            ></viewer>
          </NTabPane>
          <NTabPane
            :tab-props="{
              style: { marginRight: '40px' },
              class:
                'relative after:absolute after:-right-10 after:inline-block after:w-px after:h-5 after:bg-[#D8D8D8]',
            }"
            display-directive="show:lazy"
            name="角色权限"
            tab="角色权限"
          >
            <RolePermission
              :role-id="selectedRoleId"
              :key="selectedRoleId"
            ></RolePermission>
          </NTabPane>
          <NTabPane
            v-for="tab in tabs"
            :key="tab.dictValue"
            display-directive="show:lazy"
            :name="tab.dictLabel"
            :tab="tab.dictLabel"
          >
            <FunctionalPermission
              :tab-id="tab.dictValue"
              :role-id="selectedRoleId"
              :key="selectedRoleId"
              :types="tab.commitType"
              :cascade="tab.cascade"
            ></FunctionalPermission>
          </NTabPane>
        </NTabs>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from "@ebuild/ui/topbar/TitleBar.vue";
import RolePermission from "./RolePermission.vue";
import FunctionalPermission from "./FunctionalPermission.vue";
// import RoleCrew from './RoleCrew.vue';
import RoleBar from "./RoleBar.vue";
import { NTabs, NTabPane } from "naive-ui";
import viewer from "@ebuild/ui/table/viewer.vue";
import { onMounted, ref, shallowRef } from "vue";
import { getFunctionTabs } from "@/utils/network/api/manager";
import type { FunctionTab } from "@/utils/network/types/manager";
const selectedRoleId = ref(0);
const tabs = shallowRef<FunctionTab[]>([]);
async function initTabs() {
  const { data } = await getFunctionTabs();
  tabs.value = data;
}
onMounted(initTabs);
</script>

<style scoped></style>
