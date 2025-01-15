<template>
  <div class="finance-list q-pa-md">
    <q-table
      :rows="finances"
      :columns="columns"
      row-key="id"
      :pagination="initialPagination"
      :loading="loading"
      class="finance-table"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="{ 'finance-row--completed': props.row.status === 'Concluído' }"
        >
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="category" :props="props">
            <q-chip
              :color="getCategoryColor(props.row.categories.name)"
              text-color="white"
              size="sm"
            >
              {{ props.row.categories.name }}
            </q-chip>
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="props.row.status === 'Concluído' ? 'positive' : 'warning'">
              {{ props.row.status }}
            </q-badge>
          </q-td>
          <q-td key="value" :props="props">
            <div class="text-weight-bold">R$ {{ props.row.value.toFixed(2) }}</div>
          </q-td>
          <q-td key="client" :props="props">
            {{ props.row.clients.name }}
          </q-td>
          <q-td key="start_date" :props="props">
            {{ formatDate(props.row.start_date) }}
          </q-td>
          <q-td key="end_date" :props="props">
            {{ props.row.end_date ? formatDate(props.row.end_date) : '-' }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn-group spread flat>
              <q-btn color="primary" icon="edit" size="sm" @click="editFinance(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn color="negative" icon="delete" size="sm" @click="deleteFinance(props.row)">
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { useQuasar } from 'quasar'
import type { Finance } from 'src/types/finances'

const $q = useQuasar()

defineProps<{
  finances: Finance[]
}>()

const loading = ref(false)

const columns: QTableColumn[] = [
  {
    name: 'title',
    required: true,
    label: 'Título',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'category',
    required: true,
    label: 'Categoria',
    align: 'left',
    field: (row: Finance) => row.categories.name,
    sortable: true,
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: 'status',
    sortable: true,
  },
  {
    name: 'value',
    required: true,
    label: 'Valor',
    align: 'right',
    field: 'value',
    sortable: true,
  },
  {
    name: 'client',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: (row: Finance) => row.clients.name,
    sortable: true,
  },
  {
    name: 'start_date',
    required: true,
    label: 'Data de Início',
    align: 'left',
    field: 'start_date',
    sortable: true,
  },
  {
    name: 'end_date',
    required: false,
    label: 'Data de Conclusão',
    align: 'left',
    field: 'end_date',
    sortable: true,
  },
  {
    name: 'actions',
    required: true,
    label: 'Ações',
    align: 'center',
    field: 'actions',
  },
]

const initialPagination = {
  sortBy: 'start_date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Freelance: 'primary',
    Assinatura: 'secondary',
    Estudos: 'accent',
    // Adicione mais categorias e cores conforme necessário
  }
  return colors[category] || 'grey'
}

const editFinance = (finance: Finance) => {
  // Implemente a lógica de edição
  console.log('Editar', finance)
}

const deleteFinance = (finance: Finance) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja excluir "${finance.title}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Implemente a lógica de exclusão
    console.log('Excluir', finance)
  })
}
</script>

<style lang="scss" scoped>
.finance-list {
  .finance-table {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      background-color: #f5f5f5;
    }

    thead tr th {
      font-weight: bold;
    }

    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tbody tr:hover {
      background-color: #e0f2fe;
    }
  }

  .finance-row--completed {
    background-color: #e6f4ea !important;
  }

  .q-chip {
    font-weight: bold;
  }

  .q-badge {
    font-size: 0.8em;
  }
}
</style>
