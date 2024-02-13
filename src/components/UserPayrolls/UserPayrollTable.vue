<template>
  <v-data-table :headers="headers"
                :items="payrolls"
                fixed-header
                height="347px"
                class="mx-8">
    <template v-slot:[`item.concept`]="{ item }" >
      {{ item.concept }}
    </template>
    <template v-slot:[`item.date`]="{ item }">
      {{ getFmtDate(item.date) }}
    </template>
    <template v-slot:[`item.actions`]="{item}">
      <v-btn icon
        @click="$emit('downloadPayrollFile', {uid: item.uid, id: item.id})">
        <DownloadIcon></DownloadIcon>
      </v-btn>
      <v-btn icon
        @click="$emit('openDeletePayroll',item.id)">
        <DeleteIcon></DeleteIcon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {getFmtDate} from '@/services/utils';
import DownloadIcon from "@/components/Table/DownloadIcon.vue";
import DeleteIcon from "@/components/Table/DeleteIcon";

export default {
  name: "UserPayrollTable",
  components: {
    DeleteIcon, DownloadIcon,
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Concepto',
          align: 'start',
          sortable: false,
          value: 'concept',
        },
        { text: 'Fecha', sortable: true, value: 'date' },
        { text: 'Acciones', value: 'actions', align: 'center', sortable: false,},
      ]
    }
  },
  props: {
    payrolls: {
      default: () => [],
      required: true,
    },
  },
  methods: {
    getFmtDate,

  }
}
</script>
