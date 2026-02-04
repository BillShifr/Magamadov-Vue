<script setup lang="ts">
import AccountsManager from './components/AccountsManager.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row items-center">
            <q-icon name="account_circle" size="32px" class="q-mr-sm" />
            <span>Управление учетными записями by Magamadov</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <AccountsManager />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
body
  font-family: 'Roboto', sans-serif
  margin: 0
  padding: 0
</style>
