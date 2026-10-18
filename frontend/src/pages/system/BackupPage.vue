<template>
  <q-page>
    <m-backgrounds>
      <div class="row my_radio_less q-pa-sm">
        <div class="col-12">
          <m-header icon="backup" controlRoomButton="false" class="q-mt-xs">
            {{ $t('Backup') }}
          </m-header>
        </div>
        <div class="col-12 q-mt-md">
          <q-card class="my_radio_less">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Database Backup</div>
              <div class="text-body2 text-grey-7 q-mb-md">Download a complete backup of your company data.</div>
              <progress-btn color="cyan-7" icon="cloud_download" :loading="loading" @click="download">
                {{ $t('Download') }} Backup
              </progress-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </m-backgrounds>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'
const loading = ref(false)
async function download() {
  loading.value = true
  try {
    await api.get('/backup/download')
    Notify.create({ type: 'positive', message: 'Backup requested successfully' })
  } catch (e) {
    Notify.create({ type: 'negative', message: e?.response?.data?.message || 'Backup failed' })
  } finally { loading.value = false }
}
</script>
