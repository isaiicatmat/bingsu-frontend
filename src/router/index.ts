import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import authService, {IToken} from "@/services/auth";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import jwt_decode from 'jwt-decode';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    component: HomeView,
    beforeEnter: homeGuard,
    children: [
      {
        path: 'admin/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/dashboard',
        name: 'HumanResourcesDashboard',
        component: DashboardView,
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/dashboard',
        name: 'UsuarioDashboard',
        component: DashboardView,
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/dashboard',
        name: 'MaintainerDashboard',
        component: DashboardView,
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('../views/UsersView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/users',
        name: 'HumanResourcesUsers',
        component: () => import('../views/UsersView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/users',
        name: 'MaintainerUsers',
        component: () => import('../views/UsersView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/transactions',
        name: 'AdminTransactions',
        component: () => import('../views/TransactionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/transactions',
        name: 'MaintainerTransactions',
        component: () => import('../views/TransactionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/expenses',
        name: 'AdminBusinessCard',
        component: () => import('../views/ExpensesView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/expenses',
        name: 'BusinessCard',
        component: () => import('../views/ExpensesView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/permissions',
        name: 'AdminPermissions',
        component: () => import('../views/PermissionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/payrolls',
        name: 'AdminPayrolls',
        component: () => import('../views/PayrollsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/permissions',
        name: 'HumanResourcesPermissions',
        component: () => import('../views/PermissionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/payrolls',
        name: 'HumanResourcesPayrolls',
        component: () => import('../views/PayrollsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/permissions',
        name: 'Permissions',
        component: () => import('../views/PermissionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/payrolls',
        name: 'Payrolls',
        component: () => import('../views/PayrollsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/contracts',
        name: 'AdminContracts',
        component: () => import('../views/ContractsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/contracts',
        name: 'Contracts',
        component: () => import('../views/ContractsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/help',
        name: 'AdminHelp',
        component: () => import('../views/HelpView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/help',
        name: 'HumanResourcesHelp',
        component: () => import('../views/HelpView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/help',
        name: 'Help',
        component: () => import('../views/HelpView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/transactions',
        name: 'UsuarioTransactions',
        component: () => import('../views/UserTransactionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/expenses',
        name: 'UsuarioBusinessCard',
        component: () => import('../views/UserExpensesView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/permissions',
        name: 'UsuarioPermissions',
        component: () => import('../views/UserPermissionsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/payrolls',
        name: 'UsuarioPayrolls',
        component: () => import('../views/UserPayrollsView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/attendance',
        name: 'AdminAttendance',
        component: () => import('../views/AdminAttendanceView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'human_resources/attendance',
        name: 'HumanResourcesAttendance',
        component: () => import('../views/AdminAttendanceView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/attendance',
        name: 'MaintainerAttendance',
        component: () => import('../views/AdminAttendanceView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/attendance',
        name: 'UsuarioAttendance',
        component: () => import('../views/UserAttendanceView.vue'),
        beforeEnter:  async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']),
          await authGuard(to, from, next);
        }
      },
      {
        path: 'admin/article',
        name: 'AdminArticle',
        component: () => import('../views/ArticleView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['admin']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'maintainer/article',
        name: 'MaintainerArticle',
        component: () => import('../views/ArticleView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['maintainer']);
          await authGuard(to, from, next);
        }
      },
      
      {
        path: 'human_resources/article',
        name: 'HumanResourcesArticle',
        component: () => import('../views/ArticleView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['human_resources']);
          await authGuard(to, from, next);
        }
      },
      {
        path: 'user/help',
        name: 'UsuarioHelp',
        component: () => import('../views/HelpView.vue'),
        beforeEnter: async (to, from, next) => {
          await checkRoleGuard(to, from, next, ['user']);
          await authGuard(to, from, next);
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: loginGuard
  },
]

async function authGuard(to: any, from: any, next: any) {
  const user = authService.user;
  if (user) {
    next();
  } else {
    next('/login');
  }
}

async function homeGuard(to: any, from: any, next: any) {
  const user = authService.user;
  if (user) {
    if (to.path === '/') {
      const role = await authService.getRole();
      next(`/${role}/dashboard`);
    } else {
      next();
    }
  } else {
    next('/login');
  }
}


async function checkRoleGuard(to: any, from: any, next: any, role: string[]) {
  const token = await authService.getToken() ?? '';
  const decodedToken: IToken = jwt_decode(token);
  if (token !== '' && role.includes(decodedToken.role)) {
    next();
  } else {
    const role = await authService.getRole();
    next(`${role}/dashboard`);
  }
}

async function loginGuard(to: any, from: any, next: any) {
  const user = authService.user;
  if (to.name === 'Login' && user) {
    const role = await authService.getRole();
    next(`${role}/dashboard`);
  } else {
    next();
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
