<template>
  <v-form ref="userPermissionForm"
          lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-select v-model="permission.type"
                  :disabled="update"
                  :items="permissionTypes"
                  :rules="[requiredRule]"
                  dense
                  item-text="text"
                  item-value="name"
                  label="Tipo"
                  outlined
                  required
                  type="text">
        </v-select>
      </div>
      <div class="col">
        <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateRangeText"
                :rules="[requiredRule]"
                dense
                label="Periodo de permiso"
                outlined
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="dates"
              :allowed-dates="allowedDates"
              no-title
              range
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div 
         class="row row--dense">
      <div class="col">
        <v-file-input v-model="request"
                      :rules="update ? [] : [requiredRule]"
                      accept="image/jpeg, image/png, image/webp, application/pdf"
                      dense
                      label="Solicitud"
                      outlined
                      type="file">
        </v-file-input>
      </div>
    </div>

    <div v-if="permission.type === 'OCCASIONAL'"
         class="row row--dense">
      <v-textarea v-model="permission.description"
                  :rules="[requiredRule]"
                  counter="100"
                  label="Descripción"
                  maxlength="100"
                  outlined
                  type="text">
      </v-textarea>
    </div>


    <div class="d-flex justify-center">
      <v-btn class="mr-2"
             color="#F5223B"
             depressed
             @click="$emit('close-dialog')">
             <div style="color:white">
                Cerrar
             </div>
      </v-btn>
      <v-btn class="ml-2"
             color="primary"
             depressed
             @click="validate()">{{ update ? 'Actualizar' : 'Guardar' }}
      </v-btn>
    </div>

  </v-form>
</template>

<script>
import Rules from "@/mixins/Rules";
import File from '@/mixins/File'
import {mapGetters} from "vuex";

export default {
  name: "UserPermissionForm",
  mixins: [Rules, File],
  props: {
    update: {
      type: Boolean,
      default: false,
    },
    activeDialog: {
      type: Boolean
    },
    userHiringDateCurrentYear: {
      type: String
    },
    userHiringDateLastYear: {
      type: String
    },
    userHiringDateLastDay: {
      type: String
    },
    userNextYearHiringDateLastDay: {
      type: String
    }
  },
  watch: {
    activeDialog: {
      handler(newActiveDialog) {
        if (!newActiveDialog) {
          this.permission = {
            type: "VACATION",
            startDate: "",
            endDate: "",
            description: null,
            request: null,
            status: "PENDING",
          };
          this.request = null;
          this.dates = [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)];
          this.$refs.userPermissionForm.resetValidation();
        } else {
          if (this.update) {
            this.permission = {...this.PERMISSION};
            this.dates = [
              new Date(this.permission.startDate._seconds * 1000).toISOString().substr(0, 10),
              new Date(this.permission.endDate._seconds * 1000).toISOString().substr(0, 10)
            ]
          }
        }
      },
      immediate: true
    }
  },
  data: () => {
    return {
      permission: {
        type: "VACATION",
        startDate: "",
        endDate: "",
        description: null,
        request: null,
        status: "PENDING",
      },
      menu: false,
      request: null,
      dates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      permissionTypes: [
        {
          name: "VACATION",
          text: "Vacaciones"
        },
        {
          name: "OCCASIONAL",
          text: "Especial"
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['PERMISSION']),
    dateRangeText: {
      get() {
        return this.dates.join(' / ');
      },
    },
    currentDate() {
      return new Date();
    }
  },
  methods: {
    async validate() {
      if (this.$refs.userPermissionForm.validate()) {
        if (this.dates[1] >= this.dates[0]) {
          this.permission.startDate = this.dates[0];
          this.permission.endDate = this.dates[1];
        } else {
          this.permission.startDate = this.dates[1];
          this.permission.endDate = this.dates[0];
        }
        this.permission.request = this.request ? await this.getBase64FromFile(this.request) : null;

        if (this.permission.type === "VACATION") {
          this.permission.description = "";
        }

        if (this.update) {
          this.$emit('onSubmitEditUserPermission', this.permission);
        } else {
          this.$emit('onSubmitNewUserPermission', this.permission);
        }
      }
    },
    allowedDates(val) {
      let startDate = new Date(this.userHiringDateLastYear);
      let endDate = new Date(this.userHiringDateLastDay);
      if (this.currentDate >= new Date(this.userHiringDateCurrentYear)) {
        startDate = new Date(this.userHiringDateCurrentYear);
        endDate = new Date(this.userNextYearHiringDateLastDay);
      }
      return new Date(val) <= endDate
          && new Date(val) >= startDate;
    }
  },
}
</script>

<style scoped>

</style>
