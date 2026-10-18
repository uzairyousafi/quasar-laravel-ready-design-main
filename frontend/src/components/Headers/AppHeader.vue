<template>
  <div class="m-header-wrap">
    <div
      class="m-header-bar row justify-between items-center"
      :class="[bg || '', glossy ? 'm-header-glossy' : '', flat ? 'm-header-bar--flat' : '']"
      :style="headerStyle"
    >
      <!-- ── Left: icon + title + subtitle + badge ── -->
      <div class="row items-center no-wrap col">

        <!-- Back / action icon button -->
        <q-btn
          v-if="icon || to"
          flat round dense
          :to="to"
          :icon="icon || 'arrow_back'"
          color="white"
          size="sm"
          class="q-ma-xs flex-shrink-0"
          @click="$emit('click')"
        >
          <q-tooltip v-if="iconTooltip">{{ iconTooltip }}</q-tooltip>
        </q-btn>

        <!-- Title block -->
        <div class="col q-ml-xs" style="min-width:0">
          <div class="row items-center no-wrap" style="gap:6px">
            <span class="m-header-title ellipsis">
              <slot></slot>
            </span>
            <!-- Badge -->
            <q-badge v-if="badge" :color="badgeColor || 'white'" :text-color="badgeTextColor || 'primary'"
              :label="badge" style="font-size:10px" />
            <!-- Count chip -->
            <q-chip v-if="count != null" dense :color="countColor || 'white'" :text-color="countTextColor || 'primary'"
              style="font-size:10px;height:18px" :label="String(count)" />
          </div>
          <!-- Subtitle -->
          <div v-if="subtitle" class="m-header-subtitle ellipsis">{{ subtitle }}</div>
        </div>
      </div>

      <!-- ── Right: search slot + extra slot + control button ── -->
      <div class="row items-center no-wrap flex-shrink-0" style="gap:4px">

        <!-- Custom search slot -->
        <slot name="search"></slot>

        <!-- Extra right-side buttons slot -->
        <slot name="actions"></slot>

        <!-- Refresh button (optional) -->
        <q-btn
          v-if="showRefresh"
          flat round dense icon="refresh" color="white" size="sm"
          class="q-ma-xs"
          @click="$emit('refresh')"
        >
          <q-tooltip>{{ $t ? $t('Refresh') : 'Refresh' }}</q-tooltip>
        </q-btn>

        <!-- Control room / settings button -->
        <q-btn
          v-show="controlRoomButton ? false : true"
          :round="!label2"
          color="white"
          :to="to2"
          :icon="icon2 || 'settings'"
          :label="label2"
          :text-color="btnTextColor || 'primary'"
          :size="buttonControlSize || 'sm'"
          :glossy="glossyBtn"
          :flat="flatBtn"
          :outline="outlineBtn"
          class="q-ma-xs"
          @click="$emit('click2')"
        >
          <q-tooltip v-if="btn2Tooltip">{{ btn2Tooltip }}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Navigation
  icon:             { type: String, default: null },
  to:               { type: String, default: null },
  iconTooltip:      { type: String, default: null },

  // Title / content
  subtitle:         { type: String, default: null },
  badge:            { type: String, default: null },
  badgeColor:       { type: String, default: null },
  badgeTextColor:   { type: String, default: null },
  count:            { default: null },
  countColor:       { type: String, default: null },
  countTextColor:   { type: String, default: null },

  // Background — pass a Quasar class like "bg-teal-7" OR leave empty to use theme CSS vars
  bg:               { type: String, default: null },

  // Style variants
  glossy:           { type: Boolean, default: true },
  flat:             { type: Boolean, default: false },
  dark:             { type: Boolean, default: false },  // force dark text (light bg)

  // Right-side control button
  to2:              { type: String, default: null },
  icon2:            { type: String, default: null },
  label2:           { type: String, default: null },
  btn2Tooltip:      { type: String, default: null },
  btnTextColor:     { type: String, default: null },
  buttonControlSize:{ type: String, default: null },
  controlRoomButton:{ default: null },

  // Control button variants
  glossyBtn:        { type: Boolean, default: false },
  flatBtn:          { type: Boolean, default: false },
  outlineBtn:       { type: Boolean, default: false },

  // Optional extras
  showRefresh:      { type: Boolean, default: false },
})

defineEmits(['click', 'click2', 'refresh'])

// If no `bg` class given, fall back to theme CSS variable gradient
const headerStyle = computed(() => {
  if (props.bg) return {}  // let the class handle it
  if (props.flat) return { background: 'transparent' }
  return {
    background: 'linear-gradient(135deg, var(--topbar-from, #0097a7) 0%, var(--topbar-to, #006064) 100%)'
  }
})
</script>

<style scoped>
.m-header-wrap {
  width: 100%;
}

.m-header-bar {
  width: 100%;
  border-radius: 8px;
  padding: 2px 8px;
  min-height: unset;
  position: relative;
  overflow: hidden;
}

/* Custom glossy overlay — sits on top via ::after so it never overrides our background gradient.
   Quasar's built-in .glossy uses background-image !important which kills CSS variable gradients. */
.m-header-glossy::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to bottom, rgba(255,255,255,.22), rgba(255,255,255,0) 50%, rgba(0,0,0,.08) 51%, rgba(0,0,0,.03));
  pointer-events: none;
  border-radius: inherit;
}

/* Subtle bottom separator when flat */
.m-header-bar--flat {
  border-bottom: 2px solid var(--sidebar-accent, #00acc1);
  border-radius: 8px 8px 0 0;
}

/* Title */
.m-header-title {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: .3px;
  font-family: poppins, sans-serif;
}

/* Subtitle */
.m-header-subtitle {
  color: rgba(255,255,255,.75);
  font-size: 11px;
  margin-top: 1px;
  letter-spacing: .2px;
}
</style>
