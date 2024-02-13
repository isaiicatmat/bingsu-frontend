<template>
      <v-select 
        :items="permissionTypes"
        item-text="text"
        hide-details
        item-value="value"
        v-model="computedPermissionType"
        dense
        outlined>
      </v-select>
</template>

<script>
export default {
  name: "PermissionTypeFilter",
  props: {
    permissionType: {
      default: null,
      type: String,
    }
  },
  computed: {
    computedPermissionType: {
      get() {
        return this.permissionType;
      },
      set(value) {
        this.$emit('update:permissionType', value);
      }
    }
  },
  data: () => {
    return {
      permissionTypes: [
        {
          value: "VACATION",
          text: 'Vacaciones'
        },
        {
          value: "OCCASIONAL",
          text: 'Especial'
        },
        {
          value: null,
          text: "Todos"
        }
      ]
    }
  },
}
</script>

