<template>
  <v-col class="white mb-6 rounded-lg" style="max-width: 342px;">
    <div class="mx-6 mt-1 mb-4">
      <p class="text-lg-h6 font-weight-bold">Filtro</p>
      <p class="body-2 mb-0" style="color:#95999a">Usuario</p>
      <v-select
        :items="users"
        v-model="selectedUser"
        item-text="text"
        hide-details
        item-value="value"
        dense
        outlined>
      </v-select>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "ArticleFilter",
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
