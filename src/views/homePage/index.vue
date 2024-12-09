<template>
	<div class="home_page_container flex-1">
		<div class="top_decoration"></div>
		<div class="main_decoration"></div>
		<div class="main_decoration2"></div>
		<!-- <div class="bottom_decoration"></div> -->
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
		path: "http://36.248.25.240:8010/knowledgeSystem?token=G228&userCode=G228user-1",
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
		path: "http://36.248.25.132:18087/HelmetAuth/OtherSysAuth?token=&projectcode=350100-GDG228XESQ",
		icon: "helmet",
		name: "智慧安全帽",
		classStr: `top-42 left-10`,
		windowOpne: false,
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
	setParticle();
});

// function waveShow() {
// 	import * as THREE from "three";
// 	import Stats from "three/addons/libs/stats.module.js";

// 	const SEPARATION = 100,
// 		AMOUNTX = 50,
// 		AMOUNTY = 50;

// 	let container, stats;
// 	let camera, scene, renderer;

// 	let particles,
// 		count = 0;

// 	let mouseX = 0,
// 		mouseY = 0;

// 	let windowHalfX = window.innerWidth / 2;
// 	let windowHalfY = window.innerHeight / 2;

// 	init();

// 	function init() {
// 		container = document.createElement("div");
// 		document.body.appendChild(container);

// 		camera = new THREE.PerspectiveCamera(
// 			75,
// 			window.innerWidth / window.innerHeight,
// 			1,
// 			10000
// 		);
// 		camera.position.z = 1000;

// 		scene = new THREE.Scene();

// 		//

// 		const numParticles = AMOUNTX * AMOUNTY;

// 		const positions = new Float32Array(numParticles * 3);
// 		const scales = new Float32Array(numParticles);

// 		let i = 0,
// 			j = 0;

// 		for (let ix = 0; ix < AMOUNTX; ix++) {
// 			for (let iy = 0; iy < AMOUNTY; iy++) {
// 				positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
// 				positions[i + 1] = 0; // y
// 				positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

// 				scales[j] = 1;

// 				i += 3;
// 				j++;
// 			}
// 		}

// 		const geometry = new THREE.BufferGeometry();
// 		geometry.setAttribute(
// 			"position",
// 			new THREE.BufferAttribute(positions, 3)
// 		);
// 		geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

// 		const material = new THREE.ShaderMaterial({
// 			uniforms: {
// 				color: { value: new THREE.Color(0xffffff) },
// 			},
// 			vertexShader: document.getElementById("vertexshader").textContent,
// 			fragmentShader:
// 				document.getElementById("fragmentshader").textContent,
// 		});

// 		//

// 		particles = new THREE.Points(geometry, material);
// 		scene.add(particles);

// 		//

// 		renderer = new THREE.WebGLRenderer({ antialias: true });
// 		renderer.setPixelRatio(window.devicePixelRatio);
// 		renderer.setSize(window.innerWidth, window.innerHeight);
// 		renderer.setAnimationLoop(animate);
// 		container.appendChild(renderer.domElement);

// 		stats = new Stats();
// 		container.appendChild(stats.dom);

// 		container.style.touchAction = "none";
// 		container.addEventListener("pointermove", onPointerMove);

// 		//

// 		window.addEventListener("resize", onWindowResize);
// 	}

// 	function onWindowResize() {
// 		windowHalfX = window.innerWidth / 2;
// 		windowHalfY = window.innerHeight / 2;

// 		camera.aspect = window.innerWidth / window.innerHeight;
// 		camera.updateProjectionMatrix();

// 		renderer.setSize(window.innerWidth, window.innerHeight);
// 	}

// 	//

// 	function onPointerMove(event) {
// 		if (event.isPrimary === false) return;

// 		mouseX = event.clientX - windowHalfX;
// 		mouseY = event.clientY - windowHalfY;
// 	}

// 	//

// 	function animate() {
// 		render();
// 		stats.update();
// 	}

// 	function render() {
// 		camera.position.x += (mouseX - camera.position.x) * 0.05;
// 		camera.position.y += (-mouseY - camera.position.y) * 0.05;
// 		camera.lookAt(scene.position);

// 		const positions = particles.geometry.attributes.position.array;
// 		const scales = particles.geometry.attributes.scale.array;

// 		let i = 0,
// 			j = 0;

// 		for (let ix = 0; ix < AMOUNTX; ix++) {
// 			for (let iy = 0; iy < AMOUNTY; iy++) {
// 				positions[i + 1] =
// 					Math.sin((ix + count) * 0.3) * 50 +
// 					Math.sin((iy + count) * 0.5) * 50;

// 				scales[j] =
// 					(Math.sin((ix + count) * 0.3) + 1) * 20 +
// 					(Math.sin((iy + count) * 0.5) + 1) * 20;

// 				i += 3;
// 				j++;
// 			}
// 		}

// 		particles.geometry.attributes.position.needsUpdate = true;
// 		particles.geometry.attributes.scale.needsUpdate = true;

// 		renderer.render(scene, camera);

// 		count += 0.1;
// 	}
// }
function setParticle() {
	/**
	 *3D海洋效应与 Canvas2D
	 * 您可以更改注释 "效果属性" 下的属性
	 */

	// Init Context
	const canvasEl = document.createElement("canvas");
	canvasEl.className = "particle_canvas";
	let c = document.createElement("canvas").getContext("2d");
	let postctx = document
		.querySelector(".particle_canvas_container")
		.appendChild(canvasEl)
		.getContext("2d");
	let canvas = c.canvas;
	let vertices = [];

	// Effect Properties
	let vertexCount = 7000;
	let vertexSize = 3;
	let oceanWidth = 60;
	let oceanHeight = -80;
	let gridSize = 64;
	let waveSize = 16;
	let perspective = 100;

	// Common variables
	let depth = (vertexCount / oceanWidth) * gridSize;
	let frame = 0;
	let { sin, cos, tan, PI } = Math;

	// Render loop
	let loop = () => {
		let rad = (sin(frame / 100) * PI) / 20;
		let rad2 = (sin(frame / 50) * PI) / 10;
		frame++;
		if (
			postctx.canvas.width !== postctx.canvas.offsetWidth ||
			postctx.canvas.height !== postctx.canvas.offsetHeight
		) {
			postctx.canvas.width = canvas.width = postctx.canvas.offsetWidth;
			postctx.canvas.height = canvas.height = postctx.canvas.offsetHeight;
		}

		c.fillStyle = `rgb(10,20,53)`;
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.save();
		c.translate(canvas.width / 2, canvas.height / 1.4);
		c.beginPath();
		vertices.forEach((vertex, i) => {
			let ni = i + oceanWidth;
			let x = vertex[0] - (frame % (gridSize * 2));
			let z =
				vertex[2] -
				((frame * 2) % gridSize) +
				(i % 2 === 0 ? gridSize / 2 : 0);
			let wave =
				cos(frame / 45 + x / 50) -
				sin(frame / 20 + z / 50) +
				sin(frame / 30 + (z * x) / 10000);
			let y = vertex[1] + wave * waveSize;
			let a = Math.max(0, 1 - Math.sqrt(x ** 2 + z ** 2) / depth);
			let tx, ty, tz;

			y -= oceanHeight;

			// Transformation variables
			tx = x;
			ty = y;
			tz = z;

			// Rotation Y
			tx = x * cos(rad) + z * sin(rad);
			tz = -x * sin(rad) + z * cos(rad);

			x = tx;
			y = ty;
			z = tz;

			// Rotation Z
			tx = x * cos(rad) - y * sin(rad);
			ty = x * sin(rad) + y * cos(rad);

			x = tx;
			y = ty;
			z = tz;

			// Rotation X

			ty = y * cos(rad2) - z * sin(rad2);
			tz = y * sin(rad2) + z * cos(rad2);

			x = tx;
			y = ty;
			z = tz;

			x /= z / perspective;
			y /= z / perspective;

			if (a < 0.01) return;
			if (z < 0) return;

			c.globalAlpha = a;
			c.fillStyle = `hsl(${180 + wave * 20}deg, 100%, 50%)`;
			c.fillRect(
				x - (a * vertexSize) / 2,
				y - (a * vertexSize) / 2,
				a * vertexSize,
				a * vertexSize
			);
			c.globalAlpha = 1;
		});
		c.restore();

		// Post-processing
		postctx.drawImage(canvas, 0, 0);
		postctx.globalCompositeOperation = "screen";
		postctx.filter = "blur(16px)";
		postctx.drawImage(canvas, 0, 0);
		postctx.filter = "blur(0)";
		postctx.globalCompositeOperation = "source-over";

		requestAnimationFrame(loop);
	};

	// Generating dots
	for (let i = 0; i < vertexCount; i++) {
		let x = i % oceanWidth;
		let y = 0;
		let z = (i / oceanWidth) >> 0;
		let offset = oceanWidth / 2;
		vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize]);
	}

	loop();
}
</script>
<style scoped>
/* waveBg.png */
.home_page_container {
	width: 100% !important;
	min-width: 1580px;
	min-height: 860px;
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
.particle_canvas_container {
	width: 100%;
	height: 50%;
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
	height: 100px;
	background-size: cover;
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
