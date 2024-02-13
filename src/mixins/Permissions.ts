import Vue from "vue";
import {Permission} from "@/modules/permission/types";

export default Vue.extend({
    data: () => {
        return {

        }
    },
    methods: {
        getDateFromMilliseconds(seconds: number) {
            return new Date(seconds * 1000)
                .toISOString().substr(0, 10)
        },
        getFmtDescription(item: Permission) {
            return item.type !== "VACATION" ? item.description : "Periodo de vacaciones"
        },
        getFmtPermissionType(item: Permission) {
            if (item.type === "VACATION") {
                return 'Vacaciones';
            } else if (item.type === "OCCASIONAL") {
                return 'Especial';
            }
            return '';
        },
        getFmtDates(item: Permission) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (item.startDate._seconds === item.endDate._seconds) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return this.getDateFromMilliseconds(item.startDate._seconds);
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return this.getDateFromMilliseconds(item.startDate._seconds) + ' / ' + this.getDateFromMilliseconds(item.endDate._seconds)
            }
        },
        getFmtPermissionStatus(item: Permission) {
            switch (item.status) {
                case 'DENIED':
                    return 'Denegado';
                case 'PENDING':
                    return 'En revisión';
                case 'ACCEPTED':
                    return 'Aprobado';
                case 'EXPIRED':
                    return 'Vencido';
                default:
                    return 'Denegado';
            }
        },
        getChipColor(item: Permission) {
            switch (item.status) {
                case 'DENIED':
                    return ['#F5223B', 'white'];
                case 'PENDING':
                    return ['#F5C322', 'white'];
                case 'ACCEPTED':
                    return ['#17A3EB', 'white'];
                case 'EXPIRED':
                    return ['#638C99', 'white'];
                default:
                    return ['#F5223B', 'white'];
            }
        },
    }
});
