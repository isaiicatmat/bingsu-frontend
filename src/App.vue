<template>
  <v-app>
    <AlertSheet></AlertSheet>
    <LoadingDialog></LoadingDialog>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import authService from "@/services/auth";
import LoadingDialog from "@/components/LoadingDialog.vue";
import AlertSheet from "@/components/AlertSheet.vue";

export default Vue.extend({
  name: 'App',
  components: {AlertSheet, LoadingDialog},
  data: () => ({
    auth: authService,
  }),
});
</script>

<style>
  .pointer {
    cursor: pointer;
     user-select:none;
  }
</style>
