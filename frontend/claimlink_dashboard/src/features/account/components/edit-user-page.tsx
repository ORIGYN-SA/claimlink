import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { mockUsers } from "@/shared/data";
import type { User } from "../types/account.types";
import { DeleteUserDialog } from "./delete-user-dialog";

interface EditUserPageProps {
  userId: string;
}

export function EditUserPage({ userId }: EditUserPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    role: "admin",
    firstName: "",
    lastName: "",
    company: "",
    title: "",
    email: "",
    password: "",
    access: [] as string[],
  });

  // Load user data on mount
  useEffect(() => {
    const foundUser = mockUsers.find((u) => u.id === parseInt(userId));
    if (foundUser) {
      setUser(foundUser);
      const [firstName, ...lastNameParts] = foundUser.username.split(' ');
      setFormData({
        role: foundUser.access[0]?.toLowerCase().replace(/\s+/g, '-') || "viewer",
        firstName: firstName || "",
        lastName: lastNameParts.join(' ') || "",
        company: "Audemars Piguet",
        title: foundUser.title,
        email: foundUser.email,
        password: "",
        access: foundUser.access,
      });
    } else {
      toast.error("User not found");
      navigate({ to: "/account" });
    }
  }, [userId, navigate]);

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic with backend
    console.log("Saving changes...", formData);

    toast.success("Changes saved successfully", {
      description: `${formData.firstName} ${formData.lastName}'s profile has been updated.`,
    });

    // After successful save, navigate back to account page
    setTimeout(() => {
      navigate({ to: "/account" });
    }, 1000);
  };

  const handleDeleteUser = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete user logic with backend
    console.log("Deleting user...", userId);

    toast.success("User deleted successfully", {
      description: `${formData.firstName} ${formData.lastName} has been removed from your account.`,
    });

    setIsDeleteDialogOpen(false);

    // Navigate back to account page after deletion
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

  const handleRemoveAccessTag = (accessToRemove: string) => {
    setFormData({
      ...formData,
      access: formData.access.filter((a) => a !== accessToRemove),
    });
  };

  const getInitials = () => {
    if (formData.firstName || formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.username.split(' ').map((n) => n[0]).join('').toUpperCase() || "?";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#69737c]">Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Profile Form */}
        <div className="flex justify-center">
          <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-4xl">
            <CardContent className="p-10">
              <div className="flex gap-10 items-start">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="w-64 h-64 cursor-pointer" onClick={handleAvatarClick}>
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="User avatar" />
                      ) : (
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-6xl">
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {/* Edit icon overlay */}
                    <div 
                      onClick={handleAvatarClick}
                      className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-full border-2 border-[#e1e1e1] flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    >
                      <Camera className="w-6 h-6 text-[#222526]" />
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

                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                  {/* Role Section */}
                  <div className="space-y-3">
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

                    {/* Role Tags */}
                    <div className="flex flex-wrap gap-2">
                      {formData.access.map((access, idx) => (
                        <Badge 
                          key={idx}
                          className="bg-[#ffe2db] text-[#e84c25] hover:bg-[#ffe2db] px-3 py-1 rounded-full flex items-center gap-2 w-fit"
                        >
                          {access}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAccessTag(access)}
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
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
                      Change Password
                    </label>
                    <Input
                      type="password"
                      placeholder="*********************"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={`${formData.firstName} ${formData.lastName}`}
      />
    </>
  );
}
