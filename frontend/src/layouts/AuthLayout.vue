<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="auth-page">
        <div class="auth-split">

          <!-- LEFT PANEL — Branding & Features -->
          <div class="auth-left">
            <div class="auth-left__inner">

              <!-- Logo -->
              <div class="auth-logo">
                <div class="auth-logo__icon">
                  <brand-mark size="30" />
                </div>
                <div>
                  <div class="auth-logo__name">Aria Herat ERP</div>
                  <div class="auth-logo__tagline">Aria Herat Mohandes Zada — Construction ERP</div>
                </div>
              </div>

              <!-- Hero headline -->
              <div class="auth-headline">
                One system for every<br>project, site and shilling
              </div>
              <div class="auth-sub">
                Offline-first ERP for building construction and road building —<br>
                works on-site without internet, syncs everywhere.
              </div>

              <!-- Feature pills -->
              <div class="auth-features">
                <div class="auth-feat" v-for="f in features" :key="f.icon">
                  <div class="auth-feat__icon">
                    <q-icon :name="f.icon" size="16px" color="white" />
                  </div>
                  <span>{{ f.label }}</span>
                </div>
              </div>

              <!-- Live stats bar -->
              <div class="auth-stats">
                <div class="auth-stat" v-for="s in stats" :key="s.label">
                  <div class="auth-stat__val">{{ s.val }}</div>
                  <div class="auth-stat__lbl">{{ s.label }}</div>
                </div>
              </div>

              <!-- Business type bubbles -->
              <div class="auth-biz-row">
                <div class="auth-biz" v-for="b in bizTypes" :key="b">{{ b }}</div>
              </div>

            </div>

            <!-- Decorative circles -->
            <div class="auth-circle auth-circle--1"></div>
            <div class="auth-circle auth-circle--2"></div>
            <div class="auth-circle auth-circle--3"></div>
          </div>

          <!-- RIGHT PANEL — Router view (login / company-create) -->
          <div class="auth-right">
            <div class="auth-right__inner">
              <router-view />
            </div>
            <div class="auth-right__footer">
              © {{ new Date().getFullYear() }} Aria Herat Mohandes Zada · All rights reserved
            </div>
          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import BrandMark from '@/components/general/BrandMark.vue'

const features = [
  { icon: 'wifi_off',      label: 'Offline First — works without internet on-site' },
  { icon: 'business',      label: 'Multi-Branch & Multi-Company' },
  { icon: 'translate',     label: 'Multilingual — English, فارسی, پښتو' },
  { icon: 'domain',        label: 'Projects & Sites — coming next phase' },
  { icon: 'local_shipping',label: 'Procurement & Equipment — coming next phase' },
  { icon: 'bar_chart',     label: 'Executive Owner Dashboard' },
]

const stats = [
  { val: '∞',  label: 'Projects' },
  { val: '∞',  label: 'Sites' },
  { val: '∞',  label: 'Companies' },
  { val: '3',  label: 'Languages' },
]

const bizTypes = [
  'Building Construction', 'Road Building', 'Site Engineering',
  'Procurement', 'Equipment & Fleet', 'Executive Reporting',
]
</script>

<style scoped>
/* ── Page shell ─────────────────────────────────── */
.auth-page {
  min-height: 100vh;
  background: #F0F4F8;
}

.auth-split {
  display: grid;
  grid-template-columns: 1fr 420px;
  min-height: 100vh;
}
@media (max-width: 900px) {
  .auth-split { grid-template-columns: 1fr; }
  .auth-left { display: none; }
}

/* ── Left panel ─────────────────────────────────── */
.auth-left {
  background: linear-gradient(145deg, #0A1628 0%, #0D2B4E 40%, #123A66 70%, #8A5A1E 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-left__inner {
  position: relative;
  z-index: 2;
  max-width: 520px;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 48px;
}
.auth-logo__icon {
  width: 52px; height: 52px;
  background: rgba(255,255,255,.12);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,.2);
}
.auth-logo__name {
  font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.3px;
}
.auth-logo__tagline {
  font-size: 12px; color: rgba(255,255,255,.5); margin-top: 2px;
}

/* Headline */
.auth-headline {
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-bottom: 18px;
}
.auth-sub {
  font-size: 15px;
  color: rgba(255,255,255,.65);
  line-height: 1.65;
  margin-bottom: 36px;
}

/* Feature pills */
.auth-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}
.auth-feat {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255,255,255,.85);
}
.auth-feat__icon {
  width: 30px; height: 30px;
  background: rgba(255,255,255,.1);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Stats bar */
.auth-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  padding: 20px 24px;
  background: rgba(255,255,255,.08);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
}
.auth-stat__val {
  font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px;
}
.auth-stat__lbl {
  font-size: 11px; color: rgba(255,255,255,.5); margin-top: 2px;
}

/* Business type bubbles */
.auth-biz-row {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.auth-biz {
  padding: 5px 14px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 20px;
  font-size: 12px;
  color: rgba(255,255,255,.75);
}

/* Decorative circles */
.auth-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.06);
  pointer-events: none;
}
.auth-circle--1 { width: 400px; height: 400px; top: -120px; right: -120px; }
.auth-circle--2 { width: 280px; height: 280px; bottom: 40px; left: -80px; }
.auth-circle--3 { width: 180px; height: 180px; bottom: 160px; right: 40px; }

/* ── Right panel ────────────────────────────────── */
.auth-right {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  box-shadow: -4px 0 40px rgba(0,0,0,.08);
}
.auth-right__inner {
  width: 100%;
  max-width: 360px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-right__footer {
  font-size: 11px;
  color: #94A3B8;
  text-align: center;
  padding-top: 24px;
}
</style>
