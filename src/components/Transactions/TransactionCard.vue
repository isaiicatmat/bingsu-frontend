<template>
  <h2 class="font-weight-black" style="margin-top: 12px;" > 
    {{ getFmtAmount(totalAmount) }}
  </h2>
</template>

<script>
import {getFmtAmount} from "@/services/utils";

export default {
  name: "AllExpenses",
  props: {
    totalAmount: {
      default: -1,
      type: Number
    }
  },
  methods: {
    getFmtAmount
  }
}
</script>

<style>
#sk_one_line .v-skeleton-loader__text{
  height: 24px !important;
}

#sk_one_line .v-skeleton-loader__bone{
  padding-left: 0;
}

#sk_one_line .v-skeleton-loader__list-item{
  height: 24px;
}
</style>
