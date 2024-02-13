<template>
  <v-app>
    <v-app-bar
        app
        :color="$vuetify.breakpoint.xs ? 'primary' : 'white'"
        :style="$vuetify.breakpoint.xs ? {'height': '74px'} : {'left': '80px'}"
        :class="$vuetify.breakpoint.xs ? 'top-app-bar-mobile' : ''"
    >

     <v-row :class="$vuetify.breakpoint.xs ? 'justify-space-between align-center' : 'd-flex flex-fill align-center'"
             style="width: 100%; height: 64px; flex-wrap: nowrap;">
        <div v-if="$vuetify.breakpoint.xs" >
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
        </div>

        <v-col :class="$vuetify.breakpoint.xs ? 'module-name-mobile' : ''" >
          <h2 :class="$vuetify.breakpoint.xs ? 'route-name-mobile' : ''">{{ currentRouteName }}</h2>
        </v-col>

        <div class="avatar-container d-flex align-center" :style="{'min-width': $vuetify.breakpoint.xs  ? '0' : '224px'}" v-if="user">
          <v-menu
              bottom
              min-width="280px"
              offset-y
              rounded
          >
            <template v-slot:activator="{ on }" >
              <div class="d-flex pointer" v-on="on" style="width: 100%">
                <v-btn
                    icon
                    x-large
                >
                <v-avatar
                      v-if="user.avatar"
                      color="primary"
                      size="38">
                      <v-img
                       class="rounded"
                       :src="user.avatar"
                       cover></v-img>
                  </v-avatar>
                  <v-avatar v-else
                      color="primary"
                      size="38">
                    <span class="white--text text-subtitle-1">{{ avatarInitial }}</span>
                  </v-avatar>
                </v-btn>


                <div class="d-flex flex-column mt-1" style="max-width: 240px" v-if="!$vuetify.breakpoint.xs">
                  <div class="subtitle-1 text-truncate font-weight-black">{{ fullName }}</div>
                  <div style="line-height: 10px; color:#95999a" class="caption"> {{ currentUserRole }}</div>
                </div>
              </div>

            </template>

            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <v-avatar
                      v-if="user.avatar"
                      class='mb-2'
                      color="primary"
                  >
                    <v-img
                        class="rounded"
                        :src="user.avatar"
                        cover></v-img>
                    </v-avatar>
                    <v-avatar
                    v-else
                      class='mb-2'
                      color="primary"
                  >
                    <span class="white--text text-h5 white--text">{{ avatarInitial }}</span>
                  </v-avatar>
                  <h3>{{ fullName }}</h3>
                  <p class="text-caption mt-1">
                    {{ user ? user.email : "" }}
                  </p>
                  <v-divider class="my-3"></v-divider>

                  <v-btn
                      depressed
                      rounded
                      text
                      @click="logout()"
                  >
                    Cerrar sesión
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </div>
        <v-sheet v-else style="margin: 0"  :class="$vuetify.breakpoint.xs ? 'mobileDisplay' : ''">
          <div class="d-flex" style="border-radius: 12px; height: 50px">
                 <v-skeleton-loader id="avatar_sk_id" type="avatar"></v-skeleton-loader>
                 <v-skeleton-loader id="two_lines_sk_id" type="list-item-two-line" style="width: 180px;
                                    background-color: primary;"  v-if="!$vuetify.breakpoint.xs">
                 </v-skeleton-loader>
          </div>
        </v-sheet>
      </v-row>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-navigation-drawer
        app
        color="#09151E"
        :permanent="!$vuetify.breakpoint.xs"
        style="width: 80px;"
        v-if="!$vuetify.breakpoint.xs"
      >

        <v-list dense
                nav
                style="height: 100%; position: relative">
          <v-list-item link to="dashboard">
            <img src="../assets/PieLogo.svg" alt="Bingsu Logo" :class="$vuetify.breakpoint.xs ? 'mt-0' : 'mt-2'">
          </v-list-item>

          <v-list-item-group v-model="selectedItem" color="white"
                            style="margin: 0 6px; align-items:center; flex: 100%; position: absolute; top: 50%; transform: translateY(-50%);">
            <v-list-item
                v-for="route in userRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                replace>
              <v-tooltip right
                        nudge-right="24"
                        color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-content v-bind="attrs"
                                      v-on="on">
                    <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                  </v-list-item-content>
                </template>
                <span style="font-size: 1rem">{{route.text}}</span>
              </v-tooltip>
            </v-list-item>

            <v-list-item
                v-for="route in maintainerRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                replace>
              <v-tooltip right
                        nudge-right="24"
                        color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-content v-bind="attrs"
                                      v-on="on">
                    <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                  </v-list-item-content>
                </template>
                <span style="font-size: 1rem">{{route.text}}</span>
              </v-tooltip>
            </v-list-item>

            <v-list-item
                v-for="route in adminRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                replace>
              <v-tooltip right
                        nudge-right="24"
                        color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-content v-bind="attrs"
                                      v-on="on">
                    <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                  </v-list-item-content>
                </template>
                <span style="font-size: 1rem">{{route.text}}</span>
              </v-tooltip>
            </v-list-item>

            <v-list-item
                v-for="route in humanResourcesRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                replace>
              <v-tooltip right
                        nudge-right="24"
                        color="primary">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-content v-bind="attrs"
                                      v-on="on">
                    <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                  </v-list-item-content>
                </template>
                <span style="font-size: 1rem">{{route.text}}</span>
              </v-tooltip>
            </v-list-item>

          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer
      v-if="$vuetify.breakpoint.xs"
          v-model="drawer"
          :class="$vuetify.breakpoint.xsOnly ? 'mobile-size' : ''"
          absolute
          location="bottom"
          temporary
          color="primary"
        >
        <v-list dense nav>
          <v-list-item-group v-model="selectedItem"
                class="mt-12">
            <v-list-item
                v-for="route in userRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                class="my-3"
                replace>
                <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                <span class="ml-4" style="font-size: 1rem; color: white">{{route.text}}</span>
            </v-list-item>

            <v-list-item
                v-for="route in maintainerRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                class="my-3"
                replace>
                <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                <span class="ml-4" style="font-size: 1rem; color: white">{{route.text}}</span>
            </v-list-item>

            <v-list-item
                v-for="route in adminRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                class="my-3"
                replace>
                <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                <span class="ml-4" style="font-size: 1rem; color: white">{{route.text}}</span>
            </v-list-item>

            <v-list-item
                v-for="route in humanResourcesRoutes"
                v-show="authService.user && authService.checkRoles(route.roles)"
                :key="route.link"
                :to="route.link"
                class="my-3"
                replace>
                <img :src="route.svg" alt="route icon" style="width: 28px; height: 28px">
                <span class="ml-4" style="font-size: 1rem; color: white">{{route.text}}</span>
            </v-list-item>

          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-main class="grey lighten-3"
              :style="$vuetify.breakpoint.xs ? {'padding': '78px 0 0 0'} : {'padding': '80px 0 0 80px'}">
        <v-container :class="$vuetify.breakpoint.xs ? 'container-mobile' : ''">
          <v-row class="no-gutters">
            <v-col>
              <div style="min-height: 70vh">
                <div v-if="userRole === null"></div>
                <router-view v-else-if="$vuetify.breakpoint.mdAndUp || userRole === 'admin' || userRole === 'maintainer' || userRole === 'human_resources'"
                ></router-view>
                <UserMobileView v-else-if="$vuetify.breakpoint.xs && userRole === 'user'"></UserMobileView>
              </div>
            </v-col>
          </v-row>
        </v-container>

      </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapMutations} from "vuex";
import authService from "@/services/auth";
import UserMobileView from './UserMobileView.vue';

export default {
  name: 'HomeView',
  components: {UserMobileView},
  methods: {
    async logout() {
      await authService.logout();
      await this.$router.push({path: '/login'});
    },
    ...mapMutations(['SHOW_ERROR_ALERT', "SET_LOADING"]),
    ...mapActions([
      'GET_USER',
    ]),
  },
  computed: {
    currentRouteName() {
      if (this.$route.name.includes('Dashboard')) {
        return "Dashboard";
      } else if (this.$route.name.includes('Users')) {
        return "Usuarios";
      } else if (this.$route.name.includes('Transactions')) {
        return "Transacciones";
      } else if (this.$route.name.includes('BusinessCard')) {
        return "Tarjeta Empresarial";
      } else if (this.$route.name.includes('Permissions')) {
        return "Permisos / Vacaciones";
      } else if (this.$route.name.includes('Payrolls')) {
        return "Nóminas";
      } else if (this.$route.name.includes("Contracts")) {
        return "Contratos";
      } else if(this.$route.name.includes("Attendances")){
        return "Asistencia";
      } else if (this.$route.name.includes("Attendance")) {
        return "Asistencia";
      } else if (this.$route.name.includes("Article")) {
        return "Activo Fijo";
      } else if (this.$route.name.includes("Help")) {
        return "FAQ";
      } else {
        return this.$route.name;
      }
    },
    avatarInitial() {
      return this.user ? this.user.name.charAt(0).toUpperCase() : "";
    },
    fullName() {
      return this.user ? this.user.name + ' ' + this.user.firstLastName : "";
    },
    currentUserRole() {
      if (authService.user) {
        switch (this.userRole) {
          case 'admin':
            return 'Admin';
          case 'user':
            return 'User';
          case 'maintainer':
            return 'Maintainer';
          case 'human_resources':
            return 'Human Resources'
          default:
            return 'User';
        }
      }
      return 'User';
    }
  },
  data: () => {
    return {
      user: null,
      authService: authService,
      selectedItem: 0,
      userRole: null,
      drawer: false,
      adminRoutes: [
        /*{
          text: 'Inicio',
          link: '/admin/dashboard',
          roles: ['admin', 'human_resources'],
        }, */
        {
          text: 'Dashboard',
          link: '/admin/dashboard',
          roles: ['admin'],
          svg: require('../assets/home_icon.svg')
        },
        {
          text: 'Usuarios',
          link: '/admin/users',
          roles: ['admin'],
          svg: require('../assets/users_icon.svg')
        },
        {
          text: 'Transacciones',
          link: '/admin/transactions',
          roles: ['admin'],
          svg: require('../assets/transacciones_icon.svg')
        },
        {
          text: 'Permisos',
          link: '/admin/permissions',
          roles: ['admin'],
          svg: require('../assets/permission_icon.svg')
        },
        {
          text: 'Nóminas',
          link: '/admin/payrolls',
          roles: ['admin'],
          svg: require('../assets/payroll_icon.svg')
        },
        {
          text: 'Tarjeta empresarial',
          link: '/admin/expenses',
          roles: ['admin'],
          svg: require('../assets/card_icon.svg')
        },
        {
          text: 'Asistencia',
          link: '/admin/attendance',
          roles: ['admin'],
          svg: require('../assets/assistance_icon.svg')
        },
        {
          text: 'Activo Fijo',
          link: '/admin/article',
          roles: ['admin'],
          svg: require('../assets/inventory_icon.svg')
        },
        {
          text: 'Ayuda',
          link: '/admin/help',
          roles: ['admin'],
          svg: require('../assets/help_icon.svg')
        },
        // {
        //   text: 'Contratos',
        //   link: '/admin/contracts',
        //   roles: ['admin', 'human_resources'],
        //   svg: require('../assets/contratos_icon.svg')
        // },
      ],
      userRoutes: [
        /* {
           text: 'Inicio',
           link: '/user/dashboard',
           roles: ['user']
         }, */
         {
          text: 'Dashboard',
          link: '/user/dashboard',
          roles: ['user'],
          svg: require('../assets/home_icon.svg')
        },
        {
          text: 'Mis transacciones',
          link: '/user/transactions',
          roles: ['user'],
          svg: require('../assets/transacciones_icon.svg')
        },
        {
          text: 'Mis permisos',
          link: '/user/permissions',
          roles: ['user'],
          svg: require('../assets/permission_icon.svg')
        },
        {
          text: 'Mis nóminas',
          link: '/user/payrolls',
          roles: ['user'],
          svg: require('../assets/payroll_icon.svg')
        },
        {
          text: 'Tarjeta empresarial',
          link: '/user/expenses',
          roles: ['user'],
          svg: require('../assets/card_icon.svg')
        },
        {
          text: 'Asistencia',
          link: '/user/attendance',
          roles: ['user'],
          svg: require('../assets/assistance_icon.svg')
        },
        {
          text: 'Ayuda',
          link: '/user/help',
          roles: ['user'],
          svg: require('../assets/help_icon.svg')
        },
      ],
      maintainerRoutes: [
        {
          text: 'Dashboard',
          link: '/maintainer/dashboard',
          roles: ['maintainer'],
          svg: require('../assets/home_icon.svg')
        },
         {
          text: 'Usuarios',
          link: '/maintainer/users',
          roles: ['maintainer'],
          svg: require('../assets/users_icon.svg')
        },
        {
          text: 'Transacciones',
          link: '/maintainer/transactions',
          roles: ['maintainer'],
          svg: require('../assets/transacciones_icon.svg')
        },
        {
          text: 'Permisos',
          link: '/maintainer/permissions',
          roles: ['maintainer'],
          svg: require('../assets/permission_icon.svg')
        },
        {
          text: 'Nóminas',
          link: '/maintainer/payrolls',
          roles: ['maintainer'],
          svg: require('../assets/payroll_icon.svg')
        },
        {
          text: 'Tarjeta empresarial',
          link: '/maintainer/expenses',
          roles: ['maintainer'],
          svg: require('../assets/card_icon.svg')
        },
        {
          text: 'Asistencia',
          link: '/maintainer/attendance',
          roles: ['maintainer'],
          svg: require('../assets/assistance_icon.svg')
        },
        {
          text: 'Activo Fijo',
          link: '/maintainer/article',
          roles: ['maintainer'],
          svg: require('../assets/inventory_icon.svg')
        },
        {
          text: 'Ayuda',
          link: '/maintainer/help',
          roles: ['maintainer'],
          svg: require('../assets/help_icon.svg')
        },
      ],
      humanResourcesRoutes: [
        {
          text: 'Dashboard',
          link: '/human_resources/dashboard',
          roles: ['human_resources'],
          svg: require('../assets/home_icon.svg')
        },
        {
          text: 'Usuarios',
          link: '/human_resources/users',
          roles: ['human_resources'],
          svg: require('../assets/users_icon.svg')
        },
        {
          text: 'Permisos',
          link: '/human_resources/permissions',
          roles: ['human_resources'],
          svg: require('../assets/permission_icon.svg')
        },
        {
          text: 'Nóminas',
          link: '/human_resources/payrolls',
          roles: ['human_resources'],
          svg: require('../assets/payroll_icon.svg')
        },
        {
          text: 'Asistencia',
          link: '/human_resources/attendance',
          roles: ['human_resources'],
          svg: require('../assets/assistance_icon.svg')
        },
        {
          text: 'Activo Fijo',
          link: '/human_resources/article',
          roles: ['human_resources'],
          svg: require('../assets/inventory_icon.svg')
        },
        {
          text: 'Ayuda',
          link: '/human_resources/help',
          roles: ['human_resources'],
          svg: require('../assets/help_icon.svg')
        },
      ]
    }
  },

  async mounted() {
    try {
      this.SET_LOADING(true);
      this.user = await this.GET_USER(authService.user.uid);
      this.userRole = await authService.getRole();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.message);
    } finally {
      this.SET_LOADING(false);
    }
  },
}
</script>

<style>

.v-list--nav .v-list-item{
  padding: 4px 12px !important;
}
#two_lines_sk_id .v-skeleton-loader__list-item-two-line {
  height: 52px !important;
  padding-left: 6px !important;
}

#two_lines_sk_id .v-skeleton-loader__sentences .v-skeleton-loader__text:nth-child(2){
  max-width: 32%;
}

#two_lines_sk_id .v-skeleton-loader__text{
  max-width: 88%;
}

#avatar_sk_id .v-skeleton-loader__avatar{
  width: 38px;
  height: 38px;
}

#avatar_sk_id{
  margin-top: 6px;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.mobileDisplay {
  background-color: #09151E !important;
  padding-right: 5px;
  padding-left: 9px;
}

.top-app-bar-mobile .v-toolbar__content{
height: 74px !important;
}

.module-name-mobile {
  flex-grow: 0 !important;
}

.route-name-mobile {
  color: white;
  white-space: nowrap;
  font-size: 1.25rem;
}

.container-mobile {
  padding: 18px !important;
}

.row {
  margin: 0 !important;
}

.v-btn--outlined {
  border-width: 1.5px;
}

.mobile-size .v-list-item-group .v-list-item--active {
  background-color: #263138;
}

@media only screen and (max-width: 600px) {
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
