<template>
<div class="col d-flex justify-center flex-column pt-2 align-center">
  <div class="text-subtitle-2">{{item.month}}</div>
  <div class="text-caption"
       style="letter-spacing: 0 !important;">
    {{item.status ? 'Pagado' : 'Pendiente'}}</div>
</div>
</template>

<script>
export default {
  name: "ContractPaymentItem",
  props: {
    item: {
      default: {
        month: "",
        status: false,
      }
    }
  }
}
</script>

<style scoped>

</style>