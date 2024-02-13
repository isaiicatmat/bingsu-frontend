import _Vue from 'vue';
import Axios from 'axios';
import authService from "@/services/auth";

const baseURL = process.env.VUE_APP_BACKEND_URL;

export const axiosInstance = Axios.create({
  baseURL
});

axiosInstance.interceptors.request.use(async function(config) {
  config.headers = {
    'Authorization': `Bearer ${await authService.getToken() ?? ''}`,
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export function AxiosPlugin(
    Vue: typeof _Vue,
): void {
  Vue.prototype.$http = axiosInstance
}

