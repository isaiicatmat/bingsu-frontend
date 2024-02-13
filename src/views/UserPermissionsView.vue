<template>
  <div>

      <v-row class="justify-space-between rounded-lg mb-2" >
        <v-col>
          <v-card class="rounded-lg" outlined style="border: thin solid white !important;">
            <div class="text-container d-flex justify-space-between" style="margin: 24px">
              <div class="d-flex flex-column">
              <v-card-title v-if="vacation">
                <h2 class="font-weight-black mb-1" style="font-size: 2.2rem">{{vacation ?( (vacation.days == '1') ? vacation.days + ' día' : vacation.days + ' días'): '0 días'}}</h2>
              </v-card-title>
              <v-sheet v-else>
                <v-skeleton-loader type="list-item" id="assign-skeleton"></v-skeleton-loader>
              </v-sheet>
              <v-card-subtitle class="flex-column pt-1">Vacaciones asignadas {{ currentVacationPeriod - 1 }}-{{ currentVacationPeriod }}</v-card-subtitle>
              </div>
            <img src="../assets/date.svg">
            </div>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="rounded-lg" outlined style="border: thin solid white !important;">
            <div class="text-container d-flex justify-space-between" style="margin: 24px">
              <div class="d-flex flex-column">
              <v-card-title v-if="permissionLoaded">
                <h2 class="font-weight-black mb-1" style="font-size: 2.2rem">{{(usedVacationsDays == '1') ? usedVacationsDays + ' día': usedVacationsDays + ' días'}}</h2>
              </v-card-title>
              <v-sheet v-else>
                <v-skeleton-loader type="list-item" id="assign-skeleton"></v-skeleton-loader>
              </v-sheet>
              <v-card-subtitle class="flex-column pt-1">Vacaciones utilizadas</v-card-subtitle>
              </div>
            <img src="../assets/umbrella.svg">
            </div>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="rounded-lg" outlined style="border: thin solid white !important;">
            <div class="text-container d-flex justify-space-between" style="margin: 24px">
              <div class="d-flex flex-column">
              <v-card-title v-if="permissionLoaded">
                <h2 class="font-weight-black mb-1" style="font-size: 2.2rem">{{(userPermissionsDays == '1') ? userPermissionsDays + ' día': userPermissionsDays + ' días'}}</h2>
              </v-card-title>
              <v-sheet v-else>
                <v-skeleton-loader type="list-item" id="assign-skeleton"></v-skeleton-loader>
              </v-sheet>
              <v-card-subtitle class="flex-column pt-1">Permisos utilizados</v-card-subtitle>
              </div>
            <img src="../assets/task.svg">
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div class="row white rounded-lg mx-0">
        <div class="col-12">
          <div class="d-flex row justify-between align-center mb-3 pl-4 mt-2">
            <div class="row">
              <v-btn color="primary mr-3" @click="newUserPermissionDialog = true">Nuevo</v-btn>
              <div style="max-width: 290px">
                <v-select dense
                          v-model="year"
                          :items="years"
                          hide-details
                          item-value="name"
                          item-text="text"
                          label="Año laboral"
                          outlined
                          required
                          type="text">
                </v-select>
              </div>
              <div>
                <v-list-item two-line style="min-height: 40px">
                  <v-list-item-content  class="py-1">
                    <v-list-item-title class="caption">Fecha de contratación:</v-list-item-title>
                    <v-list-item-subtitle v-if="hiringDateLoaded" class="body-2">{{ fmtHiringDate }}</v-list-item-subtitle>
                  <v-sheet v-else>
                    <v-skeleton-loader type="list-item" id="hiringDateSkeleton"></v-skeleton-loader>
                  </v-sheet>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </div>
            <div class="d-flex">
              <v-btn
                class="white--text ma-2"
                color="primary"
                style="height: 32px"
                outlined
                small
                @click="getFileToDownload('https://storage.googleapis.com/bingsu-backend.appspot.com/VACACIONES_v3.pdf')">
                Vacaciones
                <v-icon dark right>
                  mdi-cloud-download
                </v-icon>
              </v-btn>
              <v-btn
                class="white--text ma-2"
                color="primary"
                style="height: 32px"
                outlined
                small
                @click="getFileToDownload('https://storage.googleapis.com/bingsu-backend.appspot.com/PERMISO_v3.pdf')">
                Permiso
                <v-icon dark right>
                  mdi-cloud-download
                </v-icon>
              </v-btn>
              <v-btn
                class="white--text ma-2"
                color="primary"
                style="height: 32px"
                outlined
                small
                @click="getFileToDownload('https://storage.googleapis.com/bingsu-backend.appspot.com/incidencias_word_v1.docx')">
                Incidencias
                <v-icon dark right>
                  mdi-cloud-download
                </v-icon>
              </v-btn>
            </div>
          </div>
          <UserPermissionsTable :permissions="userPermissions"
                                @openEditPermission="openUpdatePermission"
                                @openIndividualPermission="openIndividualPermission"
                                @openDeletePermission="openDeletePermission"
                                v-if="noPermissions"
          >
          </UserPermissionsTable>
          <v-sheet v-else>
            <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
              <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '4%' : '6%', 'margin-right' : isDesktopWidth ? '8.8%' : '7%', 'margin-left' : '1%'}"></div>
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '6%' : '10%', 'margin-right' : isDesktopWidth ? '19.8%' : '15%', 'margin-left' : '1%'}"></div>
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '4%' : '7%', 'margin-right' : isDesktopWidth ? '10.8%' : '8.4%', 'margin-left' : '1%'}"></div>
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '5%' : '8%', 'margin-right' : isDesktopWidth ? '22%' : '18.8%', 'margin-left' : '1%'}"></div>
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '5%' : '7%'}"></div>
              </div>
              <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 29.7vh">
                <div v-for="i in 5" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                  <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                      <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" style="width: 100%; height: 46.5px">
                        <div v-for="i in 4" :key="i" class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                                  :style="{
                                  'width': skeletonStyle('width', i), 
                                  'margin-right': skeletonStyle('mr', i)}"
                        >
                          <v-skeleton-loader v-if="i == 3" type="button"></v-skeleton-loader>
                          <div v-else class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
                        </div>
                        <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2 mr-1"></div>
                        <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2"></div>
                      </div>
                </div>
              </div>
            </div>
            <v-skeleton-loader class=" mr-10" type="table-tfoot"></v-skeleton-loader>
          </v-sheet>
        </div>
      </div>

      <v-dialog v-model="newUserPermissionDialog"
                persistent
                transition="dialog-bottom-transition"
                width="600">
        <template v-slot:default="dialog">
          <v-card width="600px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">Nuevo permiso</div>
            </v-card-title>
            <v-card-text>
              <UserPermissionForm :user="user"
                                  @close-dialog="dialog.value = false"
                                  :userHiringDateCurrentYear = "userHiringDateCurrentYear"
                                  :userHiringDateLastYear = "userHiringDateLastYear"
                                  :userHiringDateLastDay = "userHiringDateLastDay" 
                                  :userNextYearHiringDateLastDay = "userNextYearHiringDateLastDay"
                                  @onSubmitNewUserPermission="handleAddUserPermission"
                                  :active-dialog="dialog.value">
              </UserPermissionForm>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog transition="dialog-bottom-transition"
                width="400"
                v-model="deletePermissionDialog">
        <ConfirmDelete title="Borrar permiso"
                      :action-button-color="'error'"
                      @cancel="deletePermissionDialog = false"
                      @confirm="handleDeletePermission"
                      confirmation-text="¿Estás seguro que deseas eliminar este permiso?">
        </ConfirmDelete>
      </v-dialog>

      <v-dialog v-model="updatePermissionDialog"
                persistent
                transition="dialog-bottom-transition"
                width="600">
        <template v-slot:default="dialog">
          <v-card width="600px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">Editar permiso</div>
            </v-card-title>
            <v-card-text>
              <user-permission-form :active-dialog="dialog.value"
                                    update
                                    :userHiringDateCurrentYear = "userHiringDateCurrentYear"
                                    :userHiringDateLastYear = "userHiringDateLastYear"
                                    :userHiringDateLastDay = "userHiringDateLastDay" 
                                    :userNextYearHiringDateLastDay = "userNextYearHiringDateLastDay"
                                    @onSubmitEditUserPermission="handleUpdateUserPermission"
                                    @close-dialog="dialog.value = false">
              </user-permission-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog transition="dialog-bottom-transition"
                width="500"
                v-model="individualPermissionDialog">

        <v-card width="500px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Permiso</div>
          </v-card-title>
          <v-card-text>
            <IndividualPermissionView :permission="currentPermission"></IndividualPermissionView>
          </v-card-text>
          <div class="d-flex white justify-center pb-5">
            <v-btn color="#F5223B"
                  @click="individualPermissionDialog = false">
                  <div style="color:white">
                    Cerrar
                  </div>
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    
  </div>
</template>

<script>
import UserPermissionForm from "@/components/UserPermissions/UserPermissionForm";
import {mapActions, mapMutations} from "vuex";
import UserPermissionsTable from "@/components/UserPermissions/UserPermissionsTable";
import authService from "@/services/auth";
import {getDaysBetweenSeconds, getDateFromSeconds,subtractYears, getFmtDate, subtractDays, addYears} from "@/utils/DateHelper";
import File from '@/mixins/File'
import ConfirmDelete from "@/components/ConfirmDelete";
import IndividualPermissionView from "@/components/UserPermissions/IndividualPermissionView";

export default {
  name: "UserPermissionsView",
  components: {
    ConfirmDelete,
    IndividualPermissionView,
    UserPermissionsTable,
    UserPermissionForm,
    
  },
  mixins: [File],
  data: () => {
    return {
      newUserPermissionDialog: false,
      deletePermissionDialog: false,
      updatePermissionDialog: false,
      currentPermissionId: null,
      userPermissions: [],
      menu: false,
      noPermissions: false,
      isDesktopWidth: window.innerWidth > 1903,
      vacation: null,
      currentPermission: null,
      individualPermissionDialog: false,
      year: new Date().getFullYear(),
      currentVacationPeriod: new Date().getFullYear(),
      authService,
      permissionLoaded: false,
      hiringDateLoaded: false,
      user: null,
      userPermissionsYear: [],
      fmtHiringDate: null,
      years: [],
      userHiringDate: null,
      userHiringDateCurrentYear: null,
      userHiringDateLastYear: null,
      userHiringDateLastDay: null, 
      userNextYearHiringDateLastDay: null, 
    }
  },
  watch: {
    async year() {
      await this.getVacation();
      await this.getPermissions();
    }
  },
  computed: {
    usedVacationsDays() {
      return this.getPermissionsDays("VACATION");
    },
    userPermissionsDays() {
      return this.getPermissionsDays("OCCASIONAL");
    },
    currentDate() {
      return new Date().toISOString().slice(0, 10);
    },
  },
  methods: {
    openDeletePermission(id) {
      this.currentPermissionId = id;
      this.deletePermissionDialog = true;
    },
    getPermissionsDays(type) {
      let usedDays = 0;

      this.userPermissionsYear.forEach((permission) => {
        if (permission.status === "ACCEPTED" && permission.type === type) {
          usedDays += getDaysBetweenSeconds(permission.startDate._seconds, permission.endDate._seconds);
        }
      });
        return usedDays;
    },
    skeletonStyle(type, idx){
      let widthAndMarginRigth = ''; 
      switch(idx){
      case 1:
        type === 'width' ? widthAndMarginRigth = this.isDesktopWidth ? '5%' : '8%' : widthAndMarginRigth = this.isDesktopWidth ? '9.2%' : '6.2%'; 
        break;
      case 2:
        type === 'width' ? widthAndMarginRigth = this.isDesktopWidth ? '7%' : '14%' : widthAndMarginRigth = this.isDesktopWidth ? '20.4%' : '13.8%'; 
        break;
      case 3:
        type === 'width' ? widthAndMarginRigth = '12%' : widthAndMarginRigth = '4%'; 
        break;
      case 4:
        type === 'width' ? widthAndMarginRigth = this.isDesktopWidth ? '7%' : '10%' : widthAndMarginRigth = this.isDesktopWidth ? '21%' : '18.2%'; 
        break;
      }
      return widthAndMarginRigth;
    },

    ...mapMutations([
      "SET_LOADING",
      "SHOW_SUCCESS_ALERT",
      "SHOW_ERROR_ALERT",
        'SET_PERMISSION'
    ]),
    ...mapActions([
        'SAVE_PERMISSION',
        'GET_PERMISSIONS',
        'GET_VACATIONS',
        'DELETE_PERMISSION',
        'UPDATE_PERMISSION',
        'GET_PERMISSION',
        'GET_USER',
    ]),
    async handleAddUserPermission(permission) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_PERMISSION(permission);
        this.SHOW_SUCCESS_ALERT("La solicitud de permiso se agregado");
        await this.getPermissions();
        this.newUserPermissionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdateUserPermission(permission) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_PERMISSION(permission);
        this.SHOW_SUCCESS_ALERT("El permiso ha sido actualizado");
        await this.getPermissions();
        this.updatePermissionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeletePermission() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_PERMISSION(this.currentPermissionId);
        this.SHOW_SUCCESS_ALERT("El permiso ha sido eliminado");
        await this.getPermissions();
        this.deletePermissionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
        if (error.response.status === 403) {
          this.deletePermissionDialog = false;
        }
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openIndividualPermission(permissionId) {
      try {
        this.SET_LOADING(true);
        this.currentPermission = await this.GET_PERMISSION(permissionId);
        this.individualPermissionDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openUpdatePermission(id) {
      try {
        this.SET_LOADING(true);
        const permission = await this.GET_PERMISSION(id);
        this.SET_PERMISSION(permission);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.updatePermissionDialog = true;
    },
    async getVacation() {
      try {
        this.SET_LOADING(true);
        let startDate = this.userHiringDateLastYear;
        let endDate = this.userHiringDateLastDay;
        
        if (this.currentDate >= this.userHiringDateCurrentYear) {
          startDate = this.userHiringDateCurrentYear;
          endDate = this.userNextYearHiringDateLastDay;
        }
        const vacations = await this.GET_VACATIONS({startDate, endDate});
        this.vacation = vacations[0];
        if (this.vacation === null) {
          this.vacation = {
            date: {},
            days: '0',
            id: '',
            uid: ''
          };
        }
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getUsedPermissionDays() {
      try {
        this.SET_LOADING(true);
        let startDate = this.userHiringDateLastYear;
        let endDate = this.userHiringDateLastDay;
        
        if (this.currentDate >= this.userHiringDateCurrentYear) {
          startDate = this.userHiringDateCurrentYear;
          endDate = this.userNextYearHiringDateLastDay;
        }
        this.userPermissionsYear = await this.GET_PERMISSIONS({startDate, endDate});
        
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false)
      }
    },
    permissionPeriod() {
      const nextPermissionPeriodStartDate =  getFmtDate(this.userHiringDate.setFullYear(this.year));
      const lastPermissionPeriodStartDate = getFmtDate(subtractYears(new Date(nextPermissionPeriodStartDate), 1));
      const lastPermissionPeriodEndDate = getFmtDate(subtractDays(new Date(nextPermissionPeriodStartDate), 1));
      const nextPermissionPeriodEndDate = getFmtDate(addYears(lastPermissionPeriodEndDate, 1));

      return {lastPermissionPeriodStartDate, nextPermissionPeriodStartDate, lastPermissionPeriodEndDate, nextPermissionPeriodEndDate};
    },
    getCurrentVacationPeriod() {
      let year = new Date().getFullYear();
      if (this.currentDate >= this.userHiringDateCurrentYear){
        year = new Date().getFullYear() + 1
      }
      this.currentVacationPeriod = year;
    },
    async getPermissions() {
      try {
        this.SET_LOADING(true);
        let {lastPermissionPeriodStartDate, nextPermissionPeriodStartDate, lastPermissionPeriodEndDate, nextPermissionPeriodEndDate} = this.permissionPeriod();
        let startDate = lastPermissionPeriodStartDate;
        let endDate = lastPermissionPeriodEndDate;
        
        if (this.currentDate >= this.userHiringDateCurrentYear) {
          startDate = nextPermissionPeriodStartDate;
          endDate = nextPermissionPeriodEndDate;
        }
        this.userPermissions = await this.GET_PERMISSIONS({startDate, endDate});
        this.permissionLoaded = true;
        this.noPermissions = true;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    getYears() {
      let years = [];
      for (let i = this.year - 10; i < this.year + 2; i++) {
        years.push(i);
      }
      this.years = years
    }
  },
  async mounted() {
    this.getYears();
    this.user = await this.GET_USER(authService.user.uid);
    this.fmtHiringDate = getDateFromSeconds(this.user.hiringDate._seconds).toLocaleDateString('es-MX', {year: 'numeric', month: 'long', day: 'numeric'});
    this.hiringDateLoaded = true;
    this.userHiringDate = getDateFromSeconds(this.user.hiringDate._seconds);
    this.userHiringDateCurrentYear = getFmtDate(this.userHiringDate.setFullYear(new Date().getFullYear()));
    this.userHiringDateLastYear = getFmtDate(subtractYears(this.userHiringDateCurrentYear, 1));
    this.userHiringDateLastDay = getFmtDate(subtractDays(new Date(this.userHiringDateCurrentYear), 1 ));
    this.userNextYearHiringDateLastDay = getFmtDate(addYears(this.userHiringDateLastDay, 1));
    await this.getVacation();
    this.getCurrentVacationPeriod();
    await this.getPermissions();
    await this.getUsedPermissionDays();
  }
}
</script>

<style >
#assign-skeleton .v-skeleton-loader__text {
  height: 42px !important;
  width: 40px !important;
}
#assign-skeleton .v-skeleton-loader__list-item {
  padding-top: 14px !important;
  padding-bottom: 1px !important;
  height: 52px !important;
  width: 200px !important;
}

.v-skeleton-loader__button  {
  width: 77px !important;
  height: 24px !important;
  border-radius: 12px;
}

.v-skeleton-loader__avatar{
  height: 30px;
  width: 30px;
}

#hiringDateSkeleton .v-skeleton-loader__list-item{
  height: 15px;
  padding: 0px;
}
</style>
