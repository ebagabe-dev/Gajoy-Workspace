import { defineStore } from "pinia";
import type { SuperAdmin } from "src/types/admin";
import { adminService } from "src/services/admin";

interface AdminState {
  admin: SuperAdmin | null
  loading: boolean
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    admin: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.admin
  },

  actions: {
    async validateAccess(code: string) {
      this.loading = true

      try {
        const admin = await adminService.validateAccessCode(code)
        this.admin = admin
        return true
      } catch (error) {
        console.error(error)
        this.admin = null
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
