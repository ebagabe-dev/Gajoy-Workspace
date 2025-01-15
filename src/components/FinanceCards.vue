<template>
  <div class="row q-col-gutter-md">
    <div v-for="finance in finances" :key="finance.id" class="col-12 col-md-4 col-lg-3">
      <q-card
        class="finance-card"
        :class="{ 'finance-card--completed': finance.status === 'Concluído' }"
      >
        <q-card-section>
          <div class="text-h6 finance-card__title">{{ finance.title }}</div>
          <q-chip
            :color="getCategoryColor(finance.categories.name)"
            text-color="white"
            class="finance-card__category"
          >
            {{ finance.categories.name }}
          </q-chip>
        </q-card-section>

        <q-card-section>
          <div class="finance-card__info">
            <q-icon name="event" /> {{ formatDate(finance.start_date) }}
          </div>
          <div v-if="finance.end_date" class="finance-card__info">
            <q-icon name="event_available" /> {{ formatDate(finance.end_date) }}
          </div>
          <div class="finance-card__info"><q-icon name="person" /> {{ finance.clients.name }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat round color="grey" icon="more_vert">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="editFinance(finance)">
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="deleteFinance(finance)">
                  <q-item-section>Excluir</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-actions>

        <q-card-section class="finance-card__footer">
          <div class="text-h5 finance-card__value">R$ {{ finance.value.toFixed(2) }}</div>
          <q-badge :color="finance.status === 'Concluído' ? 'positive' : 'warning'">
            {{ finance.status }}
          </q-badge>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Finance } from 'src/types/finances'

defineProps<{
  finances: Finance[]
}>()

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
  // Implemente a lógica de exclusão
  console.log('Excluir', finance)
}
</script>

<style lang="scss" scoped>
.finance-card {
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &__title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__category {
    margin-top: 5px;
  }

  &__info {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .q-icon {
      margin-right: 5px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
  }

  &__value {
    font-weight: bold;
    color: #1976d2;
  }

  &--completed {
    border-left: 5px solid #21ba45;
  }
}

// Animação de entrada
.finance-card-enter-active,
.finance-card-leave-active {
  transition: all 0.5s ease;
}
.finance-card-enter-from,
.finance-card-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
