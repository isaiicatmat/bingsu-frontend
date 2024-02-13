<template>
  <v-overlay v-model="LOADING"
             z-index="205">
    <v-progress-circular
        indeterminate
        class="mx-auto"
        size="64"
        color="white">
    </v-progress-circular>
  </v-overlay>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "LoadingDialog",
  data: () => {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters([
        'LOADING'
    ]),
  },
}
</script>

<style>
.v-dialog {
  box-shadow: none !important;
}
</style>