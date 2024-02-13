<template>
  <div :style="$vuetify.breakpoint.xs ? '' :  {'width': '270px'}">
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            v-model="date"
            readonly
            dense
            hide-details
            outlined
            v-bind="attrs"
            v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
          v-model="date"
          :allowed-dates="allowedDates"
          @input="menu = false"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "IndividualDatePicker",
  data() {
    return {
      menu: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }
  },
  watch: {
    date(newDateValue) {
      this.$emit('onChangeDate', newDateValue);
    }
  },
  methods: {
    allowedDates(val) {
      return new Date(val) < new Date();
    },
  }
}
</script>

<style scoped>

</style>
