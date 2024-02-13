<template>
    <v-data-table
     :headers="headers" height="347px"
     fixed-header
     @dblclick:row="openIndividualAttendance"
     :items = "attendances"
     class="mx-8"
     >
        <template v-slot:[`item.date`]="{ item }" >
            <div class="noselect">
                {{ getFormattedDateWithDaysUpperCase(item.date._seconds) }}
            </div>        
        </template>
            
        <template v-slot:[`item.in`]="{ item }">
            <div class="noselect">
                {{item.in ? getTwoDigitsTime(item.in._seconds) : ''}}
                <img v-if="!item.in"  src="../../assets/x_icon.png" style="width:24px; height: 24px">
            </div>
        </template>

        <template v-slot:[`item.out`]="{ item }">
            <div class="noselect">
                {{item.out ? getTwoDigitsTime(item.out._seconds) : ''}}
                <img v-if="actualDay !== new Date(item.date._seconds *1000).toISOString().split('T')[0] && !item.out" 
                    src="../../assets/x_icon.png" style="width:24px; height: 24px">
                <img v-else-if="!item.out" src="../../assets/clock_icon.png" style="width:24px; height: 24px">
            </div>
        </template>
                
        <template v-slot:[`item.summary`]="{ item }">
            <div v-if="actualDay == new Date(item.date._seconds *1000).toISOString().split('T')[0]"
                class="text-truncate noselect" style="max-width: 320px;">
                {{item.summary ? item.summary : 'Pendiente'}}
            </div>
            <div v-else class="text-truncate noselect" style="max-width: 320px;">
                {{item.summary ? item.summary : 'Sin reporte'}}
            </div>
        </template>
    </v-data-table>
</template>

<script>

import DateFormat from "@/mixins/DateFormat";

export default {
    name: "UserAttendanceTable",
    computed: {
        headers() {
                return [
                {text: 'Fecha', aling: 'start', sortable: false, value: 'date',},
                {text: 'Entrada', value: 'in'},
                {text: 'Salida', sortable: false, value: 'out',},
                {text: 'Resumen de actividades', sortable: false, value: 'summary', width: '40%', },
            ];
        },
    actualDay() {
      return new Date().toISOString().split('T')[0]
    }
    },

    props: {
        attendances: {
            default: () => [],
            required: true,
        },
    },
    mixins: [DateFormat],
    methods: {
        openIndividualAttendance(event, {item}) {
            this.$emit('openIndividualAttendance', item.id);
        }
    },
}
</script>
