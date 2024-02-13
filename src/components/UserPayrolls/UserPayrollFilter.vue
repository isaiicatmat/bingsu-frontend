<template>
  <v-col class="white mb-6 mr-6 rounded-lg"
          style="min-height: 18vh; max-width: 342px; max-height: 250px;"
          >
    <div class="mx-6 mt-2">
      <p class="text-lg-h6 font-weight-bold">
        Filtro
      </p>
      <div>
        <p class="body-2 mb-0" style="color:#95999a">Año</p>
        <v-select
          dense
          v-model="year"
          :items="years"
          hide-details
          min-width="auto"
          max-width="290px"
          outlined
          type="text">
        </v-select>
      </div>
    </div>
  </v-col>
</template>
<script>
export default {
  name: "UserPayrollFilter",
  data: () => {
    return {
      years: [],
      year: new Date().getFullYear(),
    }
  },
  watch: {
    year() {
      this.$emit("filterInAction", this.year)
    }
  },
  methods: {
    getYears() {
      let years = [];
      for (let i = this.year - 6; i < this.year + 1; i++) {
        years.push(i);
      }
      this.years = years;
    }
  },
  async mounted() {
    this.getYears();
  }
}
</script>