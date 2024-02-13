<template>
  <v-data-table :headers="headers" :items="payments" class="mx-8" :height="heightSevenTwenty ? '20vh' : widthThirteenSixtySix ? '26vh' : heightNineHundred ?  '34vh' : '38vh'">
    <template v-slot:[`item.date`]="{ item }">
      {{ getFmtDate(item.date) }}
    </template>

    <template v-slot:[`item.amount`]="{ item }">
      {{ getFmtAmount(item.amount) }}
    </template>

    <template v-slot:[`item.actions`]="{item}">
      <v-btn icon
             v-if="userRole === 'admin'"
             @click="$emit('openUpdatePayment', item.id)">
        <EditIcon></EditIcon>
      </v-btn>

      <v-btn icon
             v-if="userRole === 'admin'"
             @click="$emit('openDeletePayment', item.id)">
        <DeleteIcon></DeleteIcon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import Permission from '../../mixins/Permissions';
import DeleteIcon from "@/components/Table/DeleteIcon";
import {getFmtAmount, getFmtDate} from "@/services/utils";
import EditIcon from "@/components/Table/EditIcon";
import authService from "@/services/auth";

export default {
  name: "PaymentTable",
  components: {EditIcon, DeleteIcon},
  mixins: [Permission],
  props: {
    payments: {
      default: () => []
    },
  },
  data: () => {
    return {
      headers: [
        { text: 'Monto', value: 'amount', sortable: false },
        { text: 'Fecha', value: 'date', align: 'left'},
        { text: 'Acciones', value: 'actions', align: 'left', sortable: false },
      ],
      userRole: null,
      heightSevenTwenty: window.innerHeight <= 720,
      widthThirteenSixtySix: window.innerWidth <= 1366,
      heightNineHundred: window.innerHeight <= 900 && window.innerHeight > 720,
    }
  },
  methods: {
    getFmtAmount,
    getFmtDate
  },
  async mounted() {
    this.userRole = await authService.getRole();

  }
}
</script>

<style scoped>

</style>
