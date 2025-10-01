import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListOnlyContainer, SearchInput, type ListColumn } from "@/components/common";
import { mockUsers } from "@/shared/data";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "../types/account.types";
import { CompanyRecapCard } from "./company-recap-card";


const getAccessBadgeColor = (access: string) => {
  switch (access) {
    case "Admin (all)":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "Manager":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "Viewer":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Data Entry":
      return "bg-pink-100 text-pink-700 hover:bg-pink-100";
    case "Collection Viewer":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "Data Export":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

export function AccountPage() {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate({ to: "/account/new" });
  };

  const handleEditBiography = () => {
    navigate({ to: "/account/edit_company" });
  };

  const handleEditUser = () => {
    // TODO: Navigate to edit user page with user ID
    navigate({ to: "/account/edit_user" });
  };

  // User list columns configuration
  const userColumns: ListColumn[] = [
    { 
      key: 'user', 
      label: 'Username', 
      width: '400px',
      render: (user: User) => (
        <div className="flex items-center gap-3 w-[400px]">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
              {user.username.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-medium text-[#222526]">{user.username}</p>
            <p className="text-sm text-[#69737c] tracking-[0.01em]">{user.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Title', 
      width: '150px',
      render: (user: User) => (
        <div className="text-sm text-[#69737c] w-[150px]">{user.title}</div>
      )
    },
    { 
      key: 'access', 
      label: 'Access', 
      width: '1fr',
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.access.map((access: string, idx: number) => (
            <Badge
              key={idx}
              variant="secondary"
              className={`text-xs px-2 py-1 rounded-full ${getAccessBadgeColor(access)}`}
            >
              {access}
            </Badge>
          ))}
        </div>
      )
    },
    { 
      key: 'lastActive', 
      label: 'Last active', 
      width: '150px',
      render: (user: User) => (
        <div className="text-sm text-[#69737c] w-[150px]">{user.lastActive}</div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Company Recap Card */}
      <CompanyRecapCard
        companyName="Audemars Piguet"
        companyInitials="AP"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae est velit. Cras sed tortor iaculis dolor sollicitudin sollicitudin eu eu dolor. Nunc bibendum at sem eget egestas."
        isVerified={true}
        onEditClick={handleEditBiography}
      />

      {/* Users Table */}
      <div className="space-y-4">
        {/* Search and Add User */}
        <div className="flex items-center gap-4">
          <SearchInput 
            placeholder="Search for a user"
            className="w-80"
          />

          <Button
            onClick={handleCreateUser}
            className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-full px-6"
            size="lg"
          >
            Add user
          </Button>
        </div>

        {/* Users List */}
        <ListOnlyContainer
          title="All users"
          totalCount={mockUsers.length}
          items={mockUsers}
          columns={userColumns}
          onItemClick={handleEditUser}
          addItemText="Add your first user"
          onMoreActionsClick={(user) => console.log('More actions for user:', user.id)}
        />
      </div>
    </div>
  );
}
