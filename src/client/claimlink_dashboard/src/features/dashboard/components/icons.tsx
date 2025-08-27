import React from 'react'

export function MintedCertificatesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <path d="M8 1L10 6H15L11 9L13 14L8 11L3 14L5 9L1 6H6L8 1Z" />
    </svg>
  )
}

export function AwaitingCertificatesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WalletCertificatesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <path d="M2 4H14C14.5523 4 15 4.44772 15 5V13C15 13.5523 14.5523 14 14 14H2C1.44772 14 1 13.5523 1 13V5C1 4.44772 1.44772 4 2 4Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M11 8H13V10H11V8Z" fill="currentColor" />
    </svg>
  )
}

export function TransferredCertificatesIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M13 13L15 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  )
}

export function LineIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <path d="M3 6H13M3 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
