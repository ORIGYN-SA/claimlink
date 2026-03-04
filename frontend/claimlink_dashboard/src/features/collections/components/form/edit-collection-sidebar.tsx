import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, AlertTriangle, Trash2, Info } from 'lucide-react';
import { AddStorageDialog, DeleteCollectionDialog } from '@/components/common';

interface StorageInfo {
  total: string;
  used: string;
  percentage: number;
  isAlmostFull: boolean;
}

interface EditCollectionSidebarProps {
  storage: StorageInfo;
  onDeleteCollection: () => void;
  description?: string;
  collectionName?: string;
}

export function EditCollectionSidebar({
  storage,
  onDeleteCollection,
  description = "The Minting Studio is your interface to create, manage, and certify real-world assets fully on-chain using ORIGYN's decentralized infrastructure.",
  collectionName = "Collection name"
}: EditCollectionSidebarProps) {
  const [isAddStorageDialogOpen, setIsAddStorageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <div className="w-[400px] flex-shrink-0">
      <Card className="border-[#e1e1e1] bg-white rounded-[25px]">
        <CardContent className="p-6 space-y-6">
          {/* General Information */}
          <div className="space-y-2">
            <h3 className="text-[#222526] font-medium text-lg">General information</h3>
            <p className="text-[#69737c] text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Separator */}
          <hr className="border-[#e1e1e1]" />

          {/* Storage Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#222526]" />
              <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">Storage</span>
            </div>

            <div className="space-y-2">
              <p className="text-[#69737c] font-medium text-sm">Storage included in your collection</p>
              <p className="text-[#222526] font-semibold text-lg">{storage.total}</p>
            </div>

            <p className="text-[#69737c] text-sm leading-relaxed">
              Storage refers to the space used by certificates to host associated data like images, documents, and videos. The larger the content, the more storage is required.
            </p>
          </div>

          {/* Storage Warning Card */}
          {storage.isAlmostFull && (
            <div className="border-2 border-[#ffe2db] rounded-[16px] p-0">
              <div className="bg-white border border-[#ffa58f] rounded-[16px] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#69737c] text-xs font-normal uppercase tracking-wider">
                    Storage
                  </span>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-[#e84c25]" />
                    <Info className="w-3 h-3 text-[#69737c]" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#e1e1e1] rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-[#822b15] to-[#e84c25] h-1 rounded-full transition-all duration-300"
                      style={{ width: `${storage.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#222526] font-medium">
                      {storage.used} / {storage.total}
                    </span>
                    <span className="text-[#e84c25] font-medium">
                      Storage is almost full
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsAddStorageDialogOpen(true)}
                  className="w-full bg-[#222526] hover:bg-[#222526]/90 rounded-full text-white font-medium"
                >
                  Add more storage
                </Button>
              </div>
            </div>
          )}

          {/* Separator */}
          <hr className="border-[#e1e1e1]" />

          {/* Delete Collection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#222526]" />
              <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">
                Delete your collection
              </span>
            </div>

            <p className="text-[#69737c] text-sm leading-relaxed">
              Once deleted, your collection will be permanently removed from the blockchain and cannot be recovered. This action disables the on-chain canister associated with the collection.
            </p>

            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-[#e84c25] font-medium text-sm underline hover:text-[#e84c25]/80 transition-colors"
            >
              Delete collection
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Add Storage Dialog */}
      <AddStorageDialog
        isOpen={isAddStorageDialogOpen}
        onOpenChange={setIsAddStorageDialogOpen}
        currentBalance={3800.02}
        currentStorage={{
          used: storage.used,
          total: storage.total,
          percentage: storage.percentage
        }}
      />

      {/* Delete Collection Dialog */}
      <DeleteCollectionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        collectionName={collectionName}
        onConfirmDelete={onDeleteCollection}
      />
    </div>
  );
}
