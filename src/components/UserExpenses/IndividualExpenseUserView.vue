<template>
    <div class="row no-gutters">
        <div v-if="userRole === 'admin'" class="col-12 row no-gutters mb-4">
            <InformationText 
                :value="getFmtDate(expense.cardDateOut)"
                class="col"
                label="Fecha entregada">
            </InformationText>
            <InformationText 
                :value="getFmtDate(expense.cardDateIn)"
                class="col"
                label="Fecha recibida">
            </InformationText>
        </div>
        <div v-else class="col-12 row no-gutters mb-4">
            <InformationText 
                :value="getFmtDate(expense.cardDateOut)"
                class="col"
                label="Fecha recibida">
            </InformationText>
            <InformationText 
                :value="getFmtDate(expense.cardDateIn)"
                class="col"
                label="Fecha entregada">
            </InformationText>
        </div>
        <div class="col-12 row no-gutters mb-4">
            <InformationText 
                :value="getFmtAmount(expense.amount)"
                class="col"
                label="Monto">
            </InformationText>
        </div>
        <div class="col-12" v-if="expense.invoice || expense.xml">
            <div class="d-flex justify-center">
                <v-btn
                    v-if="expense.invoice"
                    style="height: 32px"
                    small
                    outlined
                    @click="getFileToDownload(expense.invoice)"
                    color="primary"
                    class="white--text ma-2"
                >
                    Factura / Recibo
                    <v-icon right dark>
                        mdi-cloud-download
                    </v-icon>
                </v-btn>

                <v-btn
                    v-if="expense.xml"
                    style="height: 32px"
                    small
                    outlined
                    @click="getFileToDownload(expense.xml)"
                    color="primary"
                    class="white--text ma-2"
                >
                    XML
                    <v-icon right dark>
                        mdi-cloud-download
                    </v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import InformationText from "@/components/InformationText";
import {getFmtAmount, getFmtDate} from "@/services/utils";
import File from "@/mixins/File";
import authService from "@/services/auth";

export default {
    name: "IndividualExpenseUserView",
    data: () => {
        return {
            authService,
            userRole: null,
        }
    },
    components: {InformationText},
    mixins: [File],
    props: {
        expense: {}
    },
    methods: {
        getFmtAmount,
        getFmtDate,
    },
    async mounted() {
        this.userRole = await authService.getRole();
    }
}
</script>

<style scoped>
</style>