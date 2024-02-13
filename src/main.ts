import Vue from 'vue'
import {AxiosPlugin} from "@/plugins/axios";
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import authService from "@/services/auth";
import {ChartJSPlugin} from "@/plugins/chart";

Vue.config.productionTip = false;

Vue.use(AxiosPlugin);
Vue.use(ChartJSPlugin);

let app: unknown = null;
authService.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
});
