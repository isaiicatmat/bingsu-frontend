<template>
<v-card class="d-flex flex-fill mb-2 elevation-0" style="min-height: 80px; border: 1px solid gray">
  <div class="d-flex flex-column justify-start pl-4 py-2 text-truncate"
       style="width: 180px">
    <div class="title" style="letter-spacing: 0 !important;">{{contract.client}}</div>
    <div class="text-caption" style="letter-spacing: 0 !important;">{{getFmtPeriod(contract)}}</div>
  </div>
  <div class="row">
    <contract-payment-item v-for="item in contract.payments"
                           :item="item"
                           :key="item.month">
    </contract-payment-item>
    <contract-payment-actions @onPressedDelete="$emit('onPressedDelete')">
    </contract-payment-actions>
  </div>
</v-card>
</template>

<script>
import ContractPaymentItem from "@/components/Contracts/ContractPaymentItem";
import {getFmtDate} from "@/services/utils";
import ContractPaymentActions from "@/components/Contracts/ContractPaymentActions";

export default {
  name: "ContractRow",
  components: {ContractPaymentActions, ContractPaymentItem},
  props: {
    contract: {
      default: {
        client: "",
        startDate: "",
        endDate: "",
        indeterminate: false,
        payments: []
      },
    },
  },
  methods: {
    getFmtDate,
    getFmtPeriod(item) {
      if (item.indeterminate) {
        return 'Indeterminado'
      } else {
        return `${this.getFmtDate(this.contract.startDate)} / ${this.getFmtDate(this.contract.endDate)}`
      }
    }
  }
}
</script>

<style scoped>

</style>