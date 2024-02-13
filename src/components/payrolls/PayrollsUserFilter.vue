<template>
  <v-select 
        :items="users"
        v-model="selectedUser"
        item-text="text"
        hide-details
        item-value="value"
        dense
        outlined>
  </v-select>
</template>
<script>
export default {
  name: "PayrollsUserFilter",
  data: () => {
    return {
      selectedUser: {
        text: ' Todos',
        value: 'All'
      },
    }
  },
  props: {
    users: {
      default: () => []
    },
  },
  watch: {
    selectedUser() {
      this.$emit("filterInAction", this.selectedUser);
    }
  }
}
</script>