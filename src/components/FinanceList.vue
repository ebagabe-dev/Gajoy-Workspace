<template>
  <q-table :rows="finances" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }">
    <template v-slot:body-cell-value="props">
      <q-td :props="props"> R$ {{ props.value.toFixed(2) }} </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue'
import type { QTableColumn } from 'quasar'

// Defina as interfaces para as estruturas de dados
interface Category {
  name: string
}

interface Client {
  name: string
}

interface Finance {
  id: number
  title: string
  categories: Category
  status: string
  value: number
  clients: Client
  start_date: string
  end_date?: string
}

const props = defineProps<{
  finances: Finance[]
}>()

const { finances } = toRefs(props)

const columns: QTableColumn[] = [
  { name: 'title', required: true, label: 'Título', align: 'left', field: 'title' },
  {
    name: 'category',
    required: true,
    label: 'Categoria',
    align: 'left',
    field: (row: Finance) => row.categories.name,
  },
  { name: 'status', required: true, label: 'Status', align: 'left', field: 'status' },
  { name: 'value', required: true, label: 'Valor', align: 'right', field: 'value' },
  {
    name: 'client',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: (row: Finance) => row.clients.name,
  },
  {
    name: 'start_date',
    required: true,
    label: 'Data de Início',
    align: 'left',
    field: 'start_date',
  },
  {
    name: 'end_date',
    required: false,
    label: 'Data de Conclusão',
    align: 'left',
    field: 'end_date',
  },
]
</script>
