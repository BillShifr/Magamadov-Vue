<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import AccountItem from './AccountItem.vue'

const accountStore = useAccountStore()

const accountsUI = computed(() => accountStore.accountsUI)

function addNewAccount() {
  accountStore.addAccount({
    label: '',
    type: 'local',
    login: '',
    password: ''
  })
}
</script>

<template>
  <div class="accounts-manager q-pa-md">
    <div class="header-section q-mb-lg">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <h4 class="q-ma-none text-h5 text-weight-medium">Учетные записи</h4>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Добавить учетную запись"
            unelevated
            @click="addNewAccount"
          />
        </div>
      </div>
    </div>

    <div class="info-banner q-mb-md">
      <q-banner class="bg-blue-1 text-blue-9" rounded>
        <template #avatar>
          <q-icon name="info" color="blue" />
        </template>
        <div class="text-body2">
          Для указания нескольких меток для одной пары логин/пароль используйте разделитель 
          <strong>;</strong>
        </div>
      </q-banner>
    </div>

    <div class="column-headers q-mb-sm q-px-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <div class="text-subtitle2 text-grey-7">Метки</div>
        </div>
        <div class="col-12 col-md-2">
          <div class="text-subtitle2 text-grey-7">Тип записи</div>
        </div>
        <div class="col-12 col-md-3">
          <div class="text-subtitle2 text-grey-7">Логин</div>
        </div>
        <div class="col-12 col-md-3">
          <div class="text-subtitle2 text-grey-7">Пароль</div>
        </div>
        <div class="col-12 col-md-1"></div>
      </div>
    </div>

    <div class="accounts-list">
      <div v-if="accountsUI.length === 0" class="empty-state text-center q-pa-xl">
        <q-icon name="folder_open" size="64px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">Нет учетных записей</div>
        <div class="text-body2 text-grey-5 q-mt-sm">
          Нажмите кнопку "Добавить учетную запись" чтобы создать первую запись
        </div>
      </div>

      <TransitionGroup name="list" tag="div">
        <AccountItem
          v-for="account in accountsUI"
          :key="account.id"
          :account-id="account.id"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="sass">
.accounts-manager
  max-width: 1400px
  margin: 0 auto

.header-section
  padding: 16px 0

.column-headers
  font-weight: 500

.list-enter-active,
.list-leave-active
  transition: all 0.3s ease

.list-enter-from
  opacity: 0
  transform: translateY(-20px)

.list-leave-to
  opacity: 0
  transform: translateX(30px)

.list-move
  transition: transform 0.3s ease
</style>
