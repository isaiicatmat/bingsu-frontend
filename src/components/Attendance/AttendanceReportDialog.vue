<template>
  <v-dialog
      v-model="dialog"
      width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="white--text ma-2"
          style="height: 32px"
          color="primary"
          outlined
          small
          v-bind="attrs"
          v-on="on"
      >
        Reporte general
        <v-icon dark right>
          mdi-cloud-download
        </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <div :class="$vuetify.breakpoint.xsOnly ? 'text-h6 font-weight-bold' : 'text-h5 font-weight-bold'">Reporte de asistencias</div>
      </v-card-title>

      <v-card-text class="d-flex justify-center flex-column align-center">
        <div class="d-flex justify-start mb-2" style="width: 100%">
          <div>Selecciona un rango de fechas</div>
        </div>
        <PeriodDatePicker :dates.sync="dates" class="mb-4"></PeriodDatePicker>
        <v-btn
            color="primary"
            @click="getAttendanceReport"
            dark
        >
          Descargar
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import PeriodDatePicker from "@/components/Shared/PeriodDatePicker.vue";
import {jsPDF} from 'jspdf';
import {mapActions, mapMutations} from "vuex";


export default {
  name: "AttendanceReportDialog",
  components: {PeriodDatePicker},
  props: {
    users: {
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      dialog: false,
      dates: [new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
    }
  },
  methods: {
    ...mapActions(["GET_ATTENDANCE_RECORD"]),
    ...mapMutations(["SET_LOADING", "SHOW_ERROR_ALERT"]),
    getFormattedTime(row){
      let formattedTime = [];
      const timeOptions = {hour: '2-digit', minute: '2-digit', hour12: true}
      row.in ? formattedTime[0] = new Date((row.in._seconds) * 1000).toLocaleTimeString('es-MX', timeOptions) : formattedTime[0] = 'Sin marcar';
      row.out ? formattedTime[1] = new Date((row.out._seconds) * 1000).toLocaleTimeString('es-MX', timeOptions) : formattedTime[1] = 'Sin marcar';
      return formattedTime;
    },
    getFormattedPeriod(inverted){
      let from = '', to = '';
      if(inverted){
        from = this.dates[1];
        to = this.dates[0];
      }else{
        from = this.dates[0];
        to = this.dates[1];
      }

      return `${from.split("-").join("")}_${to.split("-").join("")}`;
    },
    getPDFPeriod(inverted){
      let addOneDayEnd = '', addOneDayStart = '', dateFtmOptions = {year: 'numeric', month: 'long', day: 'numeric'};
      if (inverted) {
        let attendanceStartDate = new Date(this.dates[1]);
        let attendanceEndDate = new Date(this.dates[0]);
        addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
        addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
      } else {
        let attendanceStartDate = new Date(this.dates[0]);
        let attendanceEndDate = new Date(this.dates[1]);
        addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
        addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
      }

      return `${addOneDayStart.toLocaleDateString('es-MX', dateFtmOptions)} - ${addOneDayEnd.toLocaleDateString('es-MX', dateFtmOptions)}`;
    },
    async getAttendanceReport() {
      try {
        this.SET_LOADING(true);
        const usersMap = new Map();
        this.users.forEach((user) => {
          usersMap.set(user.id, user);
        });

        let attendances = await this.GET_ATTENDANCE_RECORD({
          startDate: new Date(this.dates[0]).toISOString().slice(0, 10),
          endDate: new Date(this.dates[1]).toISOString().slice(0, 10)
        });

        attendances.sort(function(a, b) {
          return a.uid - b.uid
        });

        let pdfContent = [];
        const MXDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        attendances.forEach(attendance => {
          let AMPM = this.getFormattedTime(attendance);
          let userFullName = usersMap.get(attendance.uid).name;
          let ftmDateIn = new Date((attendance.date._seconds) * 1000).toLocaleDateString('es-MX', MXDateOptions);
          let dailyReportContent = attendance.summary ? attendance.summary : 'Sin reporte';
          pdfContent.push([
            ftmDateIn,
            userFullName,
            AMPM[0],
            AMPM[1],
            dailyReportContent
          ]);
        });

        //Creating the PDF file
        const doc = new jsPDF('l');
        const head = [['Fecha', 'Nombre(s) y apellido(s)', 'Hora de entrada', 'Hora de salida', 'Reporte']];
        let fileNamePeriod = '', PDFPeriod = '';
        let filterDatesInverted = false;

        //Setting period of time selected to be included in the file - If inverted fix it
        if (new Date(this.dates[0]).getTime() > new Date(this.dates[1]).getTime()) {
          filterDatesInverted = true;
          fileNamePeriod = this.getFormattedPeriod(filterDatesInverted);
          PDFPeriod = this.getPDFPeriod(filterDatesInverted);
        } else {
          fileNamePeriod = this.getFormattedPeriod();
          PDFPeriod = this.getPDFPeriod();
        }

        let fileName = `${fileNamePeriod}_reporte_general.pdf`;

        doc.autoTable({
          margin: {top: 28, bottom: 28},
          styles: {
            halign: 'center',
          },
          columnStyles:{
            4: {cellWidth: 124}
          },

          headStyles: {fillColor: [123, 148, 158]},
          alternateRowStyles: {fillColor: [245, 218, 132]},
          tableLineColor: [123, 148, 158],
          tableLineWidth: 0.1,
          head: head,
          body: pdfContent,
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
      } finally {
        this.SET_LOADING(false);
      }
    },
  }
}
</script>

<style scoped>

</style>
