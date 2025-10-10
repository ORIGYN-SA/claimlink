import type { Campaign } from '@/features/campaigns/types/campaign.types';

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campaign's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Active",
    timerText: "13 days left",
    timerType: "Ongoing",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "2",
    name: "Campaign's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Active",
    timerText: "1 hour left",
    timerType: "Urgent",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "3",
    name: "Campaign's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Ready",
    timerText: "Starts in 2 days",
    timerType: "Starting Soon",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "4",
    name: "Campaign's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Finished",
    timerText: "0 day left",
    timerType: "Finished",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "5",
    name: "Campaign's name",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Active",
    timerText: "13 days left",
    timerType: "Ongoing",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "6",
    name: "Summer Collection Campaign",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    claimedCount: 78,
    totalCount: 150,
    status: "Active",
    timerText: "7 days left",
    timerType: "Ongoing",
    createdAt: "15 Feb, 2024"
  },
  {
    id: "7",
    name: "Diamond Authentication Drive",
    imageUrl: "https://images.unsplash.com/photo-1611652022418-a9419f74343d?w=400&h=400&fit=crop",
    claimedCount: 23,
    totalCount: 50,
    status: "Ready",
    timerText: "Starts tomorrow",
    timerType: "Starting Soon",
    createdAt: "22 Feb, 2024"
  }
];

export const getFilteredCampaigns = (campaigns: Campaign[], filters: { search: string; status: string; duration: string }) => {
  return campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || campaign.status === filters.status;
    // For duration filtering, you could add more logic here based on campaign dates
    const matchesDuration = filters.duration === 'all' || true; // Simplified for now

    return matchesSearch && matchesStatus && matchesDuration;
  });
};
