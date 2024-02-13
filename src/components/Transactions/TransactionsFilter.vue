<template>

    <v-col class="white mb-6 mr-6 rounded-lg"
              style="max-width: 342px"
              >
              <div class="mx-6 mt-1">
                <p class="text-lg-h6 font-weight-bold">
                  Filtro
                </p>
                <p class="body-2 mb-0" style="color:#95999a">Fecha</p>

                <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      max-width="320px"
                      min-width="auto"
                      offset-y
                      transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          :value="fmtMonth"
                          dense
                          hide-details
                          max-width="230px"
                          style="width: 100%"
                          outlined
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="month"
                        :allowed-dates="allowedDates"
                        type="month"
                        @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
              
              </div>         
      </v-col>
</template>

<script>
    import MonthPicker from "@/mixins/MonthPicker";

    export default{
        name: "TransactionsFilter",
        data: () => ({
          activated : false
        }),
        methods:{
          filterInAction(){
            this.activated = true;
          }
        },
        watch:{
          month(){
            this.$emit("filterInAction", this.month);
          }
        },
        mixins: [MonthPicker],
    }
</script>