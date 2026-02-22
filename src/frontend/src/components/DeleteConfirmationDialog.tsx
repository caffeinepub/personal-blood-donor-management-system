import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useDeleteDonor } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Donor } from '../backend';

interface DeleteConfirmationDialogProps {
  donor: Donor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteConfirmationDialog({ donor, open, onOpenChange }: DeleteConfirmationDialogProps) {
  const { mutate: deleteDonor, isPending } = useDeleteDonor();

  const handleDelete = () => {
    deleteDonor(donor.id, {
      onSuccess: () => {
        toast.success('Donor deleted successfully', {
          description: `${donor.name} has been removed from the system`,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error('Failed to delete donor', {
          description: error instanceof Error ? error.message : 'An error occurred',
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{donor.name}</strong> from the donor
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
