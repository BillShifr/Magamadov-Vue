<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import type { AccountUI, ValidationErrors } from '@/types/account'
import { validateAccount, isAccountValid } from '@/utils/validation'

interface Props {
  accountId: string | number
}

const props = defineProps<Props>()
const accountStore = useAccountStore()

const localAccount = ref<AccountUI | null>(null)
const errors = ref<ValidationErrors>({})
const showPassword = ref(false)

function loadAccount() {
  const account = accountStore.getAccountUI(props.accountId)
  if (account) {
    localAccount.value = { ...account }
  }
}

loadAccount()

const isValid = computed(() => isAccountValid(errors.value))

function validate() {
  if (!localAccount.value) return

  errors.value = validateAccount(
    localAccount.value.label,
    localAccount.value.login,
    localAccount.value.password,
    localAccount.value.type
  )
}

function handleLabelBlur() {
  validate()
  if (!localAccount.value) return
  
  accountStore.updateAccount(props.accountId, {
    label: localAccount.value.label
  })
}

function handleLoginBlur() {
  validate()
  if (!localAccount.value) return
  
  accountStore.updateAccount(props.accountId, {
    login: localAccount.value.login
  })
}

function handlePasswordBlur() {
  validate()
  if (!localAccount.value) return
  
  accountStore.updateAccount(props.accountId, {
    password: localAccount.value.password
  })
}

function handleTypeChange() {
  validate()
  if (!localAccount.value) return
  
  if (localAccount.value.type === 'ldap') {
    localAccount.value.password = null
    errors.value.password = undefined
  }
  
  accountStore.updateAccount(props.accountId, {
    type: localAccount.value.type,
    password: localAccount.value.password
  })
}

function handleDelete() {
  accountStore.deleteAccount(props.accountId)
}

watch(
  () => accountStore.getAccountUI(props.accountId),
  (newAccount) => {
    if (newAccount) {
      localAccount.value = { ...newAccount }
      validate()
    }
  },
  { deep: true }
)
</script>

<template>
  <q-card v-if="localAccount" class="account-item" :class="{ 'invalid-account': !isValid }">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="localAccount.label"
            label="Метки"
            outlined
            dense
            placeholder="XXX"
            hint="Введите текстовые метки через точку с запятой ;. Макс. 50 символов."
            :error="!!errors.label"
            :error-message="errors.label"
            @blur="handleLabelBlur"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            v-model="localAccount.type"
            label="Тип записи"
            outlined
            dense
            :options="[
              { label: 'Локальная', value: 'local' },
              { label: 'LDAP', value: 'ldap' }
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="handleTypeChange"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            v-model="localAccount.login"
            label="Логин"
            outlined
            dense
            placeholder="Значение"
            :error="!!errors.login"
            :error-message="errors.login"
            @blur="handleLoginBlur"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            v-if="localAccount.type === 'local'"
            v-model="localAccount.password"
            label="Пароль"
            outlined
            dense
            placeholder="Значение"
            :type="showPassword ? 'text' : 'password'"
            :error="!!errors.password"
            :error-message="errors.password"
            @blur="handlePasswordBlur"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <q-input
            v-else
            model-value=""
            label="Пароль"
            outlined
            dense
            disable
            placeholder="—"
          />
        </div>

        <div class="col-12 col-md-1 flex items-center justify-center">
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="handleDelete"
          >
            <q-tooltip>Удалить запись</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="sass">
.account-item
  margin-bottom: 16px
  transition: all 0.3s ease

.invalid-account
  border-left: 4px solid #C10015
</style>
