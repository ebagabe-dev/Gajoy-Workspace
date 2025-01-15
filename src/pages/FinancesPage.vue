<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Finanças</h1>
      </div>
      <div class="col-12">
        <q-btn-toggle
          v-model="viewMode"
          flat
          stretch
          toggle-color="primary"
          :options="[
            { label: 'Cards', value: 'cards' },
            { label: 'Lista', value: 'list' },
          ]"
        />
      </div>
      <div class="col-12">
        <component :is="currentView" :finances="finances" />
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="openAddDialog" />
    </q-page-sticky>

    <q-dialog v-model="addDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adicionar Nova Finança</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="addFinance">
            <q-input
              v-model="newFinance.title"
              label="Título"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
            <q-select
              v-model="newFinance.category_id"
              :options="categoryOptions"
              label="Categoria"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
            <q-select
              v-model="newFinance.status"
              :options="['Em andamento', 'Concluído']"
              label="Status"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
            <q-input
              v-model="newFinance.start_date"
              label="Data de Início"
              type="date"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
            <q-input v-model="newFinance.end_date" label="Data de Conclusão" type="date" />
            <q-input
              v-model.number="newFinance.value"
              label="Valor"
              type="number"
              :rules="[(val) => val > 0 || 'Valor deve ser maior que zero']"
            />
            <q-select
              v-model="newFinance.client_id"
              :options="clientOptions"
              label="Cliente"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="addFinance" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { financeService } from 'src/services/finances'
import type { NewFinance } from 'src/types/finances'
import FinanceCards from 'src/components/FinanceCards.vue'
import FinanceList from 'src/components/FinanceList.vue'
import type { Finance } from 'src/types/finances'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const viewMode = ref('cards')
const finances = ref<Finance[]>([])
const addDialog = ref(false)

const newFinance = ref<NewFinance>({
  title: '',
  category_id: null,
  status: 'Em andamento',
  start_date: '',
  end_date: null,
  value: 0,
  client_id: null,
})

const categoryOptions = ref([
  { label: 'Categoria 1', value: 1 },
  { label: 'Categoria 2', value: 2 },
])

const clientOptions = ref([
  { label: 'Cliente 1', value: 1 },
  { label: 'Cliente 2', value: 2 },
])

const currentView = computed(() => (viewMode.value === 'cards' ? FinanceCards : FinanceList))

onMounted(async () => {
  try {
    finances.value = await financeService.getFinances()
  } catch (error) {
    console.error('Error fetching finances:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar finanças',
    })
  }
})

const openAddDialog = () => {
  addDialog.value = true
}

const addFinance = async () => {
  try {
    if (newFinance.value.category_id === null || newFinance.value.client_id === null) {
      throw new Error('Categoria e Cliente são obrigatórios')
    }

    const addedFinance = await financeService.addFinance(newFinance.value)
    finances.value.unshift(addedFinance)
    addDialog.value = false
    $q.notify({
      color: 'positive',
      message: 'Finança adicionada com sucesso',
    })

    newFinance.value = {
      title: '',
      category_id: null,
      status: 'Em andamento',
      start_date: '',
      end_date: null,
      value: 0,
      client_id: null,
    }
  } catch (error) {
    console.error('Error adding finance:', error)
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : 'Erro ao adicionar finança',
    })
  }
}
</script>
