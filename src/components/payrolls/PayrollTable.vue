<template>
  <v-data-table :headers="headers"
                :items="selectedUserPayrolls"
                fixed-header
                height="56.4vh"
                class="mx-8 payroll-table">
    <template v-slot:[`item.name`]="{ item }">
      <div class="noselect">
        {{item.name}}
      </div>
    </template>
    <template v-slot:[`item.concept`]="{ item }">
      <div v-for="payroll in item.payrolls"
           :key="payroll.value"
           class="noselect py-2">
        {{ payroll.concept }}
      </div>
    </template>
    <template v-slot:[`item.date`]="{ item }">
      <div v-for="payroll in item.payrolls"
           :key="payroll.value"
           class="noselect py-2">
        {{ getFmtDate(payroll.date) }}
      </div>
    </template>
    <template v-slot:[`item.actions`]="{item}">
      <tr v-for="payroll in item.payrolls"
          :key="payroll.value"
          class="d-flex justify-center">
        <v-btn icon
          @click="$emit('downloadPayrollFile', {uid: payroll.uid, id: payroll.id})">
          <DownloadIcon></DownloadIcon>
        </v-btn>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import {getFmtDate} from '@/services/utils';
import DownloadIcon from "@/components/Table/DownloadIcon.vue";
export default {
  name: "PayrollTable",
  components: {
    DownloadIcon,
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Concepto', sortable: false, value: 'concept' },
        { text: 'Fecha', sortable: false, value: 'date' },
        { text: 'Acciones', value: 'actions', align: 'center', sortable: false,},
      ],
    }
  },
  props: {
    selectedUserPayrolls: {
      default: () => [],
      required: true,
    },
  },
  methods: {
    getFmtDate,
  }
}
</script>
<style>
.payroll-table tbody > tr:nth-child(even){
    background-color: #F1F4F4;
}
</style>