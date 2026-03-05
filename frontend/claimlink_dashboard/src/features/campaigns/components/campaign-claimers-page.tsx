import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/common/search-input'
import { FilterSelect, type FilterOption } from '@/components/common/filter-select'
import { Pagination } from '@/components/common/pagination'

interface Claimer {
  id: string
  walletOrEmail: string
  status: 'Claimed' | 'Unclaimed'
  date: string
}

interface CampaignClaimersPageProps {
  campaignId?: string
}

const mockClaimers: Claimer[] = [
  {
    id: '1',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '2',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '3',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '4',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '5',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '6',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '7',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '8',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Claimed',
    date: '27 Feb, 2024'
  },
  {
    id: '9',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Unclaimed',
    date: '27 Feb, 2024'
  },
  {
    id: '10',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Unclaimed',
    date: '27 Feb, 2024'
  },
  {
    id: '11',
    walletOrEmail: '47387622e55ea5c807d6c869d2a195c7bf52fa79a85b305992bd1634b7ad1ebf',
    status: 'Unclaimed',
    date: '27 Feb, 2024'
  }
]

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'unclaimed', label: 'Unclaimed' }
]

export function CampaignClaimersPage(_props: CampaignClaimersPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter claimers based on search and status
  const filteredClaimers = mockClaimers.filter(claimer => {
    const matchesSearch = claimer.walletOrEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || claimer.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaimers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClaimers = filteredClaimers.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    if (status === 'Claimed') {
      return (
        <div className="bg-[#ccedff] px-2 py-1 rounded-full">
          <span className="text-[#00a2f7] text-[12px] font-semibold">Claimed</span>
        </div>
      )
    } else {
      return (
        <div className="bg-[#ffe2db] px-2 py-1 rounded-full">
          <span className="text-[#e84c25] text-[12px] font-semibold">Unclaimed</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Page description */}
      <div>
        <p className="text-[#69737c] text-base leading-8">
          Create and manage your organization's user roles and permissions
        </p>
      </div>

      {/* Top Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 flex-1">
          <SearchInput
            placeholder="Search for an item"
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
          />
          <FilterSelect
            placeholder="Status"
            value={statusFilter}
            options={statusOptions}
            onValueChange={setStatusFilter}
            width="w-[250px]"
          />
        </div>
        <Button className="bg-white border border-[#e1e1e1] rounded-[20px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)] h-14 px-6">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#222526]">Download report</span>
            <div className="w-8 h-8 bg-[#222526] rounded-[16px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Button>
      </div>

      {/* Table */}
      <div className="border border-[#e1e1e1] rounded-[25px] overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#222526] px-10 py-4">
          <div className="flex gap-4 items-center text-white">
            <div className="flex-1">
              <span className="text-[13px] font-medium">Wallet or email</span>
            </div>
            <div className="w-[150px]">
              <span className="text-[13px] font-medium">Status</span>
            </div>
            <div className="w-[150px]">
              <span className="text-[13px] font-medium">Date</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="bg-white">
          {paginatedClaimers.map((claimer, index) => (
            <div
              key={claimer.id}
              className={`flex gap-4 items-center px-10 py-4 border-b border-[#e1e1e1] ${
                index % 2 === 1 ? 'bg-[rgba(249,250,254,0.5)]' : 'bg-white'
              }`}
            >
              <div className="flex-1">
                <span className="text-[16px] font-medium text-[#222526]">
                  {claimer.walletOrEmail}
                </span>
              </div>
              <div className="w-[150px]">
                {getStatusBadge(claimer.status)}
              </div>
              <div className="w-[150px]">
                <span className="text-[14px] text-[#69737c]">
                  {claimer.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[5, 10, 20, 50]}
          showItemsPerPage={true}
          className="border-t border-[#e1e1e1]"
        />
      </div>
    </div>
  )
}
