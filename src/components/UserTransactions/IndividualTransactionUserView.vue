<template>
  <div class="row no-gutters">
    <div class="col-12 row no-gutters mb-4">
      <InformationText :value="getFmtDate(transaction.date)"
                           class="col"
                           label="Fecha">
      </InformationText>
      <InformationText :value="transaction.category"
                           class="col"
                           label="Categoría">
      </InformationText>
    </div>

    <div class="col-12 row no-gutters mb-4">
      <InformationText :value="getFmtAmount(transaction.amount)"
                       class="col-6"
                       label="Monto">
      </InformationText>
    </div>

    <div class="col-12"
         v-if="transaction.invoice || transaction.xml">
      <div class="d-flex justify-center">
        <v-btn v-if="transaction.invoice"
            small
            outlined
            @click="getFileToDownload(transaction.invoice)"
            color="primary"
            class="white--text ma-2">
          Factura / Recibo
          <v-icon
              right
              dark
          >
            mdi-cloud-download
          </v-icon>
        </v-btn>

        <v-btn v-if="transaction.xml"
            small
            outlined
            @click="getFileToDownload(transaction.xml)"
            color="primary"
            class="white--text ma-2"
        >
          XML
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
import InformationText from "../../components/InformationText";
import {getFmtAmount, getFmtDate} from "../../services/utils";
import File from "../../mixins/File";

export default {
  name: "IndividualTransactionUserView",
  components: {InformationText},
  mixins: [File],
  props: {
    transaction: {}
  },
  methods: {
    getFmtAmount,
    getFmtDate,
  }
}
</script>

<style scoped>

</style>
