<template>
  <div class="d-flex flex-column">
    <div :class="$vuetify.breakpoint.xs ? 'row mb-5' : 'row mb-6'">
      <div :class="$vuetify.breakpoint.xs ? 
          'd-flex flex-column white rounded pt-4 pb-7 px-6 mobile-filter' : 
          'd-flex flex-column white px-9 rounded pt-4 pb-7'"
      >
        <p :class="$vuetify.breakpoint.xs ? 'font-weight-black text-lg-h6' : 'font-weight-bold text-lg-h6'">Filtro</p>
        <p class="body-2 mb-0" style="color:#95999a">Día</p>
        <IndividualDatePicker @onChangeDate="handleChangeDate">
        </IndividualDatePicker>
      </div>
    </div>

    <div class="row white rounded-lg">
      <div class="col-12">
        <div :class="$vuetify.breakpoint.xs ? 
          'd-flex align-center justify-space-between px-2 pt-2' : 
          'd-flex align-center justify-space-between px-4 pt-3'"
        >
          <div class="d-flex align-center">
            <img src="../assets/users_in_icon.jpg"
                 style="width: 26px; height: 26px;">
            <p :class="$vuetify.breakpoint.xs ? 'text-lg-h6 font-weight-black mb-0 ml-1' : 'text-lg-h6 font-weight-bold mb-0 ml-1'">Usuarios</p>
          </div>
          <div class="d-flex justify-end">
            <AttendanceReportDialog :users="users"></AttendanceReportDialog>
          </div>
        </div>
        <div>
          <AttendanceUsersTable :attendances="attendances"
                                :users="users"
                                :class="$vuetify.breakpoint.xs ? 'px-2 pt-2' : 'px-8'"
                                @openUserAttendanceRecord="displayUserAttendanceRecord">
          </AttendanceUsersTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MonthPicker from "@/mixins/MonthPicker";
import AttendanceUsersTable from "@/components/Attendance/AttendanceUsersTable.vue";
import authService from "@/services/auth";
import {mapActions, mapMutations} from 'vuex';
import {jsPDF} from 'jspdf';
import DateFormat from "@/mixins/DateFormat";
import IndividualDatePicker from "@/components/Shared/IndividualDatePicker.vue";
import AttendanceReportDialog from "@/components/Attendance/AttendanceReportDialog.vue";
import autoTable from "jspdf-autotable";

export default {
  name: "AdminAttendanceView",
  mixins: [MonthPicker, DateFormat],
  components: {
    AttendanceReportDialog,
    IndividualDatePicker,
    AttendanceUsersTable,
  },
  data: () => {
    return {
      userRole: null,
      attendancePeriod: [],
      authService: authService,
      attendanceRecord: [],
      attendances: [],
      users: [],
      generalAttendanceRecordContent: [], //added to avoid unnecessary requests to DB
      userAttendanceDialog: false,
      user: [],
      isDesktopWidth: window.innerWidth > 1903 && window.innerWidth < 1024,
      tabletWidth: window.innerWidth <= 1024,
    }
  },
  methods: {
    ...mapActions(["GET_ATTENDANCE_RECORD", "GET_USERS"]),
    ...mapMutations(['SET_LOADING', 'SHOW_ERROR_ALERT']),

    displayUserAttendanceRecord(user){
        this.user = user;
        this.userAttendanceDialog = true;
    },

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
             from = (this.attendancePeriod[1] + '');
             to = (this.attendancePeriod[0] + '');
        }else{
             from = (this.attendancePeriod[0] + '');
             to = (this.attendancePeriod[1] + '');
        }

        return `${from.split("-").join("")}_${to.split("-").join("")}`;
     },

     getPDFPeriod(inverted){
        let addOneDayEnd = '', addOneDayStart = '', dateFtmOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        if (inverted) {
            let attendanceStartDate = new Date(this.attendancePeriod[1]);
            let attendanceEndDate = new Date(this.attendancePeriod[0]);
            addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
            addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
        } else {
            let attendanceStartDate = new Date(this.attendancePeriod[0]);
            let attendanceEndDate = new Date(this.attendancePeriod[1]);
            addOneDayStart = new Date(attendanceStartDate.setDate(attendanceStartDate.getDate() + 1));
            addOneDayEnd = new Date(attendanceEndDate.setDate(attendanceEndDate.getDate() + 1));
        }

        return `${addOneDayStart.toLocaleDateString('es-MX', dateFtmOptions)} - ${addOneDayEnd.toLocaleDateString('es-MX', dateFtmOptions)}`;
     },

    getAttendanceReport() {
      try {
        this.SET_LOADING(true);
        let PDFcontent = [];
        const MXDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        let sortedAttendanceMap = new Map();

        this.generalAttendanceRecordContent.forEach(item => {
          if (sortedAttendanceMap.get(item.id)) {
            let oldValue = sortedAttendanceMap.get(item.id);
            oldValue.push(item);
            sortedAttendanceMap.set(item.id, oldValue);
          } else {
            sortedAttendanceMap.set(item.id, [item]);
          }
        });

        let sortedAttendances = [];
        sortedAttendanceMap.forEach((value) => {
          sortedAttendances = sortedAttendances.concat(value);
        });

        sortedAttendances.forEach(row => {
          let AMPM = this.getFormattedTime(row);
          let userFullName = row.name;
          let ftmDateIn = new Date((row.date._seconds) * 1000).toLocaleDateString('es-MX', MXDateOptions);
          let dailyReportContent = row.summary ? row.summary : 'Sin reporte';
          PDFcontent.push([
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
        let period = '', PDFPeriod = '';
        let filterDatesInverted = false;

        //Setting period of time selected to be included in the file - If inverted fix it
        if (new Date(this.attendancePeriod[0]).getTime() > new Date(this.attendancePeriod[1]).getTime()) {
          filterDatesInverted = true;
          period = this.getFormattedPeriod(filterDatesInverted);
          PDFPeriod = this.getPDFPeriod(filterDatesInverted);
        } else {
          period = this.getFormattedPeriod();
          PDFPeriod = this.getPDFPeriod();
        }

        let fileName = `${period}_reporte_general.pdf`;

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
    async getAttendancesByPeriod(period) {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(period[0]);
        const endDate = new Date(period[1]);
        // this.attendancePeriod = attendance;
        this.attendances = await this.getAttendancesByDate(startDate, endDate);

        // const attendanceRecordMap = new Map();
        // const users = this.users;
        // let generalAttendanceRecordAuxiliar = [];
        //
        // //Iterates through users to create the attendance record map
        // users.forEach(user => {
        //   attendanceRecordMap.set(user.id, {
        //     'id': user.id,
        //     'name': `${user.name} ${user.firstLastName} ${user.secondLastName}`,
        //     'entradas': 0,
        //     'salidas': 0,
        //     'date' : new Date(),
        //   });
        // });
        //
        // // iterates through records to assign checkins and checkouts
        // attendances.forEach(attendance => {
        //   const entry = attendanceRecordMap.get(attendance.uid);
        //   attendanceRecordMap.set(attendance.uid, {
        //     'id' : entry.id,
        //     'name': entry.name,
        //     'entradas': attendance.in ? ++entry.entradas : entry.entradas,
        //     'salidas': attendance.out ? ++entry.salidas : entry.salidas,
        //     'date' : entry.date,
        //   });
        //
        //   generalAttendanceRecordAuxiliar.push({
        //     'id' : entry.id,
        //     'name': entry.name,
        //     'in': attendance.in,
        //     'out': attendance.out,
        //     'date' : attendance.date,
        //     'summary' : attendance.summary
        //   });
        // });
        //
        // this.generalAttendanceRecordContent = generalAttendanceRecordAuxiliar;
        //
        // this.attendanceRecord = Array.from(attendanceRecordMap, ([_, value]) => ({
        //       'id': value.id, 'name': value.name, 'entradas': value.entradas, 'salidas': value.salidas, 'date': value.date
        //     })
        // );
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleChangeDate(date) {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      await this.getAttendancesByPeriod([date, this.getShortDate(tomorrow)])
    },
    async getAttendancesByDate(startDate, endDate) {
      let response = [];
      if (startDate.getTime() > endDate.getTime()) {
        response = await this.GET_ATTENDANCE_RECORD({
          startDate: endDate.toISOString().slice(0, 10),
          endDate: startDate.toISOString().slice(0, 10)
        });
      } else {
        response = await this.GET_ATTENDANCE_RECORD({
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10)
        });
      }
      return response;
    }
  },
  async mounted() {
    try {
      this.SET_LOADING(true);
      this.users = await this.GET_USERS();
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      await this.getAttendancesByPeriod([this.getShortDate(today), this.getShortDate(tomorrow)]);
      this.userRole = await authService.getRole();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
      this.SET_LOADING(false);
    }
  }
}
</script>

<style>
.v-skeleton-loader__button {
  width: 136px !important;
  height: 32px !important;
}

.mobile-filter{
  width: 100%;
}
</style>
