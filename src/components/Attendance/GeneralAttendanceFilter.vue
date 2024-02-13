<template>
  <v-col class="white mb-6 rounded-lg" :style="$vuetify.breakpoint.xs ? '' : {'max-width': '342px'}">
    <div :class="$vuetify.breakpoint.xs ? 'mx-4 mt-1 mb-4' : 'mx-6 mt-1 mb-4'">
      <p :class="$vuetify.breakpoint.xs ? 'text-lg-h6 font-weight-black' : 'text-lg-h6 font-weight-bold'">Filtro</p>
      <p class="body-2 mb-0" style="color:#95999a">Periodo</p>
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
            v-model="dates"
            :allowed-dates="allowedDates"
            no-title
            range
        >
          <v-col class="text-right">
            <v-btn
                :disabled="!filterButtonActive"
                color="primary"
                @click="filterDates"
            >
              Filtrar
            </v-btn>
          </v-col>
        </v-date-picker>
      </v-menu>
    </div>
  </v-col>
</template>

<script>
import MonthPicker from "@/mixins/MonthPicker";

export default {
  name: "GeneralAssistanceFilter",
  data: () => {
    return {
      activated: false,
      filterButtonActive: false,
      dates: [new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
    }
  },
  methods: {
    filterInAction() {
      this.activated = true;
    },
    filterDates() {
      this.menu = false;
      this.$emit("filteringAttendanceDates", this.dates);
    },
    enableDisableFilterButton() {
      this.filterButtonActive = (this.dates.length === 2);
    }
  },
  mixins: [MonthPicker],
  computed: {
    dateRangeText: {
      get() {
        this.enableDisableFilterButton();
        return this.dates.join(' / ');
      },
    },
  }
}
</script>
