<template>
  <q-page class="db-page">
    <!-- Hero Welcome Bar -->
    <div class="db-hero">
      <div class="db-hero__inner">
        <div>
          <div class="db-hero__greeting">{{ greeting }}, {{ userName }} 👋</div>
          <div class="db-hero__date">{{ todayLabel }}</div>
        </div>
        <q-btn flat round dense icon="refresh" color="white" class="db-hero__refresh" @click="load" :loading="loading">
          <q-tooltip>Refresh</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="db-content">

      <!-- ── KPI CARDS (Phase 2 modules — honestly zeroed) ── -->
      <div class="db-section-label">Executive Overview</div>
      <div class="db-kpi-grid">

        <div class="db-kpi-card db-kpi-card--hero">
          <div class="db-kpi-card__badge" style="background:rgba(255,255,255,.18)">
            <q-icon name="domain" size="22px" color="white" />
          </div>
          <div class="db-kpi-card__label">Active Projects</div>
          <div class="db-kpi-card__value">
            <q-skeleton v-if="loading" type="text" width="60px" class="db-skeleton--light" />
            <span v-else>{{ stats.active_projects }}</span>
          </div>
          <div class="db-kpi-card__trend db-kpi-card__trend--light">
            <q-icon name="info" size="14px" /> Coming in Phase 2
          </div>
        </div>

        <div class="db-kpi-card" style="--accent:#175A8C;--accent-bg:#EAF3FB">
          <div class="db-kpi-card__badge" style="background:#175A8C">
            <q-icon name="account_balance_wallet" size="20px" color="white" />
          </div>
          <div class="db-kpi-card__label">Total Contract Value</div>
          <div class="db-kpi-card__value db-kpi-card__value--colored" style="color:#175A8C">
            <q-skeleton v-if="loading" type="text" width="90px" />
            <span v-else>{{ fmt(stats.contract_value_total) }}</span>
          </div>
          <div class="db-kpi-card__trend text-grey-6">
            <q-icon name="info" size="14px" /> Coming in Phase 2
          </div>
        </div>

        <div class="db-kpi-card" style="--accent:#C8862D;--accent-bg:#FBF0DD">
          <div class="db-kpi-card__badge" style="background:#C8862D">
            <q-icon name="payments" size="20px" color="white" />
          </div>
          <div class="db-kpi-card__label">Collected This Month</div>
          <div class="db-kpi-card__value db-kpi-card__value--colored" style="color:#C8862D">
            <q-skeleton v-if="loading" type="text" width="90px" />
            <span v-else>{{ fmt(stats.collected_month) }}</span>
          </div>
          <div class="db-kpi-card__trend text-grey-6">
            <q-icon name="info" size="14px" /> Coming in Phase 2
          </div>
        </div>

        <div class="db-kpi-card" style="--accent:#7C3AED;--accent-bg:#F5F3FF">
          <div class="db-kpi-card__badge" style="background:#7C3AED">
            <q-icon name="request_quote" size="20px" color="white" />
          </div>
          <div class="db-kpi-card__label">Outstanding Balance</div>
          <div class="db-kpi-card__value db-kpi-card__value--colored" style="color:#7C3AED">
            <q-skeleton v-if="loading" type="text" width="90px" />
            <span v-else>{{ fmt(stats.outstanding_balance) }}</span>
          </div>
          <div class="db-kpi-card__trend text-grey-6">
            <q-icon name="info" size="14px" /> Coming in Phase 2
          </div>
        </div>
      </div>

      <!-- ── ENTITY CHIPS ROW ── -->
      <div class="db-section-label" style="margin-top:20px">Business Entities</div>
      <div class="db-entity-chips">
        <div class="db-entity-chip">
          <div class="db-entity-chip__icon" style="background:#EAF3FB">
            <q-icon name="store" size="20px" color="#175A8C" />
          </div>
          <div class="db-entity-chip__body">
            <div class="db-entity-chip__num">
              <q-skeleton v-if="loading" type="text" width="32px" inline />
              <span v-else>{{ stats.total_branches }}</span>
            </div>
            <div class="db-entity-chip__lbl">Branches / Sites</div>
          </div>
        </div>
        <div class="db-entity-chip db-entity-chip--muted">
          <div class="db-entity-chip__icon" style="background:#F1F5F9">
            <q-icon name="badge" size="20px" color="#94A3B8" />
          </div>
          <div class="db-entity-chip__body">
            <div class="db-entity-chip__num">{{ stats.total_employees }}</div>
            <div class="db-entity-chip__lbl">Employees <span class="db-entity-chip__soon">Phase 2</span></div>
          </div>
        </div>
        <div class="db-entity-chip db-entity-chip--muted">
          <div class="db-entity-chip__icon" style="background:#F1F5F9">
            <q-icon name="local_shipping" size="20px" color="#94A3B8" />
          </div>
          <div class="db-entity-chip__body">
            <div class="db-entity-chip__num">{{ stats.total_suppliers }}</div>
            <div class="db-entity-chip__lbl">Suppliers <span class="db-entity-chip__soon">Phase 2</span></div>
          </div>
        </div>
        <div class="db-entity-chip db-entity-chip--muted">
          <div class="db-entity-chip__icon" style="background:#F1F5F9">
            <q-icon name="precision_manufacturing" size="20px" color="#94A3B8" />
          </div>
          <div class="db-entity-chip__body">
            <div class="db-entity-chip__num">{{ stats.total_equipment }}</div>
            <div class="db-entity-chip__lbl">Equipment <span class="db-entity-chip__soon">Phase 2</span></div>
          </div>
        </div>
      </div>

      <!-- ── QUICK ACTIONS ── -->
      <div class="db-section-label" style="margin-top:20px">Quick Actions</div>
      <div class="db-quick-grid">
        <router-link v-for="a in quickActions" :key="a.to" :to="a.to" class="db-quick-card" :style="`--qa-color:${a.color}`">
          <div class="db-quick-card__icon"><q-icon :name="a.icon" size="22px" color="white" /></div>
          <div class="db-quick-card__label">{{ a.label }}</div>
        </router-link>
      </div>

      <!-- ── RECENT ACTIVITY ── -->
      <div class="db-section-label" style="margin-top:20px">Recent Activity</div>
      <div class="db-activity-card">
        <div class="db-activity-list">
          <div v-if="loading" v-for="n in 4" :key="n" class="db-activity-item">
            <q-skeleton type="circle" size="10px" class="q-mr-sm" />
            <q-skeleton type="text" width="80%" />
          </div>
          <div v-else-if="stats.recent_activity.length === 0" class="db-activity-empty">
            No activity yet — actions across Users, Roles and Branches will show up here.
          </div>
          <div v-else v-for="item in stats.recent_activity" :key="item.id" class="db-activity-item">
            <span class="db-activity-dot" :style="{ background: dotColor(item.action) }"></span>
            <div class="db-activity-body">
              <div class="db-activity-desc">{{ item.description }}</div>
              <div class="db-activity-date">{{ item.created_at_human || item.created_at }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { api } from '@/boot/axios'

const loading = ref(true)

const stats = reactive({
  active_projects: 0,
  contract_value_total: 0,
  collected_month: 0,
  outstanding_balance: 0,
  total_branches: 0,
  total_employees: 0,
  total_suppliers: 0,
  total_equipment: 0,
  recent_activity: [],
})

const quickActions = [
  { label: 'Manage Users',    icon: 'manage_accounts', to: '/user',          color: '#175A8C' },
  { label: 'Manage Roles',    icon: 'rule',            to: '/role',          color: '#123A66' },
  { label: 'Branches',        icon: 'store',           to: '/branch',        color: '#C8862D' },
  { label: 'Company',         icon: 'business',        to: '/company',       color: '#8A5A1E' },
  { label: 'Theme',           icon: 'palette',         to: '/theme',         color: '#7C3AED' },
  { label: 'Notifications',   icon: 'notifications',   to: '/notification',  color: '#0F766E' },
  { label: 'Backup',          icon: 'backup',          to: '/backup',        color: '#059669' },
  { label: 'Offline & Sync',  icon: 'wifi_off',        to: '/offline',       color: '#475569' },
]

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const userName = computed(() => {
  try { return JSON.parse(localStorage.getItem('user') || '{}').name || 'there' } catch { return 'there' }
})

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

function fmt(v) {
  return Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function dotColor(action) {
  return { created: '#059669', updated: '#F59E0B', deleted: '#DC2626' }[action] ?? '#94A3B8'
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get('dashboard_data')
    Object.assign(stats, {
      active_projects:      data.active_projects      ?? 0,
      contract_value_total: data.contract_value_total ?? 0,
      collected_month:      data.collected_month      ?? 0,
      outstanding_balance:  data.outstanding_balance   ?? 0,
      total_branches:       data.total_branches        ?? 0,
      total_employees:      data.total_employees       ?? 0,
      total_suppliers:      data.total_suppliers       ?? 0,
      total_equipment:      data.total_equipment       ?? 0,
      recent_activity:      data.recent_activity       ?? [],
    })
  } catch (_) {}
  finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
/* ─── Page shell ─────────────────────────────────── */
.db-page {
  background: #F8FAFC;
  min-height: 100vh;
}

/* ─── Hero bar ───────────────────────────────────── */
.db-hero {
  background: linear-gradient(135deg, #0A1628 0%, #123A66 55%, #8A5A1E 100%);
  padding: 28px 24px 24px;
}
.db-hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.db-hero__greeting {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}
.db-hero__date {
  font-size: 13px;
  color: rgba(255,255,255,.55);
  margin-top: 4px;
  font-weight: 400;
}
.db-hero__refresh { opacity: .7; }
.db-hero__refresh:hover { opacity: 1; }

/* ─── Main content ───────────────────────────────── */
.db-content {
  max-width: 1280px;
  margin: 0 auto 0;
  padding: 20px 16px 40px;
}

/* ─── Section label ──────────────────────────────── */
.db-section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94A3B8;
  margin-bottom: 10px;
}

/* ─── KPI grid ───────────────────────────────────── */
.db-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
@media (max-width: 1024px) { .db-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .db-kpi-grid { grid-template-columns: 1fr; } }

/* ─── KPI card ───────────────────────────────────── */
.db-kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 20px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
  position: relative;
  overflow: hidden;
  transition: box-shadow .18s, transform .18s;
}
.db-kpi-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
  transform: translateY(-1px);
}
.db-kpi-card--hero {
  background: linear-gradient(135deg, #123A66 0%, #175A8C 100%);
}
.db-kpi-card--hero .db-kpi-card__label { color: rgba(255,255,255,.75); }
.db-kpi-card--hero .db-kpi-card__value { color: #fff; font-size: 26px; }

.db-kpi-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-bottom: 14px;
}
.db-kpi-card__label {
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.db-kpi-card__value {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0F172A;
  line-height: 1.1;
  margin-bottom: 6px;
}
.db-kpi-card__trend {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
  color: #94A3B8;
}
.db-kpi-card__trend--light {
  color: rgba(255,255,255,.6);
}

:deep(.db-skeleton--light .q-skeleton) { background: rgba(255,255,255,.3); }

/* ─── Entity chips row ───────────────────────────── */
.db-entity-chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.db-entity-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
  flex: 1;
  min-width: 160px;
  transition: box-shadow .15s, transform .15s;
}
.db-entity-chip:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.09);
  transform: translateY(-1px);
}
.db-entity-chip--muted { opacity: .75; }
.db-entity-chip__icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.db-entity-chip__num {
  font-size: 20px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.3px;
  line-height: 1.1;
}
.db-entity-chip__lbl {
  font-size: 11px;
  color: #64748B;
  margin-top: 1px;
  font-weight: 500;
}
.db-entity-chip__soon {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 5px;
  border-radius: 4px;
  background: #F1F5F9;
  color: #94A3B8;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .3px;
}

/* ─── Quick actions ──────────────────────────────── */
.db-quick-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}
@media (max-width: 1024px) { .db-quick-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 600px)  { .db-quick-grid { grid-template-columns: repeat(2, 1fr); } }

.db-quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow .15s, transform .15s;
  border-top: 3px solid var(--qa-color, #175A8C);
}
.db-quick-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); transform: translateY(-2px); }
.db-quick-card__icon {
  width: 40px; height: 40px;
  background: var(--qa-color, #175A8C);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.db-quick-card__label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  text-align: center;
  line-height: 1.3;
}

/* ─── Activity card ──────────────────────────────── */
.db-activity-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
  overflow: hidden;
}
.db-activity-list {
  padding: 8px 0;
}
.db-activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 18px;
  border-bottom: 1px solid #F8FAFC;
  transition: background .12s;
}
.db-activity-item:last-child { border-bottom: none; }
.db-activity-item:hover { background: #FAFBFE; }
.db-activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.db-activity-body { flex: 1; min-width: 0; }
.db-activity-desc {
  font-size: 12.5px;
  color: #334155;
}
.db-activity-date {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 1px;
}
.db-activity-empty {
  text-align: center;
  padding: 32px 16px;
  color: #94A3B8;
  font-size: 13px;
}
</style>
