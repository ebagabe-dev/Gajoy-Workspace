<template>
  <q-page class="login-page flex flex-center">
    <q-card class="login-card q-pa-lg">
      <q-card-section class="text-center">
        <img
          src="~assets/gajoy-logo.png"
          alt="Gajoy Logo"
          class="q-mb-md"
          style="width: 150px; border-radius: 50%"
        />
        <div class="text-h4 text-weight-bold q-mb-md">Gajoy Workspace</div>
        <div class="text-subtitle1 q-mb-xl">Bem-vindo de volta!</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md full-width">
          <q-input
            v-model="accessCode"
            :type="isPwd ? 'password' : 'text'"
            label="Código de Acesso"
            :rules="[(val) => !!val || 'Código de acesso é obrigatório']"
            outlined
            bg-color="grey-2"
            class="q-mb-md full-width"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="grey"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            class="full-width q-py-sm q-mt-md"
            :loading="loading"
            label="Entrar"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showError">
      <q-card>
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Erro</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          Código de acesso inválido. Por favor, tente novamente.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
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

<style lang="scss" scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.q-card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.8);
}

.q-input {
  border-radius: 8px;
}

.q-btn {
  border-radius: 8px;
  font-weight: bold;
}
</style>
