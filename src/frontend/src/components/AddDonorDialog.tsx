import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAddDonor } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BloodGroup } from '../backend';

interface AddDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDonorDialog({ open, onOpenChange }: AddDonorDialogProps) {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { mutate: addDonor, isPending } = useAddDonor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !bloodGroup || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    addDonor(
      {
        name,
        bloodGroup: bloodGroup as BloodGroup,
        phoneNumber,
      },
      {
        onSuccess: () => {
          toast.success('Donor added successfully!', {
            description: `${name} has been added to the donor list`,
          });
          onOpenChange(false);
          resetForm();
        },
        onError: (error) => {
          toast.error('Failed to add donor', {
            description: error instanceof Error ? error.message : 'An unknown error occurred',
          });
        },
      }
    );
  };

  const resetForm = () => {
    setName('');
    setBloodGroup('');
    setPhoneNumber('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Donor</DialogTitle>
          <DialogDescription>Enter the donor's information to add them to the database</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter donor name"
              required
              className="border-emerald-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup">
              Blood Group <span className="text-red-500">*</span>
            </Label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger id="bloodGroup" className="border-emerald-300">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A_pos">A Positive (A+)</SelectItem>
                <SelectItem value="A_neg">A Negative (A-)</SelectItem>
                <SelectItem value="B_pos">B Positive (B+)</SelectItem>
                <SelectItem value="B_neg">B Negative (B-)</SelectItem>
                <SelectItem value="AB_pos">AB Positive (AB+)</SelectItem>
                <SelectItem value="AB_neg">AB Negative (AB-)</SelectItem>
                <SelectItem value="O_pos">O Positive (O+)</SelectItem>
                <SelectItem value="O_neg">O Negative (O-)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              required
              className="border-emerald-300"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Donor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
