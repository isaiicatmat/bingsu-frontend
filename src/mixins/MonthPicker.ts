import Vue from "vue";

export default Vue.extend({
    data: () => {
        return {
            menu: false,
            month: new Date().toISOString().slice(0, 7),
            year: new Date().getFullYear(),
        }
    },
    computed: {
        fmtMonth() {
            return new Date(this.month + '-02').toLocaleDateString('es-MX', {year: 'numeric', month: 'long'});
        }
    },
    watch: {
        month(newValue) {
            const newYear = new Date(newValue + '-02').getFullYear();
            this.year = this.year !== newYear ? newYear : this.year;
        }
    },
    methods: {
        allowedDates(val: string) {
            return new Date(val) < new Date();
        },
        allowedFutureDates(val: string) {
            const today = new Date();
            today.setDate(today.getDate() - 1)
            return new Date(val) >= today;
        },
        getNextMonth(month: string) {
            const nextMonthTimestamp = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 2, 0);
            return new Date(nextMonthTimestamp).toISOString();
        },
        getLastMonth(month: string){
            const lastMonthTimestamp = new Date(month).setMonth(new Date(month).getMonth() - 1);
            return new Date(lastMonthTimestamp).toISOString();
        },

    }
})
