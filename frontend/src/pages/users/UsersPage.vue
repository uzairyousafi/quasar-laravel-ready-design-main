<template>
  <q-page>
    <m-backgrounds>
      <div class="row my_radio_less q-pa-sm">
        <div class="col-12">
          <m-header icon="people" controlRoomButton="false" class="q-mt-xs">
            {{ $t('Users') }}
          </m-header>
        </div>

        <action-bar
          :rows="rows"
          :columns="columns"
          filename="users"
          create-perm="user-create"
          @add="openCreate"
          @update:filtered="filteredRows = $event"
        />
        <div class="col-12">
          <n-table
            :loading="loading"
            :data="rows"
            :columns="columns"
            v-model:filter="filter"
            :can_edit="'user-edit'"
            :can_delete="'user-delete'"
            @edit="openEdit"
            @del="remove"
          >
            <template v-slot:body-cell-roles="props">
              <q-td :props="props">
                <q-chip v-for="r in props.row.roles" :key="r.id" size="sm" color="primary" text-color="white">
                  {{ r.name }}
                </q-chip>
              </q-td>
            </template>
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
const filteredRows = ref([])
const loading = ref(false)
const filter = ref('')

const columns = [
  { name: 'created_at', label: '#', field: 'id', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'roles', label: 'Roles', field: 'roles', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

async function load () {
  loading.value = true
  try {
    const { data } = await api.get('/users')
    rows.value = data
  } finally {
    loading.value = false
  }
}

function openCreate () {
  router.push('/users/create')
}

function openEdit (id) {
  router.push('/users/edit/' + id)
}

function remove (id) {
  proxy.$delete('users/' + id, load)
}

onMounted(load)
</script>
