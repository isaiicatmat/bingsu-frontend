<template>

  <h2 class="font-weight-black" >
    {{ getFmtAmount(lastMonthTotalAmount) }}
  </h2>

</template>


<script>
import {getFmtAmount} from "@/services/utils";

export default {
  name: "LastMonthExpenses",
  props: {
    lastMonthTotalAmount: {
      default: 0,
      type: Number
    }
  },
  methods: {
    getFmtAmount
  }
}
</script>