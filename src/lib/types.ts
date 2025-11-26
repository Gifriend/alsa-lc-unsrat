export interface Proker {
  id: string
  title: string
  description: string
  status: "ongoing" | "archived"
  startDate: string // Always store as ISO string
  createdAt?: string
  updatedAt?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string // Always store as ISO string
  createdAt?: string
  updatedAt?: string
}

export interface Resource {
  id: string
  name: string
  description: string
  fileType: string
  createdAt?: string
  updatedAt?: string
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface APIListResponse<T> {
  success: boolean
  data: T[]
  error?: string
}
