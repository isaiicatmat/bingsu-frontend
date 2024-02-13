<template>
  <v-data-table :headers="headers" :height="heightSevenTwenty ? '20vh' : widthThirteenSixtySix ? '26vh' : heightNineHundred ? '34vh' : '38vh'"
                fixed-header
                @dblclick:row="openIndividualTransaction"
                :items="transactions" class="mx-8">
    <template v-slot:[`item.date`]="{ item }">
      {{ getFmtDate(item.date) }}
    </template>
    <template v-slot:[`item.amount`]="{ item }">
      {{ getFmtAmount(item.amount) }}
    </template>
    <template v-slot:[`item.actions`]="{item}">
      <v-btn icon
            v-if="item.status !== 'ACCEPTED'"
            @click="$emit('openUpdateTransaction', item.id)">
        <img src="../../assets/edit_icon.svg" style="width:24px; height: 24px">
      </v-btn>
      <v-btn v-else icon disabled >
          <img src="../../assets/edit_icon_grey.svg" alt="edit icon grey" style="width:22px; height: 22px">
      </v-btn>

      <v-btn icon @click="$emit('openDeleteTransaction', item.id)">
        <img src="../../assets/delete_icon.svg" style="width:22px; height: 22px">
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {getFmtDate, getFmtAmount} from '@/services/utils'

export default {
  name: "UserTransactionTable",
  data: () => {
    return {
      headers: [
        {
          text: 'Concepto',
          align: 'start',
          sortable: false,
          value: 'concept',
        },
        { text: 'Categoría', value: 'category' },
        { text: 'Fecha', sortable: false, value: 'date' },
        { text: 'Monto', value: 'amount' },
        { text: 'Acciones', value: 'actions', align: 'center', sortable: false,}
      ],
      widthThirteenSixtySix: window.innerWidth <= 1366,
      heightSevenTwenty: window.innerHeight <= 720,
      heightNineHundred: window.innerHeight <= 900 && window.innerHeight > 720,
    }
  },
  props: {
    transactions: {
      default: () => [],
      required: true,
    }
  },
  methods: {
    getFmtDate,
    getFmtAmount,
    openIndividualTransaction(event, {item}) {
      this.$emit('openIndividualTransaction', item.id);
    },
  }
}
</script>

<style scoped>

</style>
