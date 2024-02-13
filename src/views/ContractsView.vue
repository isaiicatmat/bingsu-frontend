<template>
  <div>

    <div class="row justify-center align-center white mb-4"
         style="min-height: 15vh">
      Inserta los filtros aquí
    </div>

    <div class="row white">
      <div class="col-12">
        <div class="d-flex align-center px-4 py-4">
          <h1 class="mr-6">Contratos</h1>
          <v-btn color="primary mr-3" @click="newContractDialog = true">Nuevo</v-btn>
          <!-- begins date filter  -->
          <div style="width: 290px" class="mr-2">
            <v-menu
                v-model="initialDateMenu"
                :close-on-content-click="false"
                max-width="290px"
                min-width="auto"
                offset-y
                transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    :value="fmtInitialDate"
                    dense
                    hide-details
                    max-width="290px"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="initialDate"
                  type="month"
                  @input="initialDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <div style="width: 290px">
            <v-menu
                v-model="endDateMenu"
                :close-on-content-click="false"
                max-width="290px"
                min-width="auto"
                offset-y
                transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    :value="fmtEndDate"
                    dense
                    hide-details
                    max-width="290px"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="endDate"
                  type="month"
                  @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <!-- ends date filter-->
        </div>

        <div class="d-flex">
          <ContractTable :contracts="contracts" @onDeleteContract="openDeleteContract"></ContractTable>
        </div>
<!--        insert table here -->
      </div>
    </div>

    <v-dialog v-model="newContractDialog"
              persistent
              transition="dialog-bottom-transition"
              width="600">
      <template v-slot:default="dialog">
        <v-card width="600px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Nuevo contrato</div>
          </v-card-title>
          <v-card-text>
            <contract-form :active-dialog="dialog.value"
                           @onSubmitNewContract="handleAddContract"
                           @close-dialog="dialog.value = false">
            </contract-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>


    <v-dialog transition="dialog-bottom-transition"
              width="400"
              v-model="deleteContractDialog">
      <ConfirmDelete title="Borrar contrato"
                     @cancel="deleteContractDialog = false"
                     @confirm="handleDeleteContract"
                     confirmation-text="¿Estás seguro que deseas eliminar este contrato?">
      </ConfirmDelete>
    </v-dialog>
  </div>
</template>

<script>
import ContractForm from "@/components/Contracts/ContractForm";
import {mapActions, mapMutations} from "vuex";
import ContractTable from "@/components/Contracts/ContractTable";
import ConfirmDelete from "@/components/ConfirmDelete";
import RangeDate from "@/mixins/RangeDate";
import {getLastDayOfMonth} from "@/utils/DateHelper";

export default {
  name: "ContractsView",
  components: {ConfirmDelete, ContractTable, ContractForm},
  mixins: [RangeDate],
  data: () => {
    return {
      newContractDialog: false,
      deleteContractDialog: false,
      contracts: [],
      currentContractId: null,
    }
  },
  watch: {
    async initialDate() {
      await this.getContracts();
    },
    async endDate() {
      await this.getContracts();
    }
  },
  methods: {
    ...mapMutations([
        "SET_LOADING",
        "SHOW_SUCCESS_ALERT",
        "SHOW_ERROR_ALERT"
    ]),
    ...mapActions([
        "SAVE_CONTRACT",
        "GET_CONTRACTS",
        "DELETE_CONTRACT"
    ]),
    async handleAddContract(transaction) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_CONTRACT(transaction);
        this.SHOW_SUCCESS_ALERT("El contrato se ha agregado");
        await this.getContracts();
        // await this.getYearTransactions();
        this.newContractDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeleteContract() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_CONTRACT(this.currentContractId);
        this.SHOW_SUCCESS_ALERT("El contrato se ha eliminado");
        await this.getContracts();
        this.deleteContractDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openDeleteContract(contractId) {
      try {
        this.SET_LOADING(true);
        this.currentContractId = contractId;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deleteContractDialog = true;
    },
    async getContracts() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.initialDate).toISOString().slice(0, 10);
        const endDate = getLastDayOfMonth(new Date(this.endDate)).toISOString().slice(0, 10);
        this.contracts = await this.GET_CONTRACTS({startDate, endDate});
        this.contracts = this.contracts.map((item) => {
          item.payments = [
            {
              month: "ENE",
              status: true,
            },
            {
              month: "FEB",
              status: true,
            },
            {
              month: "MAR",
              status: true,
            },
            {
              month: "APR",
              status: true,
            },
            {
              month: "MAY",
              status: true,
            },
            {
              month: "JUN",
              status: false,
            },
            {
              month: "JUL",
              status: false,
            },
            {
              month: "AUG",
              status: false,
            },
            {
              month: "SEP",
              status: false,
            },
            {
              month: "OCT",
              status: true,
            },
            {
              month: "NOV",
              status: true,
            },
            {
              month: "DIC",
              status: true,
            },
          ];
          return item;
        })
        this.newContractDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
  },
  async mounted() {
    await this.getContracts();
  }
}
</script>

<style scoped>

</style>
