<template>
    <v-data-table :headers="headers"
                  :items="fmtAttendances"
                  :hide-default-footer="$vuetify.breakpoint.xsOnly"
                  :height="$vuetify.breakpoint.xs ? '54vh' : '56.4vh'"
                  mobile-breakpoint='0'
                  :disable-pagination="$vuetify.breakpoint.xsOnly"
                  fixed-header
                  :class="$vuetify.breakpoint.xsOnly ? 'data-table-mobile-row' : ''"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="text-truncate" style="max-width: 90px;">
           {{ item.name }}
        </div>
      </template>
      <template v-slot:[`item.in`]="{ item }">
        <div v-if="item.in === '--:--:--'" class="d-flex align-center mr-6" style="color: #D9D9D9">
            <img src="../../assets/clock_icon_disabled16.png" class="mr-2">
            {{  item.in }}
        </div>

        <div v-else class="d-flex align-center">
          <img src="../../assets/clock_icon16.png" class="mr-2"> {{  item.in }}
        </div>
      </template>

      <template v-slot:[`item.out`]="{ item }">
        <div v-if="item.out === '--:--:--'" class="d-flex align-center" style="color: #D9D9D9">
            <img src="../../assets/clock_icon_disabled16.png" class="mr-2">
            {{  item.out }}
        </div>

        <div v-else class="d-flex align-center">
          <img src="../../assets/clock_icon16.png" class="mr-2"> {{  item.out }}
        </div>
      </template>
    </v-data-table>
</template>

<script>

import {getDateFromSeconds, getFmtHour} from "@/utils/DateHelper";

export default {
  name: "AttendanceUsersTable",
  props: {
    attendances: {
      default: () => [],
      required: true,
    },
    users: {
      default: () => [],
      required: true
    }
  },
  data: () => {
    return {
        headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name',
          width: '30%',
        },

        { text: 'Entrada',
          value: 'in',
          width: '35%',
          align: 'left',
          sortable: false,
        },
        { text: 'Salida',
          value: 'out',
          width: '35%',
          align: 'left',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    fmtAttendances() {
      const usersMap = new Map();
      this.users.forEach((user) => {
        usersMap.set(user.id, user);
      });
      return this.attendances.map(function (attendance) {
        return {
          name: usersMap.get(attendance.uid).name,
          in: attendance.in ? getFmtHour(getDateFromSeconds(attendance.in._seconds)) : "--:--:--",
          out: attendance.out ?  getFmtHour(getDateFromSeconds(attendance.out._seconds)) : "--:--:--",
        }
      })
    },
  },
  methods: {
    openUserAttendanceRecord(event, {item}) {
      this.$emit('openUserAttendanceRecord', item);
    },
  },
}
</script>

<style>
.data-table-mobile-row .v-data-table__wrapper td{
  padding: 0 8px !important;
  font-size: 0.8rem !important;
}
</style>
