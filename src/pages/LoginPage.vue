<template>
  <q-page class="flex flex-center bg-primary">
    <q-card class="q-pa-xl shadow-10">
      <q-card-section class="full-width">
        <div class="text-h4 text-weight-bold text-center q-mb-xl">Gajoy Workspace</div>

        <q-form @submit="onSubmit" class="full-width q-gutter-md">
          <q-input
            v-model="accessCode"
            :type="isPwd ? 'password' : 'text'"
            label="Access Code"
            :rules="[(val) => !!val || 'Access code is required']"
            outlined
            bg-color="grey-2"
            class="q-mb-md full-width"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="secondary"
            class="full-width q-mt-lg"
            :loading="loading"
            label="Entrar"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showError">
      <q-card>
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Error</div>
        </q-card-section>

        <q-card-section class="q-pt-md"> Invalid access code. Please try again. </q-card-section>

        <q-card-actions>
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const adminStore = useAdminStore()
const $q = useQuasar()

const accessCode = ref('')
const isPwd = ref(true)
const showError = ref(false)
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  try {
    const isValid = await adminStore.validateAccess(accessCode.value)
    if (isValid) {
      localStorage.setItem('isAuthenticated', 'true')
      $q.notify({
        type: 'positive',
        message: 'Bem vindo Gajoy!',
      })

      router.push({ name: 'dashboard' })
    } else {
      showError.value = true
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Um erro aconteceu. Por favor, tente novamente.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
