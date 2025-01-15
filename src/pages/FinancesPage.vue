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
        <component :is="currentView" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FinanceCards from 'src/components/FinanceCards.vue'
import FinanceList from 'src/components/FinanceList.vue'

const viewMode = ref('cards')

const currentView = computed(() => (viewMode.value === 'cards' ? FinanceCards : FinanceList))
</script>
