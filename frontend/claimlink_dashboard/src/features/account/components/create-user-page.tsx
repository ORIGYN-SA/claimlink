import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";

export function CreateUserPage() {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    // TODO: Implement user creation logic
    console.log("Creating user...");
    // After successful creation, navigate back to account page
    navigate({ to: "/account" });
  };

  return (
    <div className="space-y-6">

      {/* Form Section */}
      <div className="flex justify-center">
        <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-[526px]">
          <CardContent className="p-10">
            <div className="space-y-6">
              {/* Role Dropdown */}
              <div className="space-y-2">
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
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6f6d66]">
                  Name
                </label>
                <Input
                  placeholder="Name"
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
                  className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6f6d66]">
                  Create password
                </label>
                <Input
                  type="password"
                  placeholder="*********************"
                  className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                />
              </div>

              {/* Create User Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateUser}
                  className="w-full bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-full px-6 py-3 h-14"
                >
                  Create user
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
