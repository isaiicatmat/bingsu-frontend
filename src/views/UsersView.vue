<template>
  <div>

    <div class="row white rounded-lg">
      <div class="col-12" :style="{'padding' : ninehundredHeight ? '0px' : '12px'}">
        <div class="d-flex px-4 py-4 ml-6 justify-start">
          <v-btn color="primary" @click="newUserDialog = true">Nuevo</v-btn>
        </div>
        <UserTable :users="users"
                   v-if="usersExist"
                   @openIndividualUser="openIndividualUser"
                   @openDeleteUser="openDeleteUser"
                   @openUpdateUser="openUpdateUser">
        </UserTable>
        <v-sheet v-else>
          <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
                <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" :style="{'width' : '100%', 'padding' : sevenTwenty ? '24.5px  34px !important' : ''}">
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwenty ? '15%' : '8%', 'margin-right' : isDesktopWidth ? '2.5%' : sevenTwenty ? '7.5%' : '9%', 'margin-left': '1%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwenty ? '9%' : '4%', 'margin-right' : isDesktopWidth ? '4.3%' : sevenTwenty ? '7%' :'8.5%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwenty ? '9%' : '4%', 'margin-right' : isDesktopWidth ? '2%' : sevenTwenty ? '5%' : '5%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwenty ? '8%' : '7%', 'margin-right' : isDesktopWidth ? '12.5%' : sevenTwenty ? '5%' : '9.5%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': sevenTwenty ? '8%' : '11%', 'margin-right' :isDesktopWidth ? '17%' : sevenTwenty ? '4%' : '12%'}"></div>
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '4%', 'margin-right' : isDesktopWidth ? '14.1%' : sevenTwenty ? '9.1%' : '9%'}"></div>    
                  <div class="v-skeleton-loader__heading v-skeleton-loader__bone" style="max-width: 4%;"></div>    
                </div>

                <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 68vh">

                    <div v-for="i in 10" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                        <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                        <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" :style="{'width': '100%', 'height': sevenTwenty ? '72px' :'46.5px'}">

                            <div v-for="i in 6" :key="i" class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                              :style="{'width': skeletonStyle('width', i), 'margin-right': skeletonStyle('mr', i), 'margin-top': sevenTwenty ? '14px' : ''}"
                            >
                                <div class="v-skeleton-loader__text v-skeleton-loader__bone" ></div>
                            </div>
                            <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2 mr-1" :style="{'margin-top':sevenTwenty ? '22px !important' : '' }"></div>
                            <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2" :style="{'margin-top':sevenTwenty ? '22px !important' : '' }"></div>
                        </div>
                    </div>

                </div>
          </div>  
          
          <v-skeleton-loader type="table-tfoot" class="mr-6"></v-skeleton-loader>
        </v-sheet>
      </div>
    </div>


    <v-dialog v-model="newUserDialog"
              persistent
              transition="dialog-bottom-transition"
              width="1200">
      <template v-slot:default="dialog">
        <v-card width="1200px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Nuevo usuario</div>
          </v-card-title>
          <v-card-text>
            <user-form :active-dialog="dialog.value"
                       @onSubmitNewUser="handleSubmitUser"
                       @close-dialog="dialog.value = false">
            </user-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog v-model="updateUserDialog"
              persistent
              transition="dialog-bottom-transition"
              width="1200">
      <template v-slot:default="dialog">
        <v-card width="1200px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">Editar usuario</div>
          </v-card-title>
          <v-card-text>
            <user-form :active-dialog="dialog.value"
                       update
                       @onSubmitEditUser="handleUpdateUser"
                       @close-dialog="dialog.value = false">
            </user-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>


    <v-dialog v-model="individualUserDialog"
              transition="dialog-bottom-transition"
              width="1200">
      <v-card width="1200px">

        <v-card-text>
          <IndividualUserView :user="USER"></IndividualUserView>
        </v-card-text>
        <div class="d-flex white justify-center pb-5">
          <v-btn color="#F5223B"
                 @click="individualUserDialog = false">
                 <div style="color:white">
                    Cerrar
                 </div>

          </v-btn>
        </div>
      </v-card>
    </v-dialog>


    <v-dialog transition="dialog-bottom-transition"
              width="400"
              v-model="deleteUserDialog">
      <ConfirmDelete title="Borrar usuario"
                     @cancel="deleteUserDialog = false"
                     @confirm="handleDeleteUser"
                     confirmation-text="¿Estás seguro que deseas eliminar a este usuario?">
      </ConfirmDelete>
    </v-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import UserForm from "@/components/Users/UserForm";
import Vue from "vue";
import UserTable from "@/components/Users/UserTable";
import IndividualUserView from "@/components/Users/IndividualUserView";
import ConfirmDelete from "@/components/ConfirmDelete";
import {getDaysBetweenSeconds} from "@/utils/DateHelper";

export default {
  name: "UsersView",
  components: {IndividualUserView, ConfirmDelete, UserTable, UserForm},
  data: () => {
    return {
      newUserDialog: false,
      updateUserDialog: false,
      individualUserDialog: false,
      deleteUserDialog: false,
      currentUserId: null,
      users: [],
      isDesktopWidth: window.innerWidth > 1903,
      ninehundredHeight: window.innerHeight <= 900 && window.innerHeight > 720,
      sevenTwenty: window.innerHeight <= 720,
      usersExist: false,
    }
  },
  computed: {
    ...mapGetters([
      'USER'
    ]),
    currentDate() {
      return new Date().toISOString().slice(0, 10);
    }
  },
  methods: {
    ...mapActions([
      'SAVE_USER',
      'GET_USERS',
      'GET_USER',
      'UPDATE_USER',
      'DELETE_USER',
      'GET_PERMISSIONS',
      'GET_VACATIONS',
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SET_USER',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT',
    ]),
    setHiringDateToSpecifiedYear(seconds, action) {
      if (action === 'add') {
        return new Date(new Date(new Date(seconds * 1000).setDate(new Date(seconds * 1000).getDate() - 1)).setFullYear(new Date().getFullYear() + 1))
          .toISOString().substr(0, 10);
      }
      if (action === 'subtract') {
        return new Date(new Date(new Date(seconds * 1000).setDate(new Date(seconds * 1000).getDate() - 1)).setFullYear(new Date().getFullYear() - 1))
          .toISOString().substr(0, 10);
      }
      if (action === 'current') {
        return new Date(new Date(new Date(seconds * 1000).setDate(new Date(seconds * 1000).getDate() - 1)).setFullYear(new Date().getFullYear()))
          .toISOString().substr(0, 10);
      }
      return new Date(new Date(seconds * 1000).setDate(new Date(seconds * 1000).getDate() - 1))
          .toISOString().substr(0, 10);
    },
    async openUpdateUser(userId) {
      try {
        this.SET_LOADING(true);
        const user = await this.GET_USER(userId);
        this.SET_USER(user);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.updateUserDialog = true;
    },
    async openDeleteUser(userId) {
      try {
        this.SET_LOADING(true);
        this.currentUserId = userId;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deleteUserDialog = true;
    },
    async openIndividualUser(userId) {
      try {
        this.SET_LOADING(true);
        const user = await this.GET_USER(userId);
        this.SET_USER(user);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.individualUserDialog = true;
    },
    async handleSubmitUser(user) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_USER(user);
        this.SHOW_SUCCESS_ALERT("El usuario se ha agregado");
        await this.getUsers();
        this.newUserDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdateUser(user) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_USER({user: user, id: this.USER.id});
        this.SHOW_SUCCESS_ALERT("El usuario se ha actualizado");
        await this.getUsers();
        this.updateUserDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeleteUser() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_USER(this.currentUserId);
        await this.getUsers();
        this.SHOW_SUCCESS_ALERT("El usuario ha sido eliminado");
        this.deleteUserDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    getVacationsAssignedByUser(vacations) {
      let vacationsAssignedByUser = new Map();
      vacations.forEach(vacation => {
        let lastHiringDate = this.setHiringDateToSpecifiedYear(vacation.date._seconds, 'subtract');
        let vacationDate = this.setHiringDateToSpecifiedYear(vacation.date._seconds);
        let currentHiringDate = this.setHiringDateToSpecifiedYear(vacation.date._seconds, 'current');
        let nextHiringDate = this.setHiringDateToSpecifiedYear(vacation.date._seconds, 'add');
        if(nextHiringDate > currentHiringDate && lastHiringDate < currentHiringDate) {
          if (this.currentDate > vacationDate) {
            vacationsAssignedByUser.set(vacation.uid, +vacation.availableDays);
          }
        }
      });
      return vacationsAssignedByUser;
    },
    async getUsers() {
      let users = await this.GET_USERS();
      let startDate = new Date((new Date().getFullYear() - 1), 0, 0).toISOString().slice(0, 10);
      let endDate = new Date((new Date().getFullYear() + 2), 11, 31).toISOString().slice(0, 10);
      const vacations = await this.GET_VACATIONS({startDate, endDate});
      const vacationsAssignedByUser = this.getVacationsAssignedByUser(vacations);
      this.usersExist = users.length >= 0;
      // redundant variable to force DOM update
      users.forEach((user, index) => {
        users[index].availableVacationDays = vacationsAssignedByUser.get(user.id);
      });
      
      this.users = users;
    },
    skeletonStyle(type, idx){
      let widthAndMarginRigth = '';
      
      switch(idx){
        case 1:
          type === 'width' ? 
            (this.isDesktopWidth ? widthAndMarginRigth = '5%' : widthAndMarginRigth = '10%') : 
            (this.isDesktopWidth ? widthAndMarginRigth = '5.8%' : this.sevenTwenty ? widthAndMarginRigth = '12.8%' : widthAndMarginRigth = '7%');
          break;
        case 2:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '5%' : widthAndMarginRigth = '10%' ) : 
          (this.isDesktopWidth ? widthAndMarginRigth = '3.3%' : this.sevenTwenty ? widthAndMarginRigth = '6.8%' : widthAndMarginRigth = '3%');
          break;
        case 3:
          type === 'width' ? 
          (this.isDesktopWidth ?  widthAndMarginRigth = '5%' : widthAndMarginRigth = '6%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '1.4%' : this.sevenTwenty ? widthAndMarginRigth = '8%' : widthAndMarginRigth = '3%');
          break;
        case 4:
          type === 'width' ? 
         (this.isDesktopWidth ? widthAndMarginRigth = '6%' : this.sevenTwenty ? widthAndMarginRigth = '8%' : widthAndMarginRigth = '12%') : 
         (this.isDesktopWidth ? widthAndMarginRigth = '14%' : this.sevenTwenty ? widthAndMarginRigth = '6%' : widthAndMarginRigth = '6%');
          break;
        case 5:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '2%' : this.sevenTwenty ? widthAndMarginRigth = '6%' : widthAndMarginRigth = '4%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '26.2%' : this.sevenTwenty ? widthAndMarginRigth = '5.4%' : widthAndMarginRigth = '19%');
          break;
        case 6:
          type === 'width' ? 
          (this.isDesktopWidth ? widthAndMarginRigth = '5%' : widthAndMarginRigth = '9%') : 
          (this.isDesktopWidth ? widthAndMarginRigth = '13.6%' : this.sevenTwenty ? widthAndMarginRigth = '2%' : widthAndMarginRigth = '4%');
          break;
        default: return;
      }
      return widthAndMarginRigth;
    },
  },
  async mounted() {
    try {
      this.SET_LOADING(true);
      await this.getUsers();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
      this.SET_LOADING(false);
    }
  }
};
</script>

<style>
.v-skeleton-loader__avatar{
  height: 30px;
  width: 30px;
}
</style>
