import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Account, AccountUI } from '@/types/account'
import { stringToLabelArray, labelArrayToString } from '@/utils/labelConverter'
import { validateAccount, isAccountValid } from '@/utils/validation'

const STORAGE_KEY = 'accounts_storage'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const validAccounts = computed(() => {
    return accounts.value.filter(account => {
      const labelString = labelArrayToString(account.label)
      const errors = validateAccount(
        labelString,
        account.login,
        account.password,
        account.type
      )
      return isAccountValid(errors)
    })
  })

  function addAccount(accountUI: Omit<AccountUI, 'id'>): string {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9)
    
    const newAccount: Account = {
      id: newId,
      label: stringToLabelArray(accountUI.label),
      type: accountUI.type,
      login: accountUI.login,
      password: accountUI.password
    }
    
    accounts.value.push(newAccount)
    return newId
  }

  function updateAccount(id: Account['id'], payload: Partial<AccountUI>): void {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      const updated = { ...accounts.value[index] }
      
      if (payload.label !== undefined) {
        updated.label = stringToLabelArray(payload.label)
      }
      if (payload.type !== undefined) {
        updated.type = payload.type
        if (payload.type === 'ldap') {
          updated.password = null
        }
      }
      if (payload.login !== undefined) {
        updated.login = payload.login
      }
      if (payload.password !== undefined) {
        updated.password = payload.password
      }
      
      accounts.value[index] = updated
    }
  }

  function deleteAccount(id: Account['id']): void {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  function loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Account[]
        accounts.value = parsed
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных из localStorage:', error)
    }
  }

  function saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validAccounts.value))
    } catch (error) {
      console.error('Ошибка при сохранении данных в localStorage:', error)
    }
  }

  function getAccountUI(id: Account['id']): AccountUI | undefined {
    const account = accounts.value.find(acc => acc.id === id)
    if (!account) return undefined

    return {
      id: account.id,
      label: labelArrayToString(account.label),
      type: account.type,
      login: account.login,
      password: account.password
    }
  }

  const accountsUI = computed((): AccountUI[] => {
    return accounts.value.map(account => ({
      id: account.id,
      label: labelArrayToString(account.label),
      type: account.type,
      login: account.login,
      password: account.password
    }))
  })

  watch(
    accounts,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  loadFromStorage()

  return {
    accounts,
    accountsUI,
    validAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    loadFromStorage,
    saveToStorage,
    getAccountUI
  }
})
