<template>
  <div class="row no-gutters white">
    <div class="col-12 row no-gutters mb-4">
      <InformationText :value="getFmtPermissionType(permission)"
                       class="col"
                       label="Tipo">
      </InformationText>
      <InformationText :value="getFmtDate(permission.startDate) + ' / ' + getFmtDate(permission.endDate)"
                       class="col"
                       label="Periodo">
      </InformationText>
    </div>

    <div class="col-12 row no-gutters mb-4"
         v-if="permission.type === 'OCCASIONAL'">
      <InformationText :value="permission.description"
                       class="col-6"
                       label="Descripción">
      </InformationText>
    </div>

    <div class="col-12"
         >
      <div class="d-flex justify-center">
        <v-btn
            style="height: 32px"
            small
            outlined
            @click="getFileToDownload(permission.request)"
            color="primary"
            class="white--text ma-2">
          Formato de permiso
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import InformationText from "@/components/InformationText";
import {getFmtDate} from "@/services/utils";
import File from '@/mixins/File'
import Permission from '@/mixins/Permissions'

export default {
  name: "IndividualPermissionView",
  components: {InformationText},
  mixins: [File, Permission],
  props: {
    permission: {
      required: true,
      default: null,
    }
  },
  methods: {
    getFmtDate
  }
}
</script>

<style scoped>

</style>
