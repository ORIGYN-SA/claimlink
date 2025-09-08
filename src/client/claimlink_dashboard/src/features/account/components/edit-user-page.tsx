import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function EditUserPage() {
  const navigate = useNavigate();

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log("Saving changes...");
    // After successful save, navigate back to account page
    navigate({ to: "/account" });
  };

  const handleDeleteUser = () => {
    // TODO: Implement delete user logic with confirmation
    console.log("Deleting user...");
  };

  return (
    <div className="space-y-6">

      {/* Profile Form */}
      <div className="flex justify-center">
        <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-4xl">
          <CardContent className="p-10">
            <div className="flex gap-10 items-start">
              {/* Profile Picture Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="w-64 h-64">
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-6xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  {/* Edit icon overlay */}
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-full border-2 border-[#e1e1e1] flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Camera className="w-6 h-6 text-[#222526]" />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {/* Role Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Role
                  </label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="w-full bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="data-entry">Data Entry</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Role Tag */}
                  <Badge className="bg-[#ffe2db] text-[#e84c25] hover:bg-[#ffe2db] px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                    Admin (all)
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Name
                  </label>
                  <Input
                    placeholder="Name"
                    defaultValue="John"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Last Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Last name
                  </label>
                  <Input
                    placeholder="Last name"
                    defaultValue="Doe"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Company Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Company
                  </label>
                  <Input
                    placeholder="Company"
                    defaultValue="Audemars Piguet"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Title
                  </label>
                  <Input
                    placeholder="Title"
                    defaultValue="CEO"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Email address
                  </label>
                  <Input
                    type="email"
                    placeholder="username@gmail.com"
                    defaultValue="john.doe@audemars-piguet.com"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Change Password
                  </label>
                  <Input
                    type="password"
                    placeholder="*********************"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-full px-6 py-3 h-14 flex-1"
                  >
                    Save changes
                  </Button>
                  <Button
                    onClick={handleDeleteUser}
                    variant="outline"
                    className="bg-[#e1e1e1] hover:bg-[#d1d1d1] border-[#e1e1e1] text-[#222526] rounded-full px-6 py-3 h-14 flex-1"
                  >
                    Delete user
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
