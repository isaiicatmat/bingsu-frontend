import Vue from "vue";
import {subtractDays} from '@/utils/DateHelper';

export default Vue.extend({
    data: () => {
        return {
            initialDate: new Date().toISOString().slice(0, 7),
            endDate: subtractDays(new Date(), 1).toISOString().slice(0, 7),
            initialDateMenu: false,
            endDateMenu: false,
        }
    },
    methods: {
        allowedDates(val: string) {
            return new Date(val) < new Date();
        },
    },
    computed: {
        fmtInitialDate() {
            return new Date(this.initialDate + '-02').toLocaleDateString('es-MX', {year: 'numeric', month: 'long'});
        },
        fmtEndDate() {
            return new Date(this.endDate + '-02').toLocaleDateString('es-MX', {year: 'numeric', month: 'long'});
        }
    }
})
