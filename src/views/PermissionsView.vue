<template>
  <div>
    <v-row>
      <div class="white mb-6 rounded-lg d-flex" style="width: 100%;">
        <div class="mx-9 mt-4 mb-7" style="flex: 1">

          <p class="text-lg-h6 font-weight-bold">
            Filtro
          </p>

          <div class="d-flex">
            <div class="mr-6" style="width: 20%;">
              <p class="body-2 mb-0" style="color:#95999a">Fecha</p>
              <PermissionsDateFilter
                  @filterInAction="callAllChanges">
              </PermissionsDateFilter>
            </div>

            <div class="mr-6" style="width: 20%">
              <p class="body-2 mb-0" style="color:#95999a">Tipo de permiso</p>
              <PermissionTypeFilter :permission-type.sync="permissionType"></PermissionTypeFilter>
            </div>

              <div class="mr-6" style="width: 20%">
                <p class="body-2 mb-0" style="color:#95999a">Estado del permiso</p>
                <PermissionStatusFilter :permission-status.sync="permissionStatus"></PermissionStatusFilter>
            </div>
          </div>
        </div>
      </div>
    </v-row>

    <div class="row white rounded-lg">
      <div class="col-12">
        <div class="d-flex align-center px-4 pt-3">
          <p class="text-lg-h6 font-weight-bold">
          Lista de permisos o vacaciones
        </p>
        </div>

        <PermissionsTable :permissions="permissions"
                          :users="users"
                          @openIndividualPermission="openIndividualPermission"
                          @openPermissionAction="handlePermissionAction"
                          v-if="permissionsExist"
        >
        </PermissionsTable>
        <v-sheet v-else >
          <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">

            <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '5%' : '7%', 'margin-right' : isDesktopWidth ? '9%' : ninehundredHeight ? '13%': sevenTwentyHeight ? '20%' : '12.4%', 'margin-left' : '1%'}"></div>
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwentyHeight ? '6%' : '5%', 'margin-right' : isDesktopWidth ? '7%' : ninehundredHeight ? '6.5%' : sevenTwentyHeight ? '4.2%' : '5.5%' }"></div>
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '7%' : sevenTwentyHeight ? '10%' : '9%', 'margin-right' : isDesktopWidth ? '12%' : ninehundredHeight ? '17%' : sevenTwentyHeight ? '22%' :'14%'}"></div>
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwentyHeight ? '7%' : '5%', 'margin-right' : isDesktopWidth ? '4.7%' : ninehundredHeight ? '8%' : sevenTwentyHeight ? '6%' : '6%'}"></div>
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '6%' : sevenTwentyHeight ? '8%' : '7%', 'margin-right' : isDesktopWidth ? '31%' : ninehundredHeight ? '11.5%' : sevenTwentyHeight ? '2%' :'20%'}"></div>
              <div v-if="!sevenTwentyHeight" class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '4%' : '6%'}"></div>
            </div>

          <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 50.6vh">
            <div v-for="i in 10" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
              <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
              <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" :style="{'width': '100%', 'height' : sevenTwentyHeight ? '72px' : '46.5px'}">
                <div v-for="i in 5" :key="i" class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                                :style="{
                                'width': skeletonStyle('width', i), 
                                'margin-right': skeletonStyle('mr', i),
                                'margin-top': sevenTwentyHeight ? '14px' : '',
                                }"
                >
                  <div v-if="i == 4">
                    <v-skeleton-loader type="button" class="permission_admin_status"></v-skeleton-loader>
                  </div>
                  <div class="v-skeleton-loader__text v-skeleton-loader__bone" v-else></div>
                </div>
                <div v-if="!sevenTwentyHeight" class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2 mr-1" :style="{'margin-top':sevenTwentyHeight ? '22px !important' : '' }"></div>
                <div v-if="!sevenTwentyHeight" class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2" :style="{'margin-top':sevenTwentyHeight ? '22px !important' : '' }"></div>
              </div>
            </div>
          </div>

          </div>
          <v-skeleton-loader  type="table-tfoot" class="mr-6"></v-skeleton-loader>
          
        </v-sheet>
      </div>
    </div>

    <v-dialog transition="dialog-bottom-transition"
              width="400"
              v-model="actionPermissionDialog">
      <ConfirmDelete :title="actionUserTransactionTitle"
                     @cancel="handleCancelPermissionAction"
                     @confirm="handleConfirmPermissionAction"
                     :confirmation-text="actionUserTransactionText"
                     :action-button-color="actionUserTransactionColor">
      </ConfirmDelete>
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
                 <div style="color:white">Cerrar</div>
            
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex";
import PermissionsTable from "@/components/Permissions/PermissionsTable";
import ConfirmDelete from "@/components/ConfirmDelete";
import MonthPicker from "@/mixins/MonthPicker";
import PermissionsDateFilter from "@/components/Permissions/PermissionsDateFilter";
import PermissionStatusFilter from "@/components/Permissions/PermissionStatusFilter";
import IndividualPermissionView from "@/components/UserPermissions/IndividualPermissionView";
import PermissionTypeFilter from "@/components/Permissions/PermissionTypeFilter"
import {getDaysBetweenSeconds} from "@/utils/DateHelper";

export default {
  name: "PermissionsView",
  components: {IndividualPermissionView, PermissionStatusFilter, PermissionsDateFilter, ConfirmDelete, PermissionsTable, PermissionTypeFilter},
  mixins: [MonthPicker],
  data: () => {
    return {
      permissions: [],
      users: [],
      actionPermissionDialog: false,
      individualPermissionDialog: false,
      actionUserType: 'ACCEPT',
      currentPermission: null,
      permissionType: null,
      permissionStatus: null,
      isDesktopWidth: window.innerWidth > 1903,
      ninehundredHeight: window.innerHeight <= 900 && window.innerHeight < 720,
      sevenTwentyHeight: window.innerHeight <= 720,
      permissionsExist: false,
      user: null,
      userPermission: [],
      vacation: null,
    }
  },
  computed: {
    actionUserTransactionText() {
      return this.actionUserType === "ACCEPT" ?
          '¿Estás seguro que deseas aprobar este permiso?' : '¿Estás seguro que deseas denegar este permiso?';
    },
    actionUserTransactionTitle() {
      return this.actionUserType === "ACCEPT" ?
      'Aceptar permiso' : 'Denegar permiso';
    },
    actionUserTransactionColor(){
      return this.actionUserType === "ACCEPT" ?
        '#17A3EB' : '#F5223B';
    },
    currentDate() {
      return new Date().toISOString().slice(0, 10);
    },
    usedVacationsDays() {
      return this.getPermissionsDays("VACATION");
    },
  },
  watch: {
    async month() {
      await this.getPermissions();
    },
    async permissionType() {
      await this.getPermissions();
    },
    async permissionStatus() {
      await this.getPermissions();
    }
  },
  methods: {
    ...mapMutations([
      "SET_LOADING",
      "SHOW_SUCCESS_ALERT",
      "SHOW_ERROR_ALERT"
    ]),
    ...mapActions([
      'GET_PERMISSIONS',
        'GET_USERS',
        'UPDATE_PERMISSION',
        'GET_PERMISSION',
        'GET_VACATIONS',
        'GET_USER',
    ]),
    getFullDateFromSeconds(seconds){
      return new Date(seconds * 1000);
    },
    getDateFromMilliseconds(seconds) {
      return new Date(seconds * 1000)
          .toISOString().substr(0, 10);
    },
    setHiringDateToSpecifiedYear(seconds, action) {
      if (action === 'add') {
        return new Date(new Date(seconds * 1000).setFullYear(new Date().getFullYear() + 1))
          .toISOString().substr(0, 10);
      }
      if (action === 'subtract') {
        return new Date(new Date(seconds * 1000).setFullYear(new Date().getFullYear() - 1))
          .toISOString().substr(0, 10);
      }

      return new Date(new Date(seconds * 1000).setFullYear(new Date().getFullYear()))
          .toISOString().substr(0, 10);
    },
    getPermissionsDays(type) {
      let usedDays = 0;
      this.userPermission.forEach((permission) => {
        if (permission.status === "ACCEPTED" && permission.type === type) {
          usedDays += getDaysBetweenSeconds(permission.startDate._seconds, permission.endDate._seconds);
        }
      });
        return usedDays;
    },
    getCurrentPermissionDays(permission) {
        let usedDays = 0;
        if (permission.type === "VACATION") {
          usedDays += getDaysBetweenSeconds(permission.startDate._seconds, permission.endDate._seconds)
        }
        return usedDays;
    },
    async openIndividualPermission(permissionId) {
      try {
        this.currentPermission = await this.GET_PERMISSION(permissionId);
        this.individualPermissionDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      }
    },
    async checkForExpiredPermission(currentPermissions) {
      try {
        let hiringDateByUser = new Map();
        let expiredPermissions = [];
        currentPermissions.forEach(permission => {
          const userId = permission.uid;
          if (!hiringDateByUser.get(userId)) {
            const userHiringDate = this.users.find(user => user.id === userId).hiringDate;
            hiringDateByUser.set(userId, this.setHiringDateToSpecifiedYear(userHiringDate._seconds));
          }

          let hiringDate = hiringDateByUser.get(userId);
          let permissionDate = this.getDateFromMilliseconds(permission.endDate._seconds);

          if ((hiringDate < this.currentDate) && (permissionDate < hiringDate)) {
            if (permission.status === 'PENDING') {
              permission.status = 'EXPIRED';
              let expiredPermission = {};
              Object.assign(expiredPermission, permission);
              expiredPermission.startDate =  this.getFullDateFromSeconds(permission.startDate._seconds);
              expiredPermission.endDate = this.getFullDateFromSeconds(permission.endDate._seconds);
              expiredPermissions.push(expiredPermission);
            }
          }
        });
        expiredPermissions.map(async (permission) => {
          await this.UPDATE_PERMISSION(permission);
        });
    } catch(error) {
      this.SHOW_ERROR_ALERT(error.response.data.message);
    }
    },
    async getPermissions() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        this.users = await this.GET_USERS();
        const currentPermissions = await this.GET_PERMISSIONS({
          startDate,
          endDate,
          type: this.permissionType,
          status: this.permissionStatus
        });
        await this.checkForExpiredPermission(currentPermissions);
        this.permissions = currentPermissions;
        this.permissionsExist = true; 
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
     callAllChanges(value){
      if (value) {
        this.month = value;
      }
    },

    handlePermissionAction(payload) {
      this.actionUserType = payload.value ? 'ACCEPT' : 'DENY';
      this.currentPermission = payload.item;
      this.actionPermissionDialog = true;
    },
    vacationPeriod(userId) {
        this.user = this.users.find(user => user.id === userId)
        let lastVacationDate = this.setHiringDateToSpecifiedYear(this.user.hiringDate._seconds, 'subtract');
        let currentVacationDate = this.setHiringDateToSpecifiedYear(this.user.hiringDate._seconds);
        let nextVacationDate = this.setHiringDateToSpecifiedYear(this.user.hiringDate._seconds, 'add');
    
        return {lastVacationDate, currentVacationDate, nextVacationDate}
    },
    async getVacationByUser(userId) {
      try {
        let {lastVacationDate, currentVacationDate, nextVacationDate} = this.vacationPeriod(userId)
        let startDate = lastVacationDate;
        let endDate = currentVacationDate;

        if (this.currentDate >= currentVacationDate) {
          startDate = currentVacationDate;
          endDate = nextVacationDate;
        }
      
        const vacations =  await this.GET_VACATIONS({uid: userId, startDate: startDate, endDate: endDate})
        this.vacation = vacations[0];
        if (this.vacation === null) {
          this.vacation = {
            date: {},
            days: '0',
            id: '',
            uid: ''
          };
        }
      } catch(e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      }
    },
    async getPermissionByUser(uid) {
      try {
        let {lastVacationDate, currentVacationDate, nextVacationDate} = this.vacationPeriod(uid)
        let startDate = lastVacationDate;
        let endDate = currentVacationDate;

        if (this.currentDate >= currentVacationDate) {
          startDate = currentVacationDate;
          endDate = nextVacationDate;
        }
      
        this.userPermission = await this.GET_PERMISSIONS({uid, startDate, endDate});
      } catch(e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } 
    },
    async handleConfirmPermissionAction() {
      try {
        this.SET_LOADING(true);
        let permission = {...this.currentPermission};
        let denyAcceptedPermission = permission.status === 'ACCEPTED' && this.actionUserType === 'DENY' && permission.type === "VACATION";
        let acceptExpiredPermission = permission.status === 'EXPIRED' && this.actionUserType === 'ACCEPT'&& permission.type === "VACATION";
        permission.status = this.actionUserType === 'ACCEPT' ? 'ACCEPTED' : 'DENIED';
        let permissionPeriodDays = acceptExpiredPermission ? 0 : this.getCurrentPermissionDays(permission);

        permission.startDate = this.getFullDateFromSeconds(permission.startDate._seconds);
        permission.endDate = this.getFullDateFromSeconds(permission.endDate._seconds);

        await this.getVacationByUser(permission.uid);
        await this.getPermissionByUser(permission.uid);

        let usedDays = denyAcceptedPermission ? this.usedVacationsDays - permissionPeriodDays : this.usedVacationsDays + permissionPeriodDays;
        permission['availableDays'] = this.vacation.days - usedDays;
        permission['vacationId'] = this.vacation.id;
        await this.UPDATE_PERMISSION(permission);
        await this.getPermissions();
        this.actionPermissionDialog = false;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    handleCancelPermissionAction() {
      this.actionPermissionDialog = false;
    },
    skeletonStyle(type, idx){
      let widthAndMarginRigth = '';
      switch(idx){
        case 1:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '10%' : this.ninehundredHeight ? widthAndMarginRigth = '14%' : this.sevenTwentyHeight ? widthAndMarginRigth = '18%' : widthAndMarginRigth = '16.4%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '4.2%' : this.ninehundredHeight ? widthAndMarginRigth = '6%' : this.sevenTwentyHeight ? widthAndMarginRigth = '9%' :  widthAndMarginRigth = '3.8%');
          break;
        case 2:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '5%' : this.ninehundredHeight ? widthAndMarginRigth = '7.8%' : this.sevenTwentyHeight ? widthAndMarginRigth = '6%' : widthAndMarginRigth = '6%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '7.2%' : this.sevenTwentyHeight ? widthAndMarginRigth = '4.4%' : widthAndMarginRigth = '4%');
          break;
        case 3:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '10%' : this.ninehundredHeight ? widthAndMarginRigth = '14%' : this.sevenTwentyHeight ? widthAndMarginRigth = '12%' :widthAndMarginRigth = '16.8%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '9.1%' : this.ninehundredHeight ? widthAndMarginRigth = '13%' : this.sevenTwentyHeight ? widthAndMarginRigth = '21.4%' : widthAndMarginRigth = '7.4%');
          break;
        case 4:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '6%' : widthAndMarginRigth = '10.2%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '4.5%' : this.ninehundredHeight ? widthAndMarginRigth = '3%' : this.sevenTwentyHeight ? widthAndMarginRigth = '3.8%' :widthAndMarginRigth = '1%');
          break;
        case 5:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '18%' : this.ninehundredHeight ? widthAndMarginRigth = '12%' : this.sevenTwentyHeight ? widthAndMarginRigth = '8%' : widthAndMarginRigth = '17.8%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '19.4%' : this.ninehundredHeight ? widthAndMarginRigth = '7%' : this.sevenTwentyHeight ? widthAndMarginRigth = '3%' : widthAndMarginRigth = '9.6%');
          break;
        default: return;
      }
      return widthAndMarginRigth;
    }
  },
  async mounted() {
    await this.getPermissions();
  }
}
</script>

<style>

.permission_admin_status .v-skeleton-loader__button  {
  width: 78px !important;
  height: 24px !important;
  border-radius: 12px !important;
}

.v-skeleton-loader__avatar{
  height: 30px;
  width: 30px;
}
</style>
