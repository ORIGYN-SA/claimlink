import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreateUserPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role: "admin",
    firstName: "",
    lastName: "",
    company: "Audemars Piguet",
    title: "",
    email: "",
    password: "",
  });

  const handleCreateUser = () => {
    // TODO: Implement user creation logic with backend
    // For now, simulate user creation
    console.log("Creating user...", formData);

    // Show success toast
    toast.success("User created successfully", {
      description: `${formData.firstName} ${formData.lastName} has been added to your account.`,
    });

    // After successful creation, navigate back to account page
    setTimeout(() => {
      navigate({ to: "/account" });
    }, 1000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (formData.firstName || formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="flex justify-center">
        <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-[526px]">
          <CardContent className="p-10">
            <div className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 cursor-pointer" onClick={handleAvatarClick}>
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-3xl">
                        {getInitials() || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Edit icon overlay */}
                  <div 
                    onClick={handleAvatarClick}
                    className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full border-2 border-[#e1e1e1] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  >
                    <Camera className="w-5 h-5 text-[#222526]" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6f6d66]">
                  Role
                </label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
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
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
