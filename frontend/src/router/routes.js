const routes = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('@/pages/auth/LoginPage.vue') }
    ],
    meta: { guest: true }
  },
  {
    path: '/company/create',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'company-create', component: () => import('@/pages/company/CompanyCreate.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/company',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'company-switch', component: () => import('@/pages/company/CompanySwitchPage.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },

      // Users & Roles
      { path: 'users', name: 'users', component: () => import('@/pages/users/UsersPage.vue'), meta: { permission: 'user-list' } },
      { path: 'users/create', name: 'user-create', component: () => import('@/pages/users/UserForm.vue'), meta: { permission: 'user-create' } },
      { path: 'users/edit/:id', name: 'user-edit', component: () => import('@/pages/users/UserForm.vue'), meta: { permission: 'user-edit' } },
      { path: 'roles', name: 'roles', component: () => import('@/pages/roles/RolesPage.vue'), meta: { permission: 'role-list' } },
      { path: 'roles/create', name: 'role-create', component: () => import('@/pages/roles/RoleForm.vue'), meta: { permission: 'role-create' } },
      { path: 'roles/edit/:id', name: 'role-edit', component: () => import('@/pages/roles/RoleForm.vue'), meta: { permission: 'role-edit' } },

      // Branches (multi-branch)
      { path: 'branches', name: 'branches', component: () => import('@/pages/branches/BranchesPage.vue'), meta: { permission: 'branch-list' } },

      // System pages
      { path: 'backup', name: 'backup', component: () => import('@/pages/system/BackupPage.vue'), meta: { permission: 'backup-list' } },
      { path: 'log', name: 'log', component: () => import('@/pages/system/LogPage.vue'), meta: { permission: 'log-list' } },
      { path: 'trash', name: 'trash', component: () => import('@/pages/system/TrashPage.vue'), meta: { permission: 'trash-list' } },
      { path: 'notification', name: 'notification', component: () => import('@/pages/system/NotificationPage.vue') },
      { path: 'theme', name: 'theme', component: () => import('@/pages/system/ThemePage.vue') },
      { path: 'offline', name: 'offline', component: () => import('@/pages/system/OfflinePage.vue') },

      // Phase 2 module previews
      { path: 'coming-soon/:module', name: 'coming-soon', component: () => import('@/pages/ComingSoonPage.vue') },

      // Aliases matching the sidebar's legacy-style single-word URLs
      { path: 'user', name: 'user-alias', component: () => import('@/pages/users/UsersPage.vue') },
      { path: 'role', name: 'role-alias', component: () => import('@/pages/roles/RolesPage.vue') },
      { path: 'branch', name: 'branch-alias', component: () => import('@/pages/branches/BranchesPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
