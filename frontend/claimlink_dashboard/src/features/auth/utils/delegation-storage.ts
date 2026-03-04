const STORAGE_KEY_PRINCIPAL = 'auth_principal_id'
const STORAGE_KEY_EXPIRY = 'auth_session_expiry'

/**
 * Save authentication session info to localStorage
 * NFID IdentityKit handles delegation restoration automatically,
 * we just track the principal and expiry for session validation
 */
export const saveDelegationToStorage = (user: any, _agent: any) => {
  try {
    if (!user?.principal) {
      console.warn('[Auth] No user principal found to save')
      return
    }

    // Store principal ID
    const principalId = user.principal.toText()
    localStorage.setItem(STORAGE_KEY_PRINCIPAL, principalId)

    // Calculate and store expiry time (1 day from now, matching maxTimeToLive)
    const oneDayInMs = 24 * 60 * 60 * 1000
    const expiryTime = Date.now() + oneDayInMs
    localStorage.setItem(STORAGE_KEY_EXPIRY, expiryTime.toString())

    console.log('[Auth] Session info saved to localStorage', { principalId })
  } catch (error) {
    console.error('[Auth] Failed to save session info:', error)
  }
}

/**
 * Check if we have a stored session
 * NFID handles actual delegation restoration
 */
export const hasStoredSession = (): boolean => {
  const principalId = localStorage.getItem(STORAGE_KEY_PRINCIPAL)
  const expiryTime = localStorage.getItem(STORAGE_KEY_EXPIRY)
  return !!(principalId && expiryTime)
}

/**
 * Get stored principal ID if session exists
 */
export const getStoredPrincipalId = (): string | null => {
  if (isStoredDelegationExpired()) {
    return null
  }
  return localStorage.getItem(STORAGE_KEY_PRINCIPAL)
}

/**
 * Clear session info from localStorage
 */
export const clearDelegationFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY_PRINCIPAL)
  localStorage.removeItem(STORAGE_KEY_EXPIRY)
  console.log('[Auth] Session info cleared from localStorage')
}

/**
 * Check if stored session is expired
 * Returns true if no session or expired
 */
export const isStoredDelegationExpired = (): boolean => {
  const expiryTime = localStorage.getItem(STORAGE_KEY_EXPIRY)
  if (!expiryTime) return true

  const expiryDate = new Date(parseInt(expiryTime))
  return expiryDate <= new Date()
}
