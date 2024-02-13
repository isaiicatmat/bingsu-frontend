<template>
  <div style="width: 270px">
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        max-width="320px"
        min-width="auto"
        offset-y
        transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            v-model="dateRangeText"
            dense
            hide-details
            outlined
            required
            v-bind="attrs"
            v-on="on">
        </v-text-field>
      </template>
      <v-date-picker
          v-model="computedDates"
          :allowed-dates="allowedDates"
          no-title
          range
      >
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "PeriodDatePicker",
  props: {
    dates: {
      required: true,
    }
  },
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    dateRangeText: {
      get() {
        return this.dates.join(' / ');
      },
    },
    computedDates: {
      get() {
        return this.dates;
      },
      set(value) {
        this.$emit("update:dates", value);
      }
    }
  },
  methods: {
    allowedDates(val) {
      return new Date(val) < new Date()
    },
  }
}
</script>

<style scoped>

</style>
