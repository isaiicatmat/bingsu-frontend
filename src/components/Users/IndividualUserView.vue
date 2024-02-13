<template>
  <div class="row no-gutters">
    
      <div class="pt-6 col-6 d-flex">
        <div class="d-flex">
          <div class="pa-2 rounded mb-3" style="border: 3px solid #ADADAD;">
            <v-img
              v-if="user.avatar"
              class="rounded"
              :src="user.avatar"
              cover
              height="100%"
              width="120"></v-img>
              <v-img
              v-else
              class="rounded"
              src="@/assets/placeholder.svg"
              cover
              height="100%"
              width="120"></v-img>
          </div>
          <div class="d-flex align-end mb-3 ml-4">
            <div>
              <div class="text-h5 font-weight-bold" style="text-transform: capitalize">{{user.name + ' ' + user.firstLastName}}</div>
              <div class="text-h5 font-weight-bold" style="text-transform: capitalize">{{ user.secondLastName}}</div>
              <InformationText :value="user.employeeId"
                           class="col pl-0"
                           label="Número de empleado">
              </InformationText>
              <InformationText :value="user.rfc"
                           class="col pl-0"
                           label="RFC">
              </InformationText>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 ">
        <InformationText :value="user.phoneNumber"
                            class="col pl-0 pt-6"
                            label="Teléfono">
        </InformationText>
        <InformationText :value="user.address"
                           class="col pl-0"
                           label="Dirección">
        </InformationText>
        <InformationText :value="user.socialSecurityNumber"
                           class="col pl-0 pb-5"
                           label="NSS">
        </InformationText>
      </div>
    

    <div class="col-12 row no-gutters mb-4">

      <InformationText :value="user.email"
                           class="col"
                           label="email">
      </InformationText>
      <InformationText :value="user.curp"
                           class="col"
                           label="CURP">
      </InformationText>
    </div>

    <div class="col-12 row no-gutters mb-4">
      <InformationText :value="user.emergencyNumberOne"
                           class="col"
                           label="Número de emergencia 1">
      </InformationText>
      <InformationText :value="user.emergencyNumberTwo"
                           class="col"
                           label="Número de emergencia 2">
      </InformationText>
    </div>

    <div class="col-12 row no-gutters mb-4">
      <InformationText :value="getFmtDate(user.hiringDate)"
                           class="col"
                           label="Fecha de contratación">
      </InformationText>
      <InformationText  :value="getFmtDate(user.birthday)"
                            class="col"
                            label="Fecha de nacimiento">
      </InformationText>
    </div>

    <div class="col-12 row no-gutters mb-4">


      <InformationText :value="user.vacationDays ? user.vacationDays.toString() : '0'"
                       class="col"
                       label="Días de vacaciones">
      </InformationText>

    </div>
    

    <div class="col-12">
      <div class="d-flex justify-space-between">
        <v-btn
            small
            style="height: 32px"
            outlined
            @click="getFileToDownload(user.ine)"
            color="primary"
            class="white--text">
          INE
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>

        <v-btn
            small
            style="height: 32px"
            outlined
            @click="getFileToDownload(user.bachelorCertificate)"
            color="primary"
            class="white--text"
        >
          Título
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>

        <v-btn
            small
            style="height: 32px"
            @click="getFileToDownload(user.birthCertificate)"
            outlined
            color="primary"
            class="white--text"
        >
          Acta de nacimiento
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>

        <v-btn
            small
            outlined
            style="height: 32px"
            color="primary"
            @click="getFileToDownload(user.addressCertificate)"
            class="white--text">
          Comprobante domicilio
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>

      </div>
    </div>
  </div>
</template>

<script>
import {getFmtAmount, getFmtDate} from "@/services/utils";
import InformationText from "@/components/InformationText";
import File from "@/mixins/File";

export default {
  name: "IndividualUserView",
  components: {InformationText},
  props: {
    user: {}
  },
  mixins: [File],
  methods: {
    getFmtAmount,
    getFmtDate,
  },
  vacationPeriod() {
    let lastVacationDate = new Date(new Date(this.user.hiringDate._seconds * 1000).setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 10);
    let currentVacationDate = new Date(new Date(this.user.hiringDate._seconds * 1000).setFullYear(new Date().getFullYear())).toISOString().slice(0, 10);
    let nextVacationDate = new Date(new Date(this.user.hiringDate._seconds * 1000).setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
    return {lastVacationDate, currentVacationDate, nextVacationDate};
  },
}
</script>

<style scoped>

</style>
