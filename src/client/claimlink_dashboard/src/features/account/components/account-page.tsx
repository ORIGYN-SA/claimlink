import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Edit, MoreHorizontal } from "lucide-react";
import { mockUsers } from "@/shared/data";
import { useNavigate } from "@tanstack/react-router";

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium text-[#222526]">
            Account <span className="text-[#69737c]">– Audemars Piguet</span>
          </h1>
          <p className="text-sm text-[#69737c] mt-1">
            Manage your organization's user roles and permissions
          </p>
        </div>

        {/* Wallet buttons would be handled by HeaderBar */}
      </div>

      {/* Company Recap Card */}
      <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            {/* Company Logo */}
            <div className="w-36 h-36 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">AP</span>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-medium text-[#222526]">Audemars Piguet</h2>
                {/* Verified badge placeholder */}
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <p className="text-base text-[#69737c] leading-relaxed max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae est velit.
                Cras sed tortor iaculis dolor sollicitudin sollicitudin eu eu dolor. Nunc bibendum at sem eget egestas.
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={handleEditBiography}
              variant="outline"
              className="bg-white border border-[#e1e1e1] hover:bg-gray-50 text-[#222526] rounded-2xl px-4 py-2 h-auto"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit biography
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <div className="space-y-4">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-[#222526]">
              All users <span className="text-[#69737c]">({mockUsers.length})</span>
            </h3>
          </div>

          {/* Search and Add User */}
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#69737c] w-4 h-4" />
              <Input
                placeholder="Search for an item"
                className="pl-10 bg-white border border-[#e1e1e1] rounded-full"
              />
            </div>

            <Button
              onClick={handleCreateUser}
              className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-full px-6"
            >
              Add user
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="rounded-[25px] overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#222526] px-10 py-4 rounded-t-[25px]">
              <div className="grid grid-cols-5 gap-4 text-white text-sm font-medium">
                <div className="w-[400px]">Username</div>
                <div className="w-[150px]">Title</div>
                <div className="flex-1">Access</div>
                <div className="w-[150px]">Last active</div>
                <div></div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#e1e1e1]">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-10 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={handleEditUser}
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    {/* User Info */}
                    <div className="flex items-center gap-3 w-[400px]">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                          {user.username.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium text-[#222526]">{user.username}</p>
                        <p className="text-sm text-[#69737c] tracking-[0.01em]">{user.email}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-sm text-[#69737c] w-[150px]">{user.title}</div>

                    {/* Access Tags */}
                    <div className="flex flex-wrap gap-1">
                      {user.access.map((access, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className={`text-xs px-2 py-1 rounded-full ${getAccessBadgeColor(access)}`}
                        >
                          {access}
                        </Badge>
                      ))}
                    </div>

                    {/* Last Active */}
                    <div className="text-sm text-[#69737c] w-[150px]">{user.lastActive}</div>

                    {/* Actions */}
                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer */}
            <div className="px-10 py-4 bg-white border-t border-[#e1e1e1] flex items-center justify-between rounded-b-[25px]">
              <div className="flex items-center gap-4 text-sm text-[#69737c]">
                <span>Lines per page</span>
                <Button variant="outline" size="sm" className="rounded-full border-[#e1e1e1] px-3">
                  10
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#222526] font-medium">1</span>
                <span className="text-[#69737c]">2 3 ... 10 11 12</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
