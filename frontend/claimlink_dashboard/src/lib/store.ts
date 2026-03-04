import { createStore } from 'jotai'

// Global Jotai store for accessing atoms outside React components
// Used by route guards to access auth state synchronously
export const store = createStore()
