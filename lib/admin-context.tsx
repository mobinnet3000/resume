'use client'

import { createContext, useContext, ReactNode } from 'react'
import { AdminData, useAdmin } from './admin-store'

interface AdminCtx {
  data: AdminData
  loaded: boolean
}

const AdminContext = createContext<AdminCtx>({ data: null as unknown as AdminData, loaded: false })

export function AdminProvider({ children }: { children: ReactNode }) {
  const { data, loaded } = useAdmin()
  return <AdminContext.Provider value={{ data, loaded }}>{children}</AdminContext.Provider>
}

export function useAdminData() {
  return useContext(AdminContext)
}
