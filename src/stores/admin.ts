import { defineStore } from 'pinia'
import type { SuperAdmin } from 'src/types/admin'
import { adminService } from 'src/services/admin'

interface AdminState {
  admin: SuperAdmin | null
  loading: boolean
  isAuthenticated: boolean
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    admin: null,
    loading: false,
    isAuthenticated: false
  }),

  actions: {
    async validateAccess(code: string) {
      this.loading = true
      try {
        const admin = await adminService.validateAccessCode(code)
        this.admin = admin
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error(error)
        this.admin = null
        this.isAuthenticated = false
        return false
      } finally {
        this.loading = false
      }
    },

    setAuthenticated(value: boolean) {
      this.isAuthenticated = value
    },

    logout() {
      this.admin = null
      this.isAuthenticated = false
      localStorage.removeItem('isAuthenticated')
    }
  }
})
