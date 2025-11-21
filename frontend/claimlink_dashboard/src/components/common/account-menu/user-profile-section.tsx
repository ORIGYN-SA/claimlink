interface UserProfileSectionProps {
  userName?: string;
  userInitials?: string;
  userRole?: string;
}

export function UserProfileSection({
  userName = "Jane Doe",
  userInitials = "JD",
  userRole = "Admin (all)",
}: UserProfileSectionProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#222526]">{userInitials}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[#85f1ff] text-sm font-normal tracking-[0.8px] mb-1">
              Welcome back
            </p>
            <h2 className="text-white text-xl font-semibold">{userName}</h2>
          </div>
          <div className="bg-[#85f1ff] px-3 py-1 rounded-full">
            <span className="text-[#061937] text-xs font-semibold uppercase">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
