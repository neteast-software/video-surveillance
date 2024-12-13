<template>
	<div class="home_page_container flex-1">
		<div class="top_decoration"></div>
		<div class="main_decoration"></div>
		<div class="main_decoration2"></div>
		<!-- <div class="bottom_decoration"></div> -->
		<div class="wave_canvas_container"></div>
		<div class="particle_canvas_container"></div>
		<div class="option_group_container">
			<div
				v-for="(item, index) in options"
				:key="`homePageOption${index}`"
				class="option_container absolute flex items-center cursor-pointer"
				:class="item.classStr"
				@click="gotoPath(item.path, item.windowOpne)"
			>
				<div class="menu-icon ml-20px mr-4">
					<div
						:class="` i-icons:${item.icon} text-white w-5 h-5 `"
					></div>
				</div>

				<div class="text-white text-16px">{{ item.name }}</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCommonInfoStore } from "@/stores/commonInfo";
import * as THREE from "three";
// import Stats from "three/addons/libs/stats.module.js";
const useCommonInfo = useCommonInfoStore();
const { userCode } = storeToRefs(useCommonInfo);
const router = useRouter();
const options = [
	{
		path: "/index",
		icon: "smart-monitoring",
		name: "智慧监控",
		classStr: `top-0 -left-75`,
		windowOpne: false,
	},
	{
		path: `http://36.248.25.240:8010/knowledgeSystem?token=G228&userCode=G228user-1`,
		icon: "knowledge-system",
		name: "知识库管理",
		classStr: `top-4 left-70`,
		windowOpne: true,
	},
	{
		path: "https://road228.neteast.cn/dsj/index.html",
		icon: "big-events",
		name: "大事记展示",
		classStr: `top-16 -left-5 `,
		windowOpne: true,
	},
	{
		path: "/dashboard",
		icon: "gis-dashboard",
		name: "GIS综合看板",
		classStr: `top-30 -left-85`,
		windowOpne: false,
	},

	{
		path: `http://36.248.25.132:18087/HelmetAuth/OtherSysAuth?token=${userCode.value}&projectcode=350100-GDG228XESQ`,
		icon: "helmet",
		name: "智慧安全帽",
		classStr: `top-42 left-10`,
		windowOpne: true,
	},
	{
		path: "/alarmList",
		icon: "alarm-list",
		name: "预警信息",
		classStr: `top-30  left-80`,
		windowOpne: false,
	},
];
function gotoPath(path: string, windowOpne: boolean) {
	if (windowOpne) {
		window.open(path);
	} else {
		router.push(path);
	}
}
onMounted(() => {
	// setParticle();
	waveShow();
});

function waveShow() {
	const SEPARATION = 100,
		AMOUNTX = 50,
		AMOUNTY = 50;

	let container, stats;
	let camera, scene, renderer;

	let particles,
		count = 0;

	let mouseX = 0,
		mouseY = 0;

	let windowHalfX = window.innerWidth / 2;
	let windowHalfY = window.innerHeight / 2;

	init();

	function init() {
		container = document.createElement("div");
		document.querySelector(".wave_canvas_container").appendChild(container);
		// document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			1,
			10000
		);
		camera.position.z = 2900;
		scene = new THREE.Scene();

		const numParticles = AMOUNTX * AMOUNTY;

		const positions = new Float32Array(numParticles * 3);
		const scales = new Float32Array(numParticles);

		let i = 0,
			j = 0;

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
				positions[i + 1] = 0; // y
				positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

				scales[j] = 1;

				i += 3;
				j++;
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
		const material = new THREE.ShaderMaterial({
			uniforms: {
				color: { value: new THREE.Color(0x196db9) },
				u_time: { value: count },
			},
			vertexShader: `attribute float scale;
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = scale * ( 300.0 / - mvPosition.z );
				gl_Position = projectionMatrix * mvPosition;
			}`,
			// finalColor.b = 0.5 + 0.5 * sin(u_time);
			fragmentShader: `
            uniform vec3 color;
            uniform float u_time;
			void main() {
				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                float aplha = 0.5 + 0.5 * sin(u_time);
                vec4 finalColor = vec4( color, aplha );
				gl_FragColor = finalColor;

			}`,
		});

		particles = new THREE.Points(geometry, material);
		scene.add(particles);
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setAnimationLoop(animate);
		container.appendChild(renderer.domElement);

		// stats = new Stats();
		// container.appendChild(stats.dom);

		container.style.touchAction = "none";
		container.addEventListener("pointermove", onPointerMove);

		window.addEventListener("resize", onWindowResize);
	}

	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	//

	function onPointerMove(event) {
		if (event.isPrimary === false) return;

		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}

	//

	function animate() {
		render();
		// stats.update();
	}

	function render() {
		camera.position.x += (mouseX - camera.position.x) * 0.05;
		// camera.position.y += (-mouseY - camera.position.y) * 0.05;
		camera.lookAt(scene.position);

		const positions = particles.geometry.attributes.position.array;
		const scales = particles.geometry.attributes.scale.array;

		let i = 0,
			j = 0;

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i + 1] =
					Math.sin((ix + count) * 0.3) * 50 +
					Math.sin((iy + count) * 0.5) * 50;

				scales[j] =
					(Math.sin((ix + count) * 0.3) + 1) * 20 +
					(Math.sin((iy + count) * 0.5) + 1) * 20;

				i += 3;
				j++;
			}
		}

		particles.geometry.attributes.position.needsUpdate = true;
		particles.geometry.attributes.scale.needsUpdate = true;

		renderer.render(scene, camera);

		count += 0.1;
	}
}
</script>
<style scoped>
/* waveBg.png */
.home_page_container {
	min-width: 1280 !important;
	min-height: 720px !important;
	width: 100% !important;
	padding: 0 !important;
	position: relative;
	background: linear-gradient(
		270deg,
		#01153d 0%,
		#03295c 20%,
		#03295c 80%,
		#01153d 100%
	);
}
.wave_canvas_container {
	width: 100%;
	height: 100%;
	position: absolute;
	bottom: -43%;
	left: 0;
	opacity: 0.8;
	/* pointer-events: none; */
}
.particle_canvas_container {
	width: 100%;
	height: 100%;
	position: absolute;
	bottom: 0;
	left: 0;
	pointer-events: none;
}

.option_container {
	width: 170px;
	height: 60px;
	/* background-image: url("/public/img/homePage/btnBg.png"); */
	background: linear-gradient(#162563, #1a4698);
	/* background-color:#000; */
	border-radius: 8px;
	border: 1px rgb(52, 52, 226) solid;
	background-size: contain;
	background-repeat: no-repeat;
	transform: scale(1);
	transition: all 0.1s ease;
}
.menu-icon {
	position: relative;
	&::before {
		content: " ";
		position: absolute;
		width: 30px;
		height: 30px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(#00adfb, #002e92);
		/* background-size: contain; */
		/* background-repeat: no-repeat; */
		/* background-position: center; */
		border-radius: 50%;
		background-color: #162563;
	}
}
.option_container:hover {
	opacity: 0.9 !important;
	transform: scale(1.05);
}

.top_decoration {
	width: 100% !important;
	min-height: 100px;
	background-size: 100% auto;
	background-repeat: no-repeat;
	background-image: url("/public/img/homePage/topDecoration.png");
	z-index: 1;
	position: absolute;
}
.main_decoration {
	pointer-events: none;
	width: 1600px;
	height: 600px;
	/* background: #000; */
	background-position: 72% 0%;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url("/public/img/homePage/mianDecoration.png");
	position: absolute;
	top: 20%;
	left: 50%;
	z-index: 1;
	transform: translateX(-50%);
	/* z-index: 9; */
}
@keyframes rotation {
	from {
		opacity: 0.5;
		transform: translateX(-50%) rotate(0deg);
	}
	to {
		opacity: 0.8;

		transform: translateX(-50%) rotate(360deg);
	}
}
.main_decoration2 {
	pointer-events: none;
	width: 1600px;
	height: 600px;
	/* background: #000; */
	background-position: 52% 0%;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url("/public/img/homePage/mianDecoration2.png");
	position: absolute;
	top: 2%;
	left: 50%;
	z-index: 1;
	transform: translateX(-50%);
	/* animation: rotation 4s linear infinite; */
}
.bottom_decoration {
	width: 100% !important;
	height: 230px;
	background-size: cover;
	background-repeat: no-repeat;
	background-image: url("/public/img/homePage/bottomDecoration.png");
	position: absolute;
	bottom: 0;
}
.option_group_container {
	position: absolute;
	top: 55%;
	left: 46%;
}

/* @media (max-height: 860px) {
  .option_group_container {
    top: 56%;
  }
} */
</style>
