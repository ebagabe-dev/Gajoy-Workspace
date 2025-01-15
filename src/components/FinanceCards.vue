<template>
  <div class="row q-col-gutter-md">
    <div v-for="finance in finances" :key="finance.id" class="col-12 col-md-4 col-lg-3">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ finance.title }}</div>
          <div class="text-subtitle2">{{ finance.categories.name }}</div>
        </q-card-section>

        <q-card-section>
          <div>Status: {{ finance.status }}</div>
          <div>Valor: R$ {{ finance.value.toFixed(2) }}</div>
          <div>Cliente: {{ finance.clients.name }}</div>
        </q-card-section>

        <q-card-section>
          <div>Início: {{ formatDate(finance.start_date) }}</div>
          <div v-if="finance.end_date">Conclusão: {{ formatDate(finance.end_date) }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps(['finances'])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
