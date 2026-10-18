<template>
  <q-page>
    <m-backgrounds>
      <div class="row my_radio_less q-pa-sm">
        <div class="col-12">
          <m-header icon="badge" controlRoomButton="false" class="q-mt-xs">
            {{ $t('Roles') }}
          </m-header>
        </div>

        <action-bar
          :rows="rows"
          :columns="columns"
          filename="roles"
          create-perm="role-create"
          @add="openCreate"
          @update:filtered="filteredRows = $event"
        />
        <div class="col-12">
          <n-table
            :loading="loading"
            :data="rows"
            :columns="columns"
            v-model:filter="tableFilter"
            :can_edit="'role-edit'"
            :can_delete="'role-delete'"
            @edit="openEdit"
            @del="remove"
          >
          </n-table>
        </div>
      </div>
    </m-backgrounds>
  </q-page>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'

const { proxy } = getCurrentInstance()
const router = useRouter()

const rows = ref([])
const loading = ref(false)
const tableFilter = ref('')
const filteredRows = ref([])

const columns = [
  { name: 'created_at', label: '#', field: 'id', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'permissions', label: 'Permissions', field: row => (row.permissions?.length ?? 0) + ' permissions', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

async function load () {
  loading.value = true
  try {
    const { data } = await api.get('/roles')
    rows.value = data
  } finally {
    loading.value = false
  }
}

function openCreate () {
  router.push('/roles/create')
}

function openEdit (id) {
  router.push(`/roles/edit/${id}`)
}

function remove (id) {
  proxy.$delete(`roles/${id}`, load)
}

onMounted(load)
</script>
