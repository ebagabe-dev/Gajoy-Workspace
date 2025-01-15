<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4 text-weight-bold q-mb-md">Dashboard</h1>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Receita Parcial</div>
            <div class="text-h4 text-positive">R$ {{ receitaParcial.toFixed(2) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Despesa Parcial</div>
            <div class="text-h4 text-negative">R$ {{ despesaParcial.toFixed(2) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total Parcial</div>
            <div
              class="text-h4"
              :class="{ 'text-positive': totalParcial >= 0, 'text-negative': totalParcial < 0 }"
            >
              R$ {{ totalParcial.toFixed(2) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total Concluído</div>
            <div
              class="text-h4"
              :class="{ 'text-positive': totalConcluido >= 0, 'text-negative': totalConcluido < 0 }"
            >
              R$ {{ totalConcluido.toFixed(2) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Principais Clientes -->
      <div class="col-12">
        <h2 class="text-h5 q-mb-md">Principais Clientes</h2>
      </div>
      <div v-for="(client, index) in topClients" :key="index" class="col-12 col-md-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">{{ client.name }}</div>
            <div class="text-h5">R$ {{ client.total.toFixed(2) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { financeService } from 'src/services/finances'
import type { Finance } from 'src/types/finances'
import { computed, onMounted, ref } from 'vue'

const finances = ref<Finance[]>([])

onMounted(async () => {
  try {
    finances.value = await financeService.getFinances()
  } catch (error) {
    console.error('Error fetching finances:', error)
  }
})

const receitaParcial = computed(() =>
  finances.value.filter((f) => f.type === 'Receita').reduce((sum, f) => sum + f.value, 0),
)

const despesaParcial = computed(() =>
  finances.value.filter((f) => f.type === 'Despesa').reduce((sum, f) => sum + f.value, 0),
)

const totalParcial = computed(() => receitaParcial.value - despesaParcial.value)

const totalConcluido = computed(() =>
  finances.value
    .filter((f) => f.status === 'Concluído')
    .reduce((sum, f) => sum + (f.type === 'Receita' ? f.value : -f.value), 0),
)

const topClients = computed(() => {
  const clientTotals = finances.value.reduce(
    (acc, finance) => {
      if (finance.type === 'Receita') {
        acc[finance.clients.name] = (acc[finance.clients.name] || 0) + finance.value
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(clientTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, total]) => ({ name, total }))
})
</script>

<style lang="scss" scoped>
.dashboard-card {
  height: 100%;
  .q-card__section {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
