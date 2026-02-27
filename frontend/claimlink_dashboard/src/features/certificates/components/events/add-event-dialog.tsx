/**
 * AddEventDialog Component
 *
 * Modal dialog for adding a new event to a certificate's history.
 * Wraps the AddEventForm and handles the event submission.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddEventForm, type AddEventFormData } from './add-event-form';
import { useAddCertificateEvent } from '../../api/certificates.queries';
import { toast } from 'sonner';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canisterId: string;
  tokenId: string;
  onSuccess?: () => void;
}

export function AddEventDialog({
  open,
  onOpenChange,
  canisterId,
  tokenId,
  onSuccess,
}: AddEventDialogProps) {
  const addEventMutation = useAddCertificateEvent();

  const handleSubmit = async (data: AddEventFormData) => {
    try {
      await addEventMutation.mutateAsync({
        canisterId,
        tokenId,
        event: {
          date: data.date,
          category: data.category,
          description: data.description,
          file: data.file,
        },
      });

      toast.success('Event added successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add event');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Log a new event in the certificate's history. This will be permanently
            recorded on-chain.
          </DialogDescription>
        </DialogHeader>

        <AddEventForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={addEventMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
