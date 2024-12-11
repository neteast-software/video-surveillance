<template>
	<div class="flex-col">
		<div
			class="flex items-center w-full pb-4 mb-4"
			style="border-bottom: 1px solid #f1f1f1"
		>
			<div class="i-icons:project-info w-4.5 h-4.5 mr-2"></div>
			项目信息管理
		</div>
		<div class="overflow-scroll flex-1">
			<NForm ref="formRef" :model="formData" :rules="rules">
				<div class="flex gap-14 mb-4 w-full">
					<!-- left -->
					<div class="flex-1 flex-col max-w-600px">
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>所属地市:
							</div>
							<NFormItem class="flex-1" path="city">
								<NInput
									v-model:value="formData.city"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center w-full mb-30px"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目全称:
							</div>
							<NFormItem class="flex-1 h-50px" path="fullName">
								<NInput
									type="textarea"
									v-model:value="formData.fullName"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目简称:
							</div>
							<NFormItem class="flex-1" path="abbr">
								<NInput
									v-model:value="formData.abbr"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目起点:
							</div>
							<NFormItem class="flex-1" path="startPoint">
								<NInput
									v-model:value="formData.startPoint"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目终点:
							</div>
							<NFormItem class="flex-1" path="endPoint">
								<NInput
									v-model:value="formData.endPoint"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>建设标准:
							</div>
							<NFormItem
								class="flex-1"
								path="constructionStandards"
							>
								<NInput
									v-model:value="
										formData.constructionStandards
									"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>

						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>概算总投资(亿):
							</div>
							<NFormItem
								class="flex-1"
								path="estimatedInvestment"
							>
								<NInputNumber
									v-model:value="formData.estimatedInvestment"
									placeholder="请输入"
									class="!text-14px w-full"
								>
								</NInputNumber>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>全线用地批复时间:
							</div>
							<NFormItem class="flex-1" path="landApprovalDate">
								<NDatePicker
									v-model:formatted-value="
										formData.landApprovalDate
									"
									value-format="yyyy-MM-dd"
									placeholder="请选择"
									class="!text-14px flex-1"
								>
								</NDatePicker>
							</NFormItem>
						</div>
					</div>
					<!-- right -->
					<div class="flex-1 max-w-600px">
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目状态:
							</div>
							<NFormItem class="flex-1" path="projectStatus">
								<NSelect
									v-model:value="formData.projectStatus"
									:options="statusOption"
									placeholder="请选择"
									class="!text-14px"
								>
								</NSelect>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center w-full mb-30px"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>项目途经:
							</div>
							<NFormItem class="flex-1 h-50px" path="route">
								<NInput
									type="textarea"
									v-model:value="formData.route"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>建设规模(KM):
							</div>
							<NFormItem class="flex-1" path="constructionScale">
								<NInput
									v-model:value="formData.constructionScale"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>

						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>开工日期:
							</div>
							<NFormItem class="flex-1" path="startDate">
								<NDatePicker
									v-model:formatted-value="formData.startDate"
									value-format="yyyy-MM-dd"
									placeholder="请选择"
									class="!text-14px flex-1"
								>
								</NDatePicker>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>通车日期:
							</div>
							<NFormItem class="flex-1" path="operationStartDate">
								<NDatePicker
									v-model:formatted-value="
										formData.operationStartDate
									"
									value-format="yyyy-MM-dd"
									placeholder="请选择"
									class="!text-14px flex-1"
								>
								</NDatePicker>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								竣工日期:
							</div>
							<NFormItem class="flex-1">
								<NDatePicker
									clearable
									v-model:formatted-value="
										formData.completionDate
									"
									value-format="yyyy-MM-dd"
									placeholder="请选择"
									class="!text-14px flex-1"
								>
								</NDatePicker>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								<span class="text-red">*</span>建设工期(月):
							</div>
							<NFormItem class="flex-1" path="constructionPeriod">
								<NInputNumber
									v-model:value="formData.constructionPeriod"
									placeholder="请输入"
									class="!text-14px w-full"
								>
								</NInputNumber>
							</NFormItem>
						</div>
						<!--  -->
						<div
							class="item-container flex items-center h-64px w-full"
						>
							<div class="w-28 mr-4 text-align-end">
								路线性质:
							</div>
							<NFormItem class="flex-1" path="routeNature">
								<NInput
									v-model:value="formData.routeNature"
									placeholder="请输入"
									class="!text-14px"
								>
								</NInput>
							</NFormItem>
						</div>
					</div>
				</div>
				<!--  -->
				<div
					class="item-container flex items-start w-full mb-60px max-w-1260px"
				>
					<div class="w-28 mr-4 text-align-end">
						<span class="text-red">*</span>建设规模、主要 技术标准:
					</div>
					<NFormItem
						class="flex-1 h-50px"
						path="constructionTechStandards"
					>
						<NInput
							v-model:value="formData.constructionTechStandards"
							type="textarea"
							style="resize: none"
							placeholder="请输入"
							class="!text-14px"
						>
						</NInput>
					</NFormItem>
				</div>
				<!--  -->
				<div
					class="item-container flex items-start w-full mb-60px max-w-1260px"
				>
					<div class="w-28 mr-4 text-align-end">
						<span class="text-red">*</span>项目建设意义与 主要效益:
					</div>
					<NFormItem
						class="flex-1 h-50px"
						path="projectSignificanceBenefits"
					>
						<NInput
							v-model:value="formData.projectSignificanceBenefits"
							type="textarea"
							style="resize: none"
							placeholder="请输入"
							class="!text-14px"
						>
						</NInput>
					</NFormItem>
				</div>
				<!--  -->
				<div
					class="item-container flex items-start w-full mb-60px max-w-1260px"
				>
					<div class="w-28 mr-4 text-align-end">
						<span class="text-red">*</span>资金来源(金额 及比例%):
					</div>
					<NFormItem class="flex-1 h-50px" path="fundingSource">
						<NInput
							v-model:value="formData.fundingSource"
							type="textarea"
							style="resize: none"
							placeholder="请输入"
							class="!text-14px"
						>
						</NInput>
					</NFormItem>
				</div>
				<NButton
					v-if="allowModify"
					type="primary"
					:round="false"
					style="
						margin-left: 128px;
						height: 36px;
						width: 96px;
						border-radius: 4px;
					"
					@click="handleSubmit"
					>保存</NButton
				>
			</NForm>
		</div>
	</div>
</template>
<script setup lang="ts">
import {
	NInput,
	NInputNumber,
	NForm,
	NFormItem,
	NButton,
	NCheckbox,
	NDatePicker,
	NSelect,
} from "naive-ui";
import {
	getProjectDetail,
	saveProjectDetail,
} from "@/utils/network/api/baseSetting";
import { ProjectDetail } from "@/utils/network/types/baseSetting";
import { ref, onMounted } from "vue";
import { useCommonInfoStore } from "@/stores/commonInfo";
import { storeToRefs } from "pinia";
const { allowModify } = storeToRefs(useCommonInfoStore());
const formRef = ref(null);
const statusOption = [
	{ label: "筹备中", value: "1" },
	{ label: "建设中", value: "2" },
	{ label: "已交工", value: "3" },
	{ label: "已竣工", value: "4" },
];
const formData = ref<ProjectDetail>({
	/**
	 * 项目简称
	 */
	abbr: "",
	/**
	 * 项目审批或核准概况
	 */
	approvalSummary: "",
	/**
	 * 所属地市
	 */
	city: "",
	/**
	 * 竣工日期
	 */
	completionDate: null,
	/**
	 * 建设工期
	 */
	constructionPeriod: 0,
	/**
	 * 建设规模
	 */
	constructionScale: "",
	/**
	 * 建设标准
	 */
	constructionStandards: "",
	/**
	 * 建设规模、主要技术标准
	 */
	constructionTechStandards: "",
	/**
	 * 项目终点
	 */
	endPoint: "",
	/**
	 * 概算总投资
	 */
	estimatedInvestment: 0,
	/**
	 * 项目全称
	 */
	fullName: "",
	/**
	 * 资金来源
	 */
	fundingSource: "",
	id: 0,
	/**
	 * 全线用地批复时间
	 */
	landApprovalDate: "2024-01-01",
	/**
	 * 通车日期
	 */
	operationStartDate: "2024-01-01",
	/**
	 * 项目建设意义与主要效益
	 */
	projectSignificanceBenefits: "",
	/**
	 * 项目状态 1：筹备中  2：建设中 3：已交工 4：已竣工
	 */
	projectStatus: "1",
	/**
	 * 项目途经
	 */
	route: "",
	/**
	 * 路线性质
	 */
	routeNature: "",
	/**
	 * 开工日期
	 */
	startDate: "2024-01-01",
	/**
	 * 项目起点
	 */
	startPoint: "",
});
onMounted(async () => {
	const { data } = await getProjectDetail();
	console.log(data);
	//   data.completionDate = data.completionDate
	//     ? data.completionDate
	//     : "2024-01-01";
	data.landApprovalDate = data.landApprovalDate
		? data.landApprovalDate
		: "2024-01-01";
	data.operationStartDate = data.operationStartDate
		? data.operationStartDate
		: "2024-01-01";
	data.startDate = data.startDate ? data.startDate : "2024-01-01";
	data.projectStatus = data.projectStatus ? data.projectStatus : "1";
	formData.value = data;
});
const rules = {
	city: [{ required: true, message: "请输入所属地市", trigger: "blur" }],
	abbr: [{ required: true, message: "请输入项目简称", trigger: "blur" }],
	startPoint: [
		{ required: true, message: "请输入项目起点", trigger: "blur" },
	],
	endPoint: [{ required: true, message: "请输入项目终点", trigger: "blur" }],
	constructionStandards: [
		{ required: true, message: "请输入建设标准", trigger: "blur" },
	],
	//   estimatedInvestment: [
	//     { required: true, message: "请输入概算总投资", trigger: "blur" },
	//   ],
	landApprovalDate: [
		{ required: true, message: "请选择全线用地批复时间", trigger: "blur" },
	],
	fullName: [{ required: true, message: "请输入项目全称", trigger: "blur" }],

	route: [{ required: true, message: "请输入项目途经", trigger: "blur" }],
	constructionScale: [
		{ required: true, message: "请输入建设规模", trigger: "blur" },
	],
	startDate: [{ required: true, message: "请选择开工日期", trigger: "blur" }],
	operationStartDate: [
		{ required: true, message: "请选择通车日期", trigger: "blur" },
	],
	//   constructionPeriod: [
	//     { required: true, message: "请输入建设工期", trigger: "blur" },
	//   ],
	constructionTechStandards: [
		{
			required: true,
			message: "请输入建设规模、主要技术标准",
			trigger: "blur",
		},
	],
	projectSignificanceBenefits: [
		{
			required: true,
			message: "请输入项目建设意义与主要效益",
			trigger: "blur",
		},
	],
	fundingSource: [
		{ required: true, message: "请输入资金来源", trigger: "blur" },
	],
};
function handleSubmit() {
	console.log("提交");
	formRef.value
		?.validate()
		.then(async (valid) => {
			console.log("111111");
			console.log(valid);
			if (valid) {
				await saveProjectDetail(formData.value);
				window.$message?.success("提交成功");
			}
		})
		.catch((err) => {
			console.log("22222");
			console.log(err);
			window.$message?.error("提交失败");
		});
}
</script>
<style scoped></style>
