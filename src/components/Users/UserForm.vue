<template>
  <v-form ref="userForm"
          lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="user.name"
            :rules="[requiredRule, onlyThreeWords]"
            dense
            label="Nombre"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.firstLastName"
            :rules="[requiredRule, onlyOneWord]"
            dense
            label="Primer apellido"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.secondLastName"
            :rules="[requiredRule, onlyOneWord]"
            dense
            label="Segundo apellido"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.employeeId"
            :rules="[validEmployeeId, requiredRule]"
            dense
            label="Número de empleado"
            maxlength="7"
            outlined
            required
            type="tel"
        ></v-text-field>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="user.email"
            :rules="[requiredRule, emailRule]"
            dense
            label="Correo electrónico"
            outlined
            required
            type="email"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.phoneNumber"
            :rules="[requiredRule, validPhone]"
            dense
            label="Teléfono"
            maxlength="10"
            outlined
            required
            type="tel"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.address"
            :rules="[requiredRule]"
            dense
            label="Dirección"
            outlined
            required
            type="address"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.curp"
            :rules="[validCURP]"
            dense
            label="CURP"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="user.socialSecurityNumber"
            :rules="[requiredRule, validNSS]"
            dense
            label="Número de seguridad social"
            maxlength="11"
            outlined
            required
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.rfc"
            :rules="[requiredRule, validRFC]"
            dense
            label="RFC"
            maxlength="13"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.emergencyNumberOne"
            :rules="[validPhone]"
            dense
            label="Número de emergencia 1"
            maxlength="10"
            outlined
            required
            type="tel"
        ></v-text-field>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.emergencyNumberTwo"
            :rules="[validPhone]"
            dense
            label="Número de emergencia 2"
            maxlength="10"
            outlined
            required
            type="tel"
        ></v-text-field>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateFormatted"
                dense
                label="Fecha de ingreso"
                outlined
                :rules="[requiredRule]"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="date"
              :allowed-dates="allowedDates"
              no-title
              @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
      </div>

      <div class="col">
        <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="birthdayFormatted"
                dense
                label="Fecha de nacimiento"
                outlined
                :rules="[requiredRule]"
                v-bind="attrs"
                @blur="birthday = parseDate(birthdayFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="birthday"
              :allowed-dates="allowedDates"
              no-title
              @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
      </div>

      <div class="col">
        <v-text-field
            v-model="user.vacationDays"
            :rules="[requiredRule]"
            dense
            label="Días de vacaciones"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col" v-if="!update">
        <v-text-field
            v-model="user.initialAmount"
            :rules="[requiredRule, notZero]"
            dense
            label="Monto inicial"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>

      <div class="col" v-if="!update">
        <v-select
            v-model="user.roles"
            :items="roles"
            item-text="text"
            item-value="name"
            :rules="[requiredRule]"
            dense
            label="Rol del usuario"
            outlined
            required
            type="number"
        ></v-select>
      </div>
    </div>

    <div class="row row--dense pb-1" style="color: #1867c0;">
      <label>Máximo 5MB</label>
    </div>
    <div class="row row--dense">
      <div class="col">
        <v-file-input v-model="ine"
                      :rules="update ? [fileSize] : [requiredRule, fileSize]"
                      accept="image/jpeg, image/png, image/webp, application/pdf"
                      dense
                      label="INE"
                      outlined
                      type="file">
        </v-file-input>
      </div>

      <div class="col">
        <v-file-input v-model="birthCertificate"
                      :rules="update ? [fileSize] : [requiredRule, fileSize]"
                      accept="image/jpeg, image/png, image/webp, application/pdf"
                      dense
                      label="Acta de nacimiento"
                      outlined
                      type="file">
        </v-file-input>
      </div>
      <div class="col">
        <v-file-input v-model="avatar"
                      :rules="update ? [fileSize] : [requiredRule, fileSize]"
                      accept="image/jpeg, image/png, image/webp"
                      dense
                      label="Fotografía"
                      outlined
                      type="file">
        </v-file-input>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-file-input v-model="addressCertificate"
                      :rules="update ? [fileSize] : [requiredRule, fileSize]"
                      accept="image/jpeg, image/png, image/webp,application/pdf"
                      dense
                      label="Comprobante de domicilio"
                      outlined
                      type="file">
        </v-file-input>
      </div>

      <div class="col">
        <v-file-input v-model="bachelorCertificate"
                      :rules="update ? [fileSize] : [requiredRule, fileSize]"
                      accept="image/jpeg, image/png, image/webp, application/pdf"
                      dense
                      label="Último grado de estudios"
                      outlined
                      type="file">
        </v-file-input>
      </div>
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
             @click="validate()">{{update ? 'Actualizar' : 'Guardar'}}</v-btn>
    </div>
  </v-form>
</template>

<script>
import File from '@/mixins/File';
import Rules from "@/mixins/Rules";
import {mapGetters} from "vuex";

export default {
      name: "UserForm",
      props: {
        activeDialog: {
          type: Boolean
        },
        update: {
          type: Boolean
        }
      },
      mixins: [File, Rules],
      data(vm) {
        return {
          roles: [
            {
              name: 'admin',
              text: 'Administrador'
            },
            {
              name: 'human_resources',
              text: 'Recursos Humanos'
            },
            {
              name: 'user',
              text: 'Empleado'
            }
          ],
          user: {
            name: "",
            firstLastName: "",
            secondLastName: "",
            phoneNumber: "",
            email: "",
            address: "",
            curp: "",
            socialSecurityNumber: "",
            rfc: "",
            roles: 'user',
            ine: null,
            vacationDays: 10,
            initialAmount: null,
            birthCertificate: null,
            bachelorCertificate: null,
            addressCertificate: null,
            emergencyNumberOne: "",
            emergencyNumberTwo: "",
            employeeId: "",
            hiringDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            birthday: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          },
          ine: null,
          birthCertificate: null,
          bachelorCertificate: null,
          addressCertificate: null,
          avatar: null,
          menu1: false,
          menu2: false,
          date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          birthday: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
          birthdayFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
        }
      },
      computed: {
        ...mapGetters(['USER']),
        computedDateFormatted() {
          return this.formatDate(this.date)
        },
      },
      watch: {
        activeDialog: {
          handler(activeDialogValue) {
            if (activeDialogValue) {
              if (this.update) {
                this.date = new Date(this.USER.hiringDate._seconds * 1000).toISOString().substr(0, 10);
                this.birthday = new Date(this.USER.birthday._seconds * 1000).toISOString().substr(0, 10);
                this.dateFormatted = this.formatDate(new Date(this.USER.hiringDate._seconds * 1000).toISOString().substr(0, 10));
                this.birthdayFormatted = this.formatDate(new Date(this.USER.birthday._seconds * 1000).toISOString().substr(0, 10));
                this.user = this.USER;
              }
            } else {
              this.$refs.userForm.reset();
            }
          },
          immediate: true
        },
        date() {
          this.dateFormatted = this.formatDate(this.date)
        },
        birthday() {
          this.birthdayFormatted = this.formatDate(this.birthday)
        }
      },
      methods: {
        async validate() {
          if (this.$refs.userForm.validate()) {
            this.user.ine = this.ine ? await this.getBase64FromFile(this.ine) : null;
            this.user.birthCertificate = this.birthCertificate ? await this.getBase64FromFile(this.birthCertificate) : null;
            this.user.bachelorCertificate = this.bachelorCertificate ? await this.getBase64FromFile(this.bachelorCertificate) : null;
            this.user.addressCertificate = this.addressCertificate ? await this.getBase64FromFile(this.addressCertificate) : null;
            this.user.avatar = this.avatar ? await this.getBase64FromFile(this.avatar) : null;
            this.user.hiringDate = this.date;
            this.user.birthday = this.birthday;
            if (this.update) {
              this.user.initialAmount = null;
              this.$emit('onSubmitEditUser', this.user);
            } else {
              this.$emit('onSubmitNewUser', this.user);
            }
          }
        },
        formatDate(date) {
          if (!date) return null

          const [year, month, day] = date.split('-')
          return `${month}/${day}/${year}`
        },
        formatLocaleDate(date) {
          if (!date) return null

          const [year, month, day] = date.split('/')
          return `${month}/${day}/${year}`
        },
        parseDate(date) {
          if (!date) return null

          const [month, day, year] = date.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        allowedDates(val) {
          return new Date(val) < new Date();
        }

      },
    };

</script>

<style scoped>

</style>
