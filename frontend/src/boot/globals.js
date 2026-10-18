import { defineBoot } from '#q-app'
import { Notify, Dialog } from 'quasar'
import { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import { fmtDate, fmtDateTime } from '@/utils/date'

// Reusable components ported from the legacy app, registered globally under the
// same short aliases the old pages used so templates port over with minimal edits.
import AppHeader from '@/components/Headers/AppHeader.vue'
import ProgressButton from '@/components/Buttons/ProgressButton.vue'
import PageBackground from '@/components/general/PageBackground.vue'
import MainModal from '@/components/general/MainModal.vue'
import ModalHeader from '@/components/general/ModalHeader.vue'
import DataTable from '@/components/tables/DataTable.vue'
import NameField from '@/components/fields/NameField.vue'
import NameSimple from '@/components/fields/NameSimple.vue'
import SubmitButtons from '@/components/fields/SubmitButtons.vue'
import SelectAdd from '@/components/fields/SelectAdd.vue'
import ExportBtn from '@/components/general/ExportBtn.vue'
import ActionBar from '@/components/general/ActionBar.vue'
import ShamsiDatePicker from '@/components/general/ShamsiDatePicker.vue'
import ShortcutsPanel from '@/components/general/ShortcutsPanel.vue'

export default defineBoot(({ app }) => {
  const auth = useAuthStore()

  // Date formatting helpers available in all templates as $fmtDate / $fmtDateTime
  app.config.globalProperties.$fmtDate = fmtDate
  app.config.globalProperties.$fmtDateTime = fmtDateTime

  // Legacy global helpers
  app.config.globalProperties.$axios = api
  app.config.globalProperties.$api = api

  // Permission check (Super Admin bypasses, matching the store getter)
  app.config.globalProperties.$can = (permission) => {
    if (!permission) return true
    return auth.can(permission)
  }

  // Confirm + delete helper used as `this.$delete('resource/id')`
  app.config.globalProperties.$delete = (url, onDone) => {
    Dialog.create({
      title: 'Delete',
      message: 'Are you sure you want to delete this record?',
      cancel: true,
      persistent: true,
      ok: { label: 'Delete', color: 'negative', unelevated: true }
    }).onOk(async () => {
      try {
        await api.delete(`/${String(url).replace(/^\//, '')}`)
        Notify.create({ type: 'positive', position: 'top-right', icon: 'cloud_done', message: 'Deleted successfully' })
        if (typeof onDone === 'function') onDone()
      } catch (e) {
        Notify.create({ type: 'negative', message: e?.response?.data?.message || 'Delete failed' })
      }
    })
  }

  // Global component aliases (match legacy local names)
  app.component('m-header', AppHeader)
  app.component('progress-btn', ProgressButton)
  app.component('m-backgrounds', PageBackground)
  app.component('m-modal', MainModal)
  app.component('n-header', ModalHeader)
  app.component('n-table', DataTable)
  app.component('n-name', NameField)
  app.component('n-simple', NameSimple)
  app.component('n-submit', SubmitButtons)
  app.component('n-select-add', SelectAdd)
  app.component('export-btn', ExportBtn)
  app.component('action-bar', ActionBar)
  app.component('shamsi-date', ShamsiDatePicker)
  app.component('shortcuts-panel', ShortcutsPanel)
})
