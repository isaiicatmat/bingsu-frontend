<template>
  <v-data-table :headers="headers"
                @dblclick:row="openUserTransactions"
                :items="transactionsSummary" class="mx-8" height="40.4vh">

    <template v-slot:[`item.amount`]="{ item }">
      {{ getFmtAmount(item.amount) }}
    </template>

  </v-data-table>
</template>

<script>
import {getFmtAmount} from "@/services/utils";

export default {
  name: "TransactionsTable",
  props: {
    transactionsSummary: {
      default: () => [],
      required: true,
    },
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '800px'
        },

        { text: 'Gastos ', value: 'amount' }
      ],
    }
  },
  methods: {
    getFmtAmount,
    openUserTransactions(event, {item}) {
      this.$emit('openUserTransactions', item);
    },
  }
}
</script>

<style scoped>

</style>
