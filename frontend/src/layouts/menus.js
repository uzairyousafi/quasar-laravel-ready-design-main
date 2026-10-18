export const menus = [
  {
    room: 'Dashboard',
    permission: 'dashboard-list',
    icon: 'mdi-monitor-dashboard',
    name: 'Dashboard',
    status: true,
    color: 'blue',
    url: '/',
    is_sub: []
  },
  {
    room: 'ControlPanel',
    permission: 'dashboard-list',
    icon: 'settings_suggest',
    name: 'ControlPanel',
    status: true,
    color: 'blue',
    url: null,
    is_sub: [
      { room: 'User', permission: 'user-list', icon: 'manage_accounts', name: 'User', status: true, color: 'black', url: '/user', add_url: '/users/create', is_sub: [] },
      { room: 'Role', permission: 'role-list', icon: 'rule', name: 'UserRole', status: true, color: 'black', url: '/role', add_url: '/roles/create', is_sub: [] },
      { room: 'Branch', permission: 'branch-list', icon: 'store', name: 'Branch', status: true, color: 'black', url: '/branch', add_url: null, is_sub: [] }
    ]
  },

  // ── Phase 2 preview — nav items point at ComingSoonPage until the real
  //    modules from the client's proposal (Parts A–D) ship. ──
  { room: 'ProjectsSites', permission: 'dashboard-list', icon: 'domain', name: 'ProjectsAndSites', status: true, color: 'blue-grey', url: '/coming-soon/projects', is_sub: [] },
  { room: 'FinanceAccounting', permission: 'dashboard-list', icon: 'account_balance_wallet', name: 'FinanceAndAccounting', status: true, color: 'blue-grey', url: '/coming-soon/finance', is_sub: [] },
  { room: 'ProcurementAssets', permission: 'dashboard-list', icon: 'local_shipping', name: 'ProcurementAndAssets', status: true, color: 'blue-grey', url: '/coming-soon/procurement', is_sub: [] },
  { room: 'HRPayroll', permission: 'dashboard-list', icon: 'badge', name: 'HRAndPayroll', status: true, color: 'blue-grey', url: '/coming-soon/hr', is_sub: [] },

  { room: 'Backup', permission: 'backup-list', icon: 'backup', name: 'Backup', status: true, color: 'blue', url: '/backup', is_sub: [] },
  { room: 'Log', permission: 'log-list', icon: 'visibility', name: 'Log', status: true, color: 'blue', url: '/log', is_sub: [] },
  { room: 'Trashes', permission: 'trash-list', icon: 'auto_delete', name: 'Trashes', status: true, color: 'blue', url: '/trash', is_sub: [] },
  { room: 'Notification', permission: 'dashboard-list', icon: 'notifications', name: 'Notification', status: true, color: 'blue', url: '/notification', is_sub: [] },
  { room: 'Theme', permission: 'dashboard-list', icon: 'palette', name: 'ThemeAppearance', status: true, color: 'teal', url: '/theme', is_sub: [] },
  { room: 'OfflineSync', permission: 'dashboard-list', icon: 'wifi_off', name: 'OfflineSync', status: true, color: 'teal', url: '/offline', is_sub: [] },

  { room: 'Templates', permission: 'dashboard-list', icon: 'mdi-logout', name: 'Logout', status: true, color: 'blue', url: '', is_sub: [] }
]
