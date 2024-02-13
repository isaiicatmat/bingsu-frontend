<template>
    <div class="row no-gutters mb-4">
        <div class="col-12 row no-gutters mb-8">
            <InformationText
             :value="attendance.in ?
             getTwoDigitsTime(attendance.in._seconds) : 'Sin marcar' "
             class="col"
             label="Entrada">
            </InformationText>
            
            <InformationText
             v-if="actualDay == dateAttendance"
             :value="attendance.out ?
             getTwoDigitsTime(attendance.out._seconds) : 'Pendiente' "
             class="col"
             label="Salida">
            </InformationText>
            <InformationText
             v-else
             :value="attendance.out ?
             getTwoDigitsTime(attendance.out._seconds) : 'Sin marcar' "
             class="col"
             label="Salida">
            </InformationText>
        </div>

        <div v-if="actualDay == dateAttendance" class="col-12 row no-gutters" style="min-height: 8vh; ">
            <InformationText
             :value="attendance.summary ? attendance.summary : 'Pendiente'"
             class="col"
             label="Resumen">
            </InformationText>
        </div>
        <div v-else class="col-12 row no-gutters" style="min-height: 8vh; ">
            <InformationText
             :value="attendance.summary ? attendance.summary : 'Sin reporte'"
             class="col"
             label="Resumen">
            </InformationText>
        </div>
    </div>
</template>

<script>
import InformationText from "@/components/InformationText";
import DateFormat from "@/mixins/DateFormat"
export default {
    name: "IndividualAttendanceView",
    components: {InformationText},
    mixins: [DateFormat],
    props: {
        attendance: {
            type: Object
        }
    },
    computed: {
    actualDay() {
        return new Date().toISOString().split('T')[0]
    },
    dateAttendance() {
        return new Date(this.attendance.date._seconds *1000).toISOString().split('T')[0]
    },
    }
}
</script>
