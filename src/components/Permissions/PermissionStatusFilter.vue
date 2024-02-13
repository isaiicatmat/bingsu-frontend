<template>
  <v-select :items="permissionsStatus"
            item-text="text"
            hide-details
            item-value="value"
            v-model="computedPermissionStatus"
            dense
            outlined>
  </v-select>
</template>

<script>
export default {
  name: "PermissionStatusFilter",
  props: {
    permissionStatus: {
      default: null,
      type: String,
    }
  },
  computed: {
    computedPermissionStatus: {
      get() {
        return this.permissionStatus;
      },
      set(value) {
        this.$emit('update:permissionStatus', value);
      }
    }
  },
  data: () => {
    return {
      permissionsStatus: [
        {
          value: "PENDING",
          text: 'En revisión'
        },
        {
          value: "DENIED",
          text: 'Denegado'
        },
        {
          value: "ACCEPTED",
          text: "Aprobado"
        },
        {
          value: "EXPIRED",
          text: "Vencido"
        },
        {
          value: null,
          text: "Todos"
        },
      ]
    }
  },
}
</script>

<style scoped>

</style>
