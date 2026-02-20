import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useUpdateDonorStatus } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Donor, DonorStatus } from '../backend';

interface PostCallFormProps {
  donor: Donor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ResponseType = 'approved' | 'rejected' | 'notAttend';
type RejectionType = 'temporary' | 'permanent';

export default function PostCallForm({ donor, open, onOpenChange }: PostCallFormProps) {
  const [responseType, setResponseType] = useState<ResponseType>('approved');
  const [rejectionType, setRejectionType] = useState<RejectionType>('temporary');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [availableDate, setAvailableDate] = useState('');

  const { mutate: updateStatus, isPending } = useUpdateDonorStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (responseType === 'notAttend') {
      onOpenChange(false);
      resetForm();
      return;
    }

    if (responseType === 'approved') {
      if (!appointmentDate || !patientName) {
        toast.error('Please fill in all required fields');
        return;
      }

      const status: DonorStatus = {
        __kind__: 'appointed',
        appointed: {
          appointmentDate: BigInt(new Date(appointmentDate).getTime() * 1_000_000),
          patientName,
        },
      };

      updateStatus(
        { donorId: donor.id, newStatus: status },
        {
          onSuccess: () => {
            toast.success('Donor approved!', {
              description: `${donor.name} has been marked as appointed`,
            });
            onOpenChange(false);
            resetForm();
          },
          onError: () => {
            toast.error('Failed to update donor status');
          },
        }
      );
    } else if (responseType === 'rejected') {
      if (rejectionType === 'temporary') {
        if (!availableDate) {
          toast.error('Please select an available date');
          return;
        }

        const status: DonorStatus = {
          __kind__: 'temporarilyRejected',
          temporarilyRejected: {
            availableDate: BigInt(new Date(availableDate).getTime() * 1_000_000),
          },
        };

        updateStatus(
          { donorId: donor.id, newStatus: status },
          {
            onSuccess: () => {
              toast.success('Donor temporarily rejected', {
                description: `${donor.name} will be available after ${new Date(availableDate).toLocaleDateString()}`,
              });
              onOpenChange(false);
              resetForm();
            },
            onError: () => {
              toast.error('Failed to update donor status');
            },
          }
        );
      } else {
        const status: DonorStatus = {
          __kind__: 'permanentlyRejected',
          permanentlyRejected: null,
        };

        updateStatus(
          { donorId: donor.id, newStatus: status },
          {
            onSuccess: () => {
              toast.success('Donor permanently rejected', {
                description: `${donor.name} has been marked as permanently rejected`,
              });
              onOpenChange(false);
              resetForm();
            },
            onError: () => {
              toast.error('Failed to update donor status');
            },
          }
        );
      }
    }
  };

  const resetForm = () => {
    setResponseType('approved');
    setRejectionType('temporary');
    setAppointmentDate('');
    setPatientName('');
    setAvailableDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Post-Call Response</DialogTitle>
          <DialogDescription>
            Record the outcome of your call with {donor.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Response</Label>
            <RadioGroup value={responseType} onValueChange={(value) => setResponseType(value as ResponseType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <Label htmlFor="approved" className="font-normal">
                  Approved
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected" className="font-normal">
                  Rejected
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="notAttend" id="notAttend" />
                <Label htmlFor="notAttend" className="font-normal">
                  Not Attend
                </Label>
              </div>
            </RadioGroup>
          </div>

          {responseType === 'approved' && (
            <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">
                  Appointment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">
                  Patient Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  required
                  className="border-blue-300"
                />
              </div>
            </div>
          )}

          {responseType === 'rejected' && (
            <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="space-y-4">
                <Label>Rejection Type</Label>
                <RadioGroup value={rejectionType} onValueChange={(value) => setRejectionType(value as RejectionType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temporary" id="temporary" />
                    <Label htmlFor="temporary" className="font-normal">
                      Temporary Rejected
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent" className="font-normal">
                      Permanent Rejected
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {rejectionType === 'temporary' && (
                <div className="space-y-2">
                  <Label htmlFor="availableDate">
                    Available Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                    required
                    className="border-amber-300"
                  />
                </div>
              )}
            </div>
          )}

          {responseType === 'notAttend' && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-muted-foreground">
                No changes will be made to the donor's status.
              </p>
            </div>
          )}

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
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
