<template>
    <v-form ref="attendanceForm" lazy-validation>
            <div class="row row--dense">
                <v-textarea
                 v-model="attendance.summary"
                 :rules="[requiredRule]"
                 label="Resumen"
                 outlined
                 type="text"
                 maxlength="300"
                 counter="300"
                 required
                 dense
                >
                </v-textarea>
            </div>
            <div class="d-flex justify-center">
                <v-btn 
                 class="mr-2"
                 color="#F5223B"
                 depressed
                 @click="$emit('close-dialog')"
                >
                    <div style="color:white">
                        Cerrar
                    </div>
                </v-btn>
                <v-btn 
                 class="ml-2"
                 color="primary"
                 depressed
                 :disabled="!attendance.summary"
                 @click="$emit(`onAddAttendanceOut`, attendance)">Guardar
                </v-btn>
            </div>
    </v-form>
</template>

<script>
import { mapGetters } from 'vuex';
import Rules from "../../mixins/Rules";
export default {
    name: "AttendanceForm",
    mixins: [Rules],
    props: {
        activeDialog: {
            type: Boolean
        },
        update: {
            type: Boolean
        }
    },
    data: () => {
        return {
            attendance: {},
        }
    },
    computed: {
        ...mapGetters(['ATTENDANCE'])
    },
    watch: {
        activeDialog: {
            handler(activeDialogValue) {
                if(activeDialogValue) {
                    if(this.update) {
                        this.attendance = {...this.ATTENDANCE};
                    }
                }  else {
                    this.$refs.attendanceForm.reset();
                }
            },
            immediate: true
        },
    },
}
</script>