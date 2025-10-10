import type { Campaign } from '@/features/campaigns/types/campaign.types';

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Gold Bar Certificate Launch",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop",
    claimedCount: 52,
    totalCount: 100,
    status: "Active",
    timerText: "13 days left",
    timerType: "Ongoing",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "2",
    name: "Luxury Watch Verification",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop",
    claimedCount: 87,
    totalCount: 100,
    status: "Active",
    timerText: "1 hour left",
    timerType: "Urgent",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "3",
    name: "Art Authenticity Collection",
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop",
    claimedCount: 0,
    totalCount: 200,
    status: "Ready",
    timerText: "Starts in 2 days",
    timerType: "Starting Soon",
    createdAt: "20 Feb, 2024"
  },
  {
    id: "4",
    name: "Classic Car NFT Drop",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
    claimedCount: 150,
    totalCount: 150,
    status: "Finished",
    timerText: "Ended",
    timerType: "Finished",
    createdAt: "10 Jan, 2024"
  },
  {
    id: "5",
    name: "Premium Diamond Registry",
    imageUrl: "https://images.unsplash.com/photo-1611652022418-a9419f74343d?w=400&h=400&fit=crop",
    claimedCount: 42,
    totalCount: 75,
    status: "Active",
    timerText: "21 days left",
    timerType: "Ongoing",
    createdAt: "18 Feb, 2024"
  },
  {
    id: "6",
    name: "Summer Spirit Collection",
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop",
    claimedCount: 78,
    totalCount: 150,
    status: "Active",
    timerText: "7 days left",
    timerType: "Ongoing",
    createdAt: "15 Feb, 2024"
  },
  {
    id: "7",
    name: "Swiss Timepiece Authentication",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop",
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
