<template>
  <v-card width="400px">
    <v-card-title class="mb-2">
      <div class="text-h5 font-weight-bold" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{title}}</div>
    </v-card-title>
    <v-card-text>
      <div class="text-subtitle-1"
           style="letter-spacing: 0 !important;">{{confirmationText}}</div>
      <div class="d-flex justify-center" style="margin-top: 26px">
        <v-btn class="mr-2"
               color="#F5223B"
               depressed
               @click="$emit('cancel')">
               <div style="color: white">
                  Cancelar
               </div>
        </v-btn>
        <v-btn class="ml-2 white--text"
               color="primary"
               depressed
               @click="$emit('confirm')">
          Confirmar
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmDelete",
  data: () => {
    return {
      active: true,
    }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    confirmationText: {
      type: String,
      default: ""
    },
  },
}
</script>

<style scoped>

</style>
