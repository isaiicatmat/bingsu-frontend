import Chart from 'chart.js/auto';
import _Vue from 'vue';


export function ChartJSPlugin(
    Vue: typeof _Vue,
): void {
    Vue.prototype.$chartjs = Chart
}

