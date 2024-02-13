<template>
  <div style="min-width: 100px">
    <div class="d-flex justify-center align-center" style="height: 100%">
<!--      <v-btn icon>-->
<!--        <v-icon>mdi-pencil</v-icon>-->
<!--      </v-btn>-->

      <v-btn icon @click="$emit('onPressedDelete')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContractPaymentActions"
}
</script>

<style scoped>

</style>