<template>
  <div class="grey lighten-3 mt-3"
       :style="!$vuetify.breakpoint.xsOnly ? 'height: 808px' : ''">
      <v-row style='margin: 0px 18px'>
        <v-col
            class="white mb-6 mr-6 rounded-lg"
            style="min-height: 18vh; max-width: 342px; max-height: 250px;"
        >
          <div class="mx-6 mt-2">
            <p class="text-lg-h6 font-weight-bold">Filtro</p>
            <div>
              <p class="body-2 mb-0" style="color:#95999a">Periodo</p>
              <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  max-width="320px"
                  min-width="auto"
                  offset-y
                  transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="dateRangeText"
                      dense
                      hide-details
                      outlined
                      required
                      v-bind="attrs"
                      v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                    v-model="period"
                    :allowed-dates="allowedDates"
                    no-title
                    range
                >
                  <v-col class="text-right">
                    <v-btn
                        :disabled="!filterButtonActive"
                        color="primary"
                        @click="filterDates"
                    >
                      Filtrar
                    </v-btn>
                  </v-col>
                </v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-col>
      </v-row>
        <div
          class="row white mb-4 rounded-lg"
          style='margin: 0 20px 0 18px'>
          <div class="col-12">
          <div>
            <div v-if="userRole === 'user'"
                class="d-flex justify-start mx-5 mt-2">

              <div v-if="!mobileBrowser">
                <v-btn color="primary mr-3"
                      depressed
                      @click="addAttendancesDialog = true">
                  Viaje de trabajo
                </v-btn>
              </div>
              <div v-if="attendanceLoaded && !mobileBrowser">
                <v-btn v-if="!currentAttendance.in && todayHour < 10"
                      :disabled="(dayWeek === 0) || (dayWeek === 6)"
                      class="pl-3"
                      color="primary"
                      depressed
                      @click="addAttendanceIn"
                >
                  Entrada
                </v-btn>

                <v-btn v-else-if="!currentAttendance.out"
                      :disabled="(dayWeek === 0) || (dayWeek === 6)"
                      class="px-6"
                      color="primary"
                      depressed
                      v-on:click="addAttendanceOutDialog = true"
                >
                  Salida
                </v-btn>

                <v-btn v-else
                      class="px-6"
                      depressed
                      disabled
                      style="background-color: #96D8A4 !important"
                >
                  {{ messageAttendanceOut }}
                </v-btn>
              </div>
              <v-sheet v-if="!noAttendances">
                  <v-skeleton-loader type="button" class="attendanceButton"></v-skeleton-loader>
                </v-sheet>
              <v-dialog
                  v-model="addAttendanceOutDialog"
                  transition="dialog-bottom-transition"
                  width="600">
                <template v-slot:default="dialog">
                  <v-card width="600px">
                    <v-card-title class="mb-2">
                      <div class="text-h5 font-weight-bold">Reporte del día</div>
                    </v-card-title>
                    <v-card-text>
                      <attendance-form
                          :active-dialog="dialog.value"
                          @onAddAttendanceOut="addAttendanceOut"
                          @close-dialog="dialog.value = false">
                      </attendance-form>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>

              <v-dialog  v-model="addAttendancesDialog"
                        transition="dialog-bottom-transition"
                        width="600">
                <v-card width="600px">
                  <v-card-title class="mb-2">
                    <div class="text-h5 font-weight-bold">Viaje de trabajo</div>
                  </v-card-title>
                  <v-card-text>
                    <attendances-form @onSubmitAttendances="handleSubmitAttendances"
                                      @close-dialog="addAttendancesDialog = false"
                                      :onDisplay="addAttendancesDialog">
                    </attendances-form>
                  </v-card-text>
                  </v-card>
              </v-dialog>
            </div>
            <UserAttendanceTable
                :attendances="userAttendances"
                @openIndividualAttendance="openIndividualAttendance"
                v-if="noAttendances"
            >
            </UserAttendanceTable>
            <v-sheet v-else>
              <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">

                <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '6%', 'margin-right': '22%', 'margin-left': '1%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '6%', 'margin-right': '10%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '6%', 'margin-right': '10%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" style="max-width: 14%"></div>
                </div>

                <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 28.4vh">
                  <div v-for="i in 2" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                    <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                    <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" style="width: 100%; height: 46.5px">
                      <div v-for="i in 4" :key="i" class="v-skeleton-loader__table-cell v-skeleton-loader__bone"
                                  :style="{
                                  'width': skeletonStyle('width', i),
                                  'margin-right': skeletonStyle('mr', i)}"
                      >
                        <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <v-skeleton-loader type="table-tfoot" class="mr-6"></v-skeleton-loader>
            </v-sheet>
          </div>
        </div>


        <v-dialog
            v-model="individualAttendanceDialog"
            transition="dialog-bottom-transition"
            width="600"
            height="340">
          <template v-slot:default="">
            <v-card width="600px" height="340">
              <v-card-title class="mb-4 pb-4">
                <div class="text-h5 font-weight-bold">{{ getFormattedDate(ATTENDANCE.date._seconds) }}</div>
              </v-card-title>
              <v-card-text>
                <IndividualAttendanceView :attendance="ATTENDANCE"></IndividualAttendanceView>
              </v-card-text>
              <div class="d-flex white justify-center pb-5">
                <v-btn color="#F5223B"
                      @click="individualAttendanceDialog = false">
                  <div style="color:white"> Cerrar</div>
                </v-btn>
              </div>
            </v-card>
          </template>

        </v-dialog>
        </div>

  </div>

</template>

<script>
import AttendanceForm from '@/components/Attendance/AttendanceForm.vue';
import {mapMutations, mapActions, mapGetters} from "vuex";
import UserAttendanceTable from "@/components/Attendance/UserAttendanceTable.vue";
import IndividualAttendanceView from "@/components/Attendance/IndividualAttendanceView.vue"
import MonthPicker from "@/mixins/MonthPicker";
import DateFormat from "@/mixins/DateFormat";
import authService from "@/services/auth";
import Vue from "vue";
import {jsPDF} from 'jspdf';
import autoTable from "jspdf-autotable";
import AttendancesForm from "@/components/Attendance/AttendancesForm";

export default Vue.extend({
  name: "UserAttendanceView",
  components: {
    AttendancesForm,
    UserAttendanceTable, AttendanceForm, IndividualAttendanceView
  },
  data: () => {
    return {
      userAttendances: [],
      attendance: {},
      individualAttendanceDialog: false,
      filterButtonActive: false,
      disableReportButton: false,
      period: [new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      authService,
      userRole: null,
      addAttendanceOutDialog: false,
      addAttendancesDialog: false,
      noAttendances: false,
      isDesktopWidth: window.innerWidth > 1903,
      currentAttendance: {
        in: null,
        out: null,
      },
      attendanceLoaded: false,
    }
  },
  computed: {
    ...mapGetters(['ATTENDANCE']),
    dateRangeText: {
      get() {
        this.enableDisableFilterButton();
        return this.period.join(' / ');
      },
    },
    mobileBrowser() {
      let hasTouchScreen = false;
      if ('ontouchstart' in window) {
        hasTouchScreen = true;
      } else {
        const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
          hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
          hasTouchScreen = true; // deprecated, but good fallback
        } else {
          // Only as a last resort, fall back to user agent sniffing
          const UA = navigator.userAgent;
          hasTouchScreen = (
              /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
              /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
          );
        }
      }

      return hasTouchScreen;
    },
    actualDay() {
      return +new Date().toLocaleDateString('es-MX', {day: 'numeric'})
    },
    todayHour() {
      return +new Date().getHours()
    },
    dayWeek() {
      return +new Date(new Date()).getDay()
    },
    messageAttendanceOut() {
      let phrasesAttendanceOut = [
        'Excelente trabajo', '¡Bien hecho!', '¡Mira esas habilidades!',
        '¡Vaya, eres muy hábil', 'Sigue así', 'No sé qué haríamos sin ti', 'Increíble trabajo',
        'Un trabajo estupendo', '¡Increíble!', 'Cada vez lo haces mejor'
      ];
      return phrasesAttendanceOut[Math.floor(Math.random() * phrasesAttendanceOut.length)]
    },
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    userName: {
      type: String,
      default: null
    },
    attendancePeriod: {
      type: Array,
      default: () => [new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
    },
    getFormattedTime: {
      type: Function,
    }
  },
  mixins: [MonthPicker, DateFormat],
  methods: {
    ...mapActions([
      'GET_ATTENDANCE_RECORD',
      'GET_USERS',
      'SAVE_ATTENDANCE',
      'GET_ATTENDANCES',
      'GET_ATTENDANCE',
      'UPDATE_ATTENDANCE',
      'SAVE_ATTENDANCES'
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT',
      'SET_ATTENDANCE'
    ]),
    async handleSubmitAttendances(values) {
      try {
        this.SET_LOADING(true);
        let attendances = [];
        for (let i = 0; i < values.workDays.length; i++) {
          let inDate = new Date(values.workDays[i].getTime());
          inDate.setUTCHours(14, 0, 0, 0);
          let outDate = new Date(values.workDays[i].getTime());
          outDate.setUTCHours(23, 0, 0, 0);
          attendances.push(
              {
                in: inDate,
                out: outDate,
                date: values.workDays[i],
                summary: values.summary,
              }
          );
        }
        await this.SAVE_ATTENDANCES(attendances);
        this.addAttendancesDialog = false;
        await this.filterDates();
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    enableDisableFilterButton() {
      this.filterButtonActive = this.period.length === 2;
    },
    async openIndividualAttendance(attendanceId) {
      try {
        this.SET_LOADING(true);
        const clickedAttendance = await this.GET_ATTENDANCE(attendanceId);
        this.SET_ATTENDANCE(clickedAttendance);
        this.individualAttendanceDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async filterDates() {
      try {
        this.SET_LOADING(true);
        this.menu = false;
        let startDate = '';
        let endDate = '';

        if (new Date(this.period[0]).getTime() > new Date(this.period[1]).getTime()) {
          startDate = this.period[1];
          endDate = this.period[0];
        } else {
          startDate = this.period[0];
          endDate = this.period[1];
        }
        let validUserId = this.userId ? this.userId : authService.user.uid;
        this.userAttendances = await this.GET_ATTENDANCE_RECORD({userId: validUserId, startDate, endDate});
        this.disableReportButton = this.userAttendances.length <= 0;
        this.noAttendances = true;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    skeletonStyle(type, idx){
      let widthAndMarginRigth = '';
      switch(idx){
        case 1:
          type === 'width' ? widthAndMarginRigth = '8%' : widthAndMarginRigth = '20.2%';
          break;
        case 2:
          type === 'width' ? widthAndMarginRigth = '7%' : widthAndMarginRigth = '9.6%';
          break;
        case 3:
          type === 'width' ? widthAndMarginRigth = '7%' : widthAndMarginRigth = '9.6%';
          break;
        case 4:
          type === 'width' ? widthAndMarginRigth = '20%'  : '';
          break;
      }
      return widthAndMarginRigth;
    },
    async addAttendanceIn(attendance) {
      try {
        this.SET_LOADING(true);
        attendance.uid = this.userId;
        await this.SAVE_ATTENDANCE({
          in: new Date().toString(),
          out: "",
          summary: "",
          date: "",
          id: "",
          uid: ""
        });
        await this.getAttendance();
        await this.filterDates();
        this.SHOW_SUCCESS_ALERT("¡Gracias por registrar su asistencia!");
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async addAttendanceOut(attendance) {
      try {
        this.SET_LOADING(true);
        if (this.currentAttendance.in) {
          await this.UPDATE_ATTENDANCE({
            ...attendance,
            id: this.currentAttendance.id,
            uid: this.currentAttendance.uid,
          });
          this.addAttendanceOutDialog = false;
        } else {
          await this.SAVE_ATTENDANCE({
            in: "",
            out: new Date().toString(),
            summary: attendance.summary,
            date: "",
            id: "",
            uid: ""
          });
          this.addAttendanceOutDialog = false;
        }
        await this.getAttendance();
        await this.filterDates();
        this.SHOW_SUCCESS_ALERT("¡Gracias por enviar su resumen!");
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getAttendance() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString().slice(0, 10);
        const getAttendanceResponse = await this.GET_ATTENDANCES({userId: authService.user.uid, startDate, endDate});
        if (getAttendanceResponse.length > 0) {
          this.currentAttendance = getAttendanceResponse[0];
        }
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },

    getFormattedPeriod(inverted) {
      let from = '', to = '';
      if (inverted) {
        from = (this.period[1] + '');
        to = (this.period[0] + '');
      } else {
        from = (this.period[0] + '');
        to = (this.period[1] + '');
      }

      return `${from.split("-").join("")}_${to.split("-").join("")}`;
    },

    getPDFPeriod(inverted) {
      let addOneDayEnd = '', addOneDayStart = '', dateFtmOptions = {year: 'numeric', month: 'long', day: 'numeric'};
      if (inverted) {
        let attendanceStartDate = new Date(this.period[1]);
        let attendanceEndDate = new Date(this.period[0]);
        addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
        addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
      } else {
        let attendanceStartDate = new Date(this.period[0]);
        let attendanceEndDate = new Date(this.period[1]);
        addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
        addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
      }

      return `${addOneDayStart.toLocaleDateString('es-MX', dateFtmOptions)} - ${addOneDayEnd.toLocaleDateString('es-MX', dateFtmOptions)}`;
    },

    userAttendancesReport() {
      try {
        let PDFcontent = [];
        let userAttendances = this.userAttendances;
        const MXDateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        let userFullName = this.userName;
        userAttendances.forEach(row => {
          let AMPM = this.getFormattedTime(row);
          let ftmDateIn = new Date((row.date._seconds) * 1000).toLocaleDateString('es-MX', MXDateOptions);
          let dailyReportContent = row.summary ? row.summary : 'Sin reporte';

          PDFcontent.push([
            ftmDateIn,
            userFullName,
            AMPM[0],
            AMPM[1],
            dailyReportContent,
          ])
        });

        const doc = new jsPDF('l');
        const head = [['Fecha', 'Nombre(s) y apellido(s)', 'Hora de entrada', 'Hora de salida', 'Reporte']];
        let period = '', PDFPeriod = '';
        let userName = `Empleado: ${PDFcontent[0][1]}`
        let filterDatesInverted = false;

        if (new Date(this.period[0]).getTime() > new Date(this.period[1]).getTime()) {
          filterDatesInverted = true;
          period = this.getFormattedPeriod(filterDatesInverted);
          PDFPeriod = this.getPDFPeriod(filterDatesInverted);
        } else {
          period = this.getFormattedPeriod();
          PDFPeriod = this.getPDFPeriod();
        }
        let fileName = `${period}_reporte_general.pdf`;
        doc.autoTable({
          margin: {top: 30, bottom: 28},
          styles: {
            halign: 'center',
          },
          columnStyles: {
            4: {cellWidth: 124}
          },

          headStyles: {fillColor: [123, 148, 158]},
          alternateRowStyles: {fillColor: [245, 218, 132]},
          tableLineColor: [123, 148, 158],
          tableLineWidth: 0.1,
          head: head,
          body: PDFcontent,
          didDrawPage: function (data) {
            //Changed image on firebase to a higher resolution one
            doc.addImage({
              imageData: 'https://storage.googleapis.com/bingsu-backend.appspot.com/logo_pieHQ.jpg',
              format: 'JPEG',
              x: 14,
              y: 2,
              width: 40,
              height: 20
            });
            doc.setFontSize(20);
            doc.setTextColor(0);
            doc.text(`REPORTE DE ASISTENCIA`, data.settings.margin.left = 152, 16, {
              align: 'center',
              lineHeightFactor: 1,
              maxWidth: 165
            });
            doc.setFontSize(10);
            doc.text(`${PDFPeriod}`, data.settings.margin.left = 152, 20, {
              align: 'center',
            });
            doc.text(userName, data.settings.margin.left = 14, 27);
            let disclaimer = "\nEl personal se obliga a guardar la información relacionada sobre los diversos gastos antes suscritos, puesto que una de las obligaciones que tiene es la citada en la Ley Federal del Trabajo, en su artículo 134, fracción XIII; el cual menciona: “Guardar escrupulosamente los secretos técnicos (…) así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa”. Y sus correlativos en otras Leyes en cuanto a protección de datos. Cualquier divulgación de estos traerá como consecuencia las penas señaladas en el Código Penal Federal en su artículo 210 y/o sus correlativos en el Código Penal para el Estado de Nuevo León.";

            doc.setFontSize(8);
            let pageSize = doc.internal.pageSize;
            let pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
            doc.text(disclaimer, data.settings.margin.left = 14, pageHeight - 16, {
              align: 'justify',
              lineHeightFactor: 1,
              maxWidth: 264
            });
          },
        });

        doc.save(fileName);

      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      }

    }
  },
  async mounted() {
    try {
        this.SET_LOADING(true);
        this.userRole = await authService.getRole();
        if (this.attendancePeriod) {
            this.period = this.attendancePeriod;
        }
        await this.getAttendance();
        await this.filterDates();
        this.attendanceLoaded = true;

    } catch(e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
        this.SET_LOADING(false);
    }

  },
});
</script>

<style>
.attendanceButton .v-skeleton-loader__button  {
  width: 86px !important;
}
</style>
