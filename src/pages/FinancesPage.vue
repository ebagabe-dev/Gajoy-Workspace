<template>
  <q-page padding class="finances-page">
    <div class="row q-col-gutter-md">
      <div class="col-12 flex justify-between items-center">
        <h1 class="text-h4 text-weight-bold q-my-none">Finanças</h1>
        <q-btn-toggle
          v-model="viewMode"
          spread
          unelevated
          toggle-color="primary"
          color="grey-3"
          text-color="grey-8"
          class="q-pa-sm bg-grey-2 rounded-borders"
          :options="[
            { label: 'Cards', value: 'cards', icon: 'grid_view' },
            { label: 'Lista', value: 'list', icon: 'list' },
          ]"
        />
      </div>
      <div class="col-12">
        <transition name="fade" mode="out-in">
          <component
            :is="currentView"
            :finances="finances"
            @edit="openEditDialog"
            @delete="deleteFinance"
          />
        </transition>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="openAddDialog" />
    </q-page-sticky>

    <q-dialog v-model="financeDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="finance-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editingFinance ? 'Editar' : 'Adicionar' }} Finança</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-form @submit="saveFinance" class="q-gutter-md">
            <q-input
              v-model="newFinance.title"
              label="Título"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              outlined
              dense
            />

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newFinance.category_id"
                  :options="categoryOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  label="Categoria"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newFinance.client_id"
                  :options="clientOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  label="Cliente"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  outlined
                  dense
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newFinance.start_date"
                  label="Data de Início"
                  type="date"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newFinance.end_date"
                  label="Data de Conclusão"
                  type="date"
                  outlined
                  dense
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newFinance.type"
                  :options="['Receita', 'Despesa']"
                  label="Tipo"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="newFinance.value"
                  label="Valor"
                  type="number"
                  :rules="[(val) => val > 0 || 'Valor deve ser maior que zero']"
                  prefix="R$"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newFinance.status"
                  :options="['Em andamento', 'Concluído']"
                  label="Status"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  outlined
                  dense
                />
              </div>
            </div>
            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" color="grey" v-close-popup />
              <q-btn label="Salvar" type="submit" color="primary" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { financeService } from 'src/services/finances'
import { type NewFinance } from 'src/types/finances'
import FinanceCards from 'src/components/FinanceCards.vue'
import FinanceList from 'src/components/FinanceList.vue'
import type { Finance, Category, Client } from 'src/types/finances'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const viewMode = ref('cards')
const finances = ref<Finance[]>([])
const categories = ref<Category[]>([])
const clients = ref<Client[]>([])
const financeDialog = ref(false)
const saving = ref(false)
const editingFinance = ref<Finance | null>(null)

const newFinance = ref<NewFinance>({
  title: '',
  category_id: null,
  status: 'Em andamento',
  start_date: '',
  end_date: null,
  value: 0,
  client_id: null,
  type: 'Receita',
})

const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ label: cat.name, value: cat.id })),
)

const clientOptions = computed(() =>
  clients.value.map((client) => ({ label: client.name, value: client.id })),
)

const currentView = computed(() => (viewMode.value === 'cards' ? FinanceCards : FinanceList))

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    const [financeData, categoryData, clientData] = await Promise.all([
      financeService.getFinances(),
      financeService.getCategories(),
      financeService.getClients(),
    ])

    finances.value = financeData
    categories.value = categoryData
    clients.value = clientData
  } catch (error) {
    console.error('Error fetching data:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar dados',
    })
  }
}

const openAddDialog = () => {
  editingFinance.value = null
  newFinance.value = {
    title: '',
    category_id: null,
    status: 'Em andamento',
    start_date: '',
    end_date: null,
    value: 0,
    client_id: null,
    type: 'Receita',
  }
  financeDialog.value = true
}

const openEditDialog = (finance: Finance) => {
  editingFinance.value = finance
  newFinance.value = {
    title: finance.title,
    category_id: finance.category_id,
    status: finance.status,
    start_date: finance.start_date,
    end_date: finance.end_date || null,
    value: finance.value,
    client_id: finance.client_id,
    type: finance.type,
  }
  financeDialog.value = true
}

const saveFinance = async () => {
  saving.value = true
  try {
    if (newFinance.value.category_id === null || newFinance.value.client_id === null) {
      throw new Error('Categoria e Cliente são obrigatórios')
    }

    if (editingFinance.value) {
      await financeService.updateFinance(editingFinance.value.id, newFinance.value)
      $q.notify({
        color: 'positive',
        message: 'Finança atualizada com sucesso',
      })
    } else {
      const addedFinance = await financeService.addFinance(newFinance.value)
      finances.value.unshift(addedFinance)
      $q.notify({
        color: 'positive',
        message: 'Finança adicionada com sucesso',
      })
    }

    financeDialog.value = false
    await loadData()
  } catch (error) {
    console.error('Error saving finance:', error)
    $q.notify({
      color: 'negative',
      message: error instanceof Error ? error.message : 'Erro ao salvar finança',
    })
  } finally {
    saving.value = false
  }
}

const deleteFinance = async (finance: Finance) => {
  try {
    await financeService.deleteFinance(finance.id)
    finances.value = finances.value.filter((f) => f.id !== finance.id)
    $q.notify({
      color: 'positive',
      message: 'Finança excluída com sucesso',
    })
  } catch (error) {
    console.error('Error deleting finance:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao excluir finança',
    })
  }
}
</script>

<style lang="scss" scoped>
.finances-page {
  background-color: #f5f5f5;
}

.finance-dialog {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
