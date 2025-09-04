export interface StatCardProps {
  title: string
  value: string
  trend: string
  trendColor: "green" | "red",
  icon?: React.ReactNode
  className?: string
}

export interface WelcomeCardProps {
  className?: string
}

export interface FeedCardProps {
  title: string
  id?: string
  className?: string
}

export type MintStatus = "Minted" | "Transferred" | "Waiting"

export interface MintCardProps {
  title: string
  status: MintStatus
  date?: string
  imageUrl?: string
  className?: string
}

export interface CertificateItem {
  title: string
  date: string
  imageUrl?: string
}

export interface CertificateListCardProps {
  title: string
  subtitle: string
  items: CertificateItem[]
  searchPlaceholder?: string
  onViewAll?: () => void
  className?: string
}

export interface DashboardPageProps {
  className?: string
}

export interface DashboardStats {
  mintedCertificates: number
  awaitingCertificates: number
  certificatesInWallet: number
  transferredCertificates: number
}

export interface DashboardData {
  stats: DashboardStats
  recentOwners: Array<{
    name: string
    id: string
    date: string
  }>
  sentCertificates: CertificateItem[]
  mintedCertificates: Array<{
    title: string
    status: MintStatus
    date?: string
    imageUrl?: string
  }>
}
