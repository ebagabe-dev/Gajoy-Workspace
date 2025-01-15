<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold"> Gajoy Workspace </q-toolbar-title>

        <q-btn flat round dense icon="account_circle" class="q-ml-sm">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8"> Menu </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin'
import EssentialLink from 'components/EssentialLink.vue'

const essentialLinks = [
  {
    title: 'Dashboard',
    caption: 'Visão geral',
    icon: 'dashboard',
    link: { name: 'dashboard' },
  },
  {
    title: 'Finanças',
    caption: 'Gerenciar finanças',
    icon: 'attach_money',
    link: { name: 'finances' },
  },
]

const leftDrawerOpen = ref(false)
const router = useRouter()
const adminStore = useAdminStore()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  adminStore.logout()
  router.push({ name: 'login' })
}
</script>

<style lang="scss" scoped>
.q-toolbar {
  height: 64px;
}

.q-drawer {
  background-color: #f5f5f5;
}
</style>
