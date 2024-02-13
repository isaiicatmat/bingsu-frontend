<template>
  <v-data-table :headers="headers"
                @dblclick:row="openUserExpenses"
                :items="expensesSummary" class="px-8" height="56.4vh"
                style="text-transform: capitalize;">

    <template v-slot:[`item.amount`]="{ item }">
      {{ getFmtAmount(item.amount) }}
    </template>

  </v-data-table>
</template>

<script>
import {getFmtAmount} from "@/services/utils";

export default {
  name: "ExpensesTable",
  props: {
    expensesSummary: {
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
          sortable: true,
          value: 'name',
        },

        { text: 'Gastos ', value: 'amount' }
      ],
    }
  },
  methods: {
    getFmtAmount,
    openUserExpenses(event, {item}) {
      this.$emit('openUserExpenses', item);
    },
  }
}
</script>

<style scoped>

</style>