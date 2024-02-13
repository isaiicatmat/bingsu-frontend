import Vue from "vue";

export default Vue.extend({
    methods: {
        getTwoDigitsTime(val: string){
            return new Date(+val * 1000).toLocaleTimeString('es-MX',{hour: '2-digit', minute: '2-digit', hour12: true})
        },
        getFormattedDate(val: string){
            return new Date(+val * 1000).toLocaleDateString('ex-MX', {year: 'numeric', month: 'long', day: 'numeric'});
        },
        getFormattedDateWithDaysUpperCase(val: string){
            return new Date(+val * 1000).toLocaleDateString('ex-MX',
                {weekday: 'long', month: 'long', day: 'numeric'}).replace(/\w/, firstLetter => firstLetter.toUpperCase());
        },
        getShortDate(date: Date) {
            return date.toISOString().slice(0, 10);
        },
    },
});
