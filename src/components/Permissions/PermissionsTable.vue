<template>
  <v-data-table :headers="headers"
                :items="userPermissions"
                height="56.4vh"
                class="mx-8"
                @dblclick:row="openIndividualPermission">
    <template v-slot:[`item.date`]="{ item }">
      {{ getFmtDates(item) }}
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip class="justify-center" style="min-width: 80px" small :text-color="getChipColor(item)[1]" :color="getChipColor(item)[0]">{{ getFmtPermissionStatus(item) }}
      </v-chip>
    </template>
    <template v-slot:[`item.description`]="{ item }">
      <div class="text-truncate" style="max-width: 240px;">
      {{ getFmtDescription(item) }}
    </div>
    </template>
    <template v-slot:[`item.type`]="{ item }">
      {{ getFmtPermissionType(item) }}
    </template>
    <template v-slot:[`item.actions`]="{ item }">

      <v-btn icon
          v-if="item.status !== 'DENIED'"
          @click="$emit('openPermissionAction', {item: item, value: false})">
          <img src="../../assets/deny_icon.svg">
      </v-btn>
      <v-btn v-else icon disabled >
          <img src="../../assets/deny_disabled.svg">
      </v-btn>

      <v-btn icon style="margin-right: 4px"
        v-if="item.status !== 'ACCEPTED'"
        @click="$emit('openPermissionAction', {item: item, value: true})">
        <img src="../../assets/accept_icon.svg">
      </v-btn>
      <v-btn icon disabled v-else>
          <img src="../../assets/accept_disabled.svg">
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import Permission from '../../mixins/Permissions';

export default {
  name: "PermissionsTable",
  mixins: [Permission],
  props: {
    permissions: {
      default: () => []
    },
    users: {
      default: () => []
    }
  },
  computed: {
    userPermissions() {
      if (this.permissions.length > 0 && this.users.length) {
        return this.permissions.map((permission) => {
          const user = this.users.find(user => user.id === permission.uid);
          permission.userName = user.name + ' ' + user.firstLastName;
          return permission;

        })
      } else {
        return [];
      }
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Usuario',
          align: 'start',
          sortable: false,
          value: 'userName',
          'width': '220px'
        },
        {
          text: 'Tipo',
          align: 'start',
          value: 'type'
        },
        { text: 'Fecha / Periodo', value: 'date', sortable: false, 'width': '240px' },
        { text: 'Estado', value: 'status', align: 'center'},
        { text: 'Descripción', value: 'description', sortable: false },
        { text: 'Acciones', value: 'actions', align: 'center', sortable: false },
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
