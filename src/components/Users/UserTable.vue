<template>
  <v-data-table :headers="headers"
                :items="users" class="mx-8"
                @dblclick:row="openIndividualUser"
                height="74vh"
                style="text-transform: capitalize">
    <template>

    </template>
    
    <template v-slot:[`item.hiringDate`]="{ item }" >
      <div class="noselect">
        {{ getDateFromMilliseconds(item.hiringDate._seconds) }}
      </div>
    </template>

    <template v-slot:[`item.actions`]="{item}">
      <v-btn icon @click="$emit('openUpdateUser', item.id)">
        <img src="../../assets/edit_icon.svg" style="width:24px; height: 24px">
      </v-btn>
      <v-btn icon @click="$emit('openDeleteUser', item.id)">
        <img src="../../assets/delete_icon.svg" style="width:22px; height: 22px">
      </v-btn>
    </template>

  </v-data-table>
</template>

<script>

export default {
  name: "UserTable",
  data: () => {
    return {
      headers: [
        { text: 'Número de empleado', align: 'start', sortable: false, value: 'employeeId', width: '180px'},
        { text: 'Nombre', value: 'name', width: '140px' },
        { text: 'Apellido', value: 'firstLastName', width: '100px' },
        { text: 'Fecha de contratación', sortable: false, value: 'hiringDate'},
        { text: 'Días de vacaciones disponibles', value: 'availableVacationDays'},
        { text: 'Teléfono', value: 'phoneNumber', sortable: false,},
        { text: 'Acciones', value: 'actions', align: 'center', sortable: false,}
      ],
    }
  },
  methods: {
    getDateFromMilliseconds(seconds) {
      return new Date(seconds * 1000)
          .toISOString().substr(0, 10)
    },
    openIndividualUser(event, {item}) {
      this.$emit('openIndividualUser', item.id);
    }
  },
  props: {
    users: {
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
