<template>
  <v-snackbar
      :timeout="3000"
      v-model="show"
      absolute
      :color = TYPE
      right
      top
      style='z-index:1000;'
  >
    {{MESSAGE}}
    <template v-slot:action="{ attrs }">
      <v-btn
          icon
          color="white"
          text
          v-bind="attrs"
          @click="show = false"
      >
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "AlertSheet",
  data: () => {
    return {
      showAlert: true,
    }
  },
  computed: {
    ...mapGetters([
        'SHOW',
        'MESSAGE',
        'TYPE'
    ]),
    show: {
      set(value) {
        if (!value) {
          this.CLOSE_ALERT();
        }
      },
      get() {
        return this.SHOW;
      }
    }
  },
  methods: {
    ...mapMutations(['SHOW_ALERT', 'CLOSE_ALERT'])
  }
}
</script>

<style scoped>

</style>