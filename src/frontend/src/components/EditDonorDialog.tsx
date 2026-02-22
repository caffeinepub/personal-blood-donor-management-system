import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useEditDonor } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BloodGroup, type Donor } from '../backend';

interface EditDonorDialogProps {
  donor: Donor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditDonorDialog({ donor, open, onOpenChange }: EditDonorDialogProps) {
  const [name, setName] = useState(donor.name);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(donor.bloodGroup);
  const [phoneNumber, setPhoneNumber] = useState(donor.phoneNumber);

  const { mutate: editDonor, isPending } = useEditDonor();

  useEffect(() => {
    if (open) {
      setName(donor.name);
      setBloodGroup(donor.bloodGroup);
      setPhoneNumber(donor.phoneNumber);
    }
  }, [open, donor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    editDonor(
      {
        id: donor.id,
        name: name.trim(),
        bloodGroup,
        phoneNumber: phoneNumber.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Donor updated successfully!', {
            description: `${name}'s information has been updated`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error('Failed to update donor', {
            description: error instanceof Error ? error.message : 'An error occurred',
          });
        },
      }
    );
  };

  const getBloodGroupLabel = (bg: BloodGroup): string => {
    const mapping: Record<string, string> = {
      A_pos: 'A+',
      A_neg: 'A-',
      B_pos: 'B+',
      B_neg: 'B-',
      AB_pos: 'AB+',
      AB_neg: 'AB-',
      O_pos: 'O+',
      O_neg: 'O-',
    };
    return mapping[bg] || bg;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Donor</DialogTitle>
          <DialogDescription>
            Update the donor's information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter donor name"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bloodGroup">Blood Group</Label>
            <Select
              value={bloodGroup}
              onValueChange={(value) => setBloodGroup(value as BloodGroup)}
              disabled={isPending}
            >
              <SelectTrigger id="edit-bloodGroup">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BloodGroup).map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {getBloodGroupLabel(bg)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phoneNumber">Phone Number</Label>
            <Input
              id="edit-phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
