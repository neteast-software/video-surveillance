<template>
	<div
		class="bg relative w-screen h-screen"
		style="padding-top: 160px"
		v-if="bindingSuccessful"
	>
		<div class="flex-col items-center">
			<img
				class="max-w-200px"
				src="/public/img/binding/bindingSuccessful.png"
				alt=""
			/>
			<div class="text-16px my-40px">绑定成功</div>
			<div class="back_btn" @click="bindingSuccessful = false">完成</div>
		</div>
	</div>
	<div class="relative w-full h-full" v-else>
		<div class="decoration_bg absolute w-full h-400px top-0"></div>
		<div class="decoration_ball -top-50px -right-10% w-120px h-120px"></div>
		<div class="decoration_ball top-40px right-26% w-70px h-70px"></div>
		<div class="decoration_ball top-160px -left-10% w-90px h-90px"></div>
		<img
			class="absolute w-60% left-10% top-60px"
			src="/public/img/binding/slogan.png"
			alt=""
		/>
		<div class="binding_container rounded-lg w-full">
			<div class="logo_container"></div>
			<NForm
				class="mt-90px"
				ref="formRef"
				:model="formData"
				:rules="rules"
			>
				<NFormItem class="h-50px" path="loginName">
					<div class="w-full">
						<NInput
							:bordered="false"
							v-model:value="formData.loginName"
							placeholder="请输入用户名"
							class="!text-14px"
						>
							<template #prefix>
								<div
									class="i-icons:account text-#8A92A6 w-4 h-4 mr-2"
								></div>
								<div class="right_line"></div>
							</template>
						</NInput>
					</div>
				</NFormItem>
				<div class="bottom_line"></div>
				<NFormItem
					class="h-80px mb-2 -translate-y-10px"
					path="phonenumber"
				>
					<div class="w-full">
						<NInput
							:input-props="{ autocomplete: 'new-password' }"
							class="!text-14px"
							:bordered="false"
							v-model:value="formData.phonenumber"
							placeholder="请输入手机号"
						>
							>
							<template #prefix>
								<div
									class="i-icons:phone text-#8A92A6 w-4 h-4 mr-2"
								></div>
								<div class="right_line"></div>
							</template>
						</NInput>
					</div>
				</NFormItem>
				<NButton
					type="primary"
					:round="false"
					style="
						height: 48px;
						width: 100%;
						border-radius: 8px;
						border: none;
						background: linear-gradient(
							292deg,
							#1b78fc 22%,
							#48b3ff 93%
						);
					"
					:bordered="false"
					class="!text-xl mt-20px"
					@click="handleBinding"
					>登录</NButton
				>
			</NForm>
		</div>
	</div>
</template>
<script setup lang="ts">
import { NInput, NForm, NFormItem, NButton, NCheckbox } from "naive-ui";
import {
	buildAuthorizationUrl,
	getAuthorizationToken,
	bindAccount,
} from "@/utils/network/api/binding";
// import { bindAccount } from "";
import { ref, onMounted } from "vue";
import storage from "@/utils/other/storage";
import { useRoute, useRouter } from "vue-router";
const formData = ref({
	loginName: "",
	phonenumber: "",
});

const rules = {
	loginName: [
		{ required: true, message: "请输入用户名", trigger: "blur" },
		// { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
	],
	phonenumber: [
		{ required: true, message: "请输入手机号", trigger: "blur" },
		// { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
	],
};
const formRef = ref(null);
const bindingSuccessful = ref(false);
const testCode = ref();
const route = useRoute();
const router = useRouter();
onMounted(async () => {
	const token = route.query.token as string;
	if (token) {
		storage.set("mpAuthorization", token);
	} else {
		window.$message.error("身份校验失败失败");
		// const { data } = await buildAuthorizationUrl();
		// if (data) {
		//   console.log("即将跳转----");
		//   console.log(data);
		//   setTimeout(() => {
		//     window.location.href = data;
		//   }, 6000);
		// }
	}
});
function handleBinding() {
	formRef.value?.validate().then(async (valid) => {
		if (valid) {
			await bindAccount(formData.value);
			bindingSuccessful.value = true;
		} else {
			console.log("error");
		}
	});
}
</script>

<style scoped lang="scss">
* {
	padding: 0;
}
.bg {
	background: linear-gradient(188deg, #dff0ff 7%, #f1f5f9 34%, #f6f6f6 101%);
}
.back_btn {
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 16px;
	width: 180px;
	height: 50px;
	border-radius: 120px;
	background: linear-gradient(305deg, #1b78fc 20%, #48b3ff 102%);
	box-shadow: 0px 6px 10px 0px rgba(22, 121, 253, 0.2784);
}
.decoration_bg {
	border-radius: 0px 0px 150px 150px;
	opacity: 1;
	background: linear-gradient(180deg, #1b79fc 0%, #47b3ff 100%);
}
.bottom_line {
	width: 100%;
	height: 1px;
	margin-top: 32px;
	background: #848484;
	opacity: 0.2;
}
.right_line {
	width: 1px;
	height: 12px;
	margin-left: 5px;
	margin-right: 10px;
	background: #000000;
	opacity: 0.2;
}
.decoration_ball {
	position: absolute;
	opacity: 0.29;
	border-radius: 50%;
	background: linear-gradient(
		90deg,
		#592da3 0%,
		#5499fe 0%,
		#6ea2f5 0%,
		#5389e8 100%
	);
}
.binding_container {
	position: absolute;
	left: 50%;
	top: 260px;
	transform: translateX(-50%);
	width: 90%;
	height: 340px;
	border-radius: 30px;
	opacity: 1;
	background: #ffffff;
	/* 阴影/弥散阴影 */
	box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.16);
}
.logo_container {
	position: absolute;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	background: white;
	width: 120px;
	height: 120px;
	border: 4px solid rgba(71, 179, 255, 0.3);
	border-radius: 50%;
}
.logo_container::after {
	content: "";
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) scale(0.8);
	transform-origin: center;
	width: 100%;
	height: 100%;
	background: url("/public/img/binding/logo.png") no-repeat;
	background-size: 100% 100%;
}

::v-deep(.n-form) {
	width: 100% !important;
	padding: 0 30px !important;
}
::v-deep(.n-input-wrapper) {
	padding: 0 !important;
}
</style>
