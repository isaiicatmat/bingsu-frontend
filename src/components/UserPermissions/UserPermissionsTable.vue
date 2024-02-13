<template>
  <v-data-table :headers="headers"
                height="360px"
                :items="permissions"
                class="mx-8"
                @dblclick:row="openIndividualPermission">
    <template v-slot:[`item.date`]="{ item }">
      {{ getFmtDates(item) }}
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip class="justify-center" style="min-width: 80px" small :color="getChipColor(item)[0]" :text-color="getChipColor(item)[1]">{{ getFmtPermissionStatus(item) }}
      </v-chip>
    </template>
    <template v-slot:[`item.description`]="{ item }">
      {{ getFmtDescription(item) }}
    </template>
    <template v-slot:[`item.type`]="{ item }">
      {{ getFmtPermissionType(item) }}
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn icon
             v-if="item.status !== 'ACCEPTED'"
             @click="$emit('openEditPermission', item.id)">
        <img src="../../assets/edit_icon.svg" alt="edit icon" style="width:22px; height: 22px">
      </v-btn>
      <v-btn v-else icon disabled >
          <img src="../../assets/edit_icon_grey.svg" alt="edit icon grey" style="width:22px; height: 22px">
      </v-btn>

      <v-btn icon
        v-if="item.status !== 'ACCEPTED'"
        style="margin-right: 4px"
      @click="$emit('openDeletePermission', item.id)">
        <img src="../../assets/delete_icon.svg" alt="delete icon" style="width:22px; height: 22px">
      </v-btn>
      <v-btn v-else icon disabled >
          <img src="../../assets/delete_icon_grey.svg" alt="edit icon grey" style="width:22px; height: 22px">
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import Permission from '../../mixins/Permissions';

export default {
  name: "UserPermissionsTable",
  mixins: [Permission],
  props: {
    permissions: {
      default: () => []
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Tipo',
          align: 'start',
          sortable: false,
          value: 'type'
        },
        { text: 'Fecha / Periodo', sortable: false, value: 'date' },
        { text: 'Estado', value: 'status'},
        { text: 'Descripción', value: 'description' },
        {text: 'Acciones', value: 'actions' }
      ]
    }
  },
  methods: {
    openIndividualPermission(event, {item}) {
      this.$emit('openIndividualPermission', item.id);
    }
  }
}
</script>

<style scoped>

</style>
