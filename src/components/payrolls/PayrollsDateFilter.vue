<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        max-width="290px"
        min-width="auto"
        offset-y
        transition="scale-transition"
    >
        <template v-slot:activator="{ on, attrs }">
        <v-text-field
            :value="fmtMonth"
            dense
            hide-details
            max-width="290px"
            outlined
            readonly
            v-bind="attrs"
            v-on="on"
        ></v-text-field>
        </template>
              
        <v-date-picker
            v-model="month"
            type="month"
            @input="menu = false"
        ></v-date-picker>
    </v-menu>

</template>

<script>

import MonthPicker from "@/mixins/MonthPicker";

export default {
    name: "PayrollsDateFilter",
     data: () => {
        return {
            activated: false,
        }
     },
    watch: {
        month(){
                this.$emit("filterInAction", this.month);
        },
    },
    methods:{
        filterInAction(){
          this.activated = true;
        },
    },
    mixins: [MonthPicker],
}
</script>
