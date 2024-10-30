import { createApp } from "vue";
import "linker-uii/dist/styles/linker-ui.css";
// import "./style.css";
import "./style/index.scss";
import App from "./App.vue";
import router from "../src/router";
import "virtual:uno.css";
import { createPinia } from "pinia";
import { setupCalendar } from "v-calendar";
import { Linker } from "linker-uii";
import http from "@/utils/network/http";

const linker = Linker.create();
linker.http = http;

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(setupCalendar, {});
app.mount("#app");
