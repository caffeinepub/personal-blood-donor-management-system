import { useState } from 'react';
import { useGetAllDonors, useRecordCall } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Phone, Loader2, Pencil, Trash2 } from 'lucide-react';
import PostCallForm from './PostCallForm';
import EditDonorDialog from './EditDonorDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import type { Donor } from '../backend';

export default function DonorTable() {
  const { data: donors, isLoading } = useGetAllDonors();
  const { mutate: recordCall, isPending: isRecordingCall } = useRecordCall();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isPostCallFormOpen, setIsPostCallFormOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [deletingDonor, setDeletingDonor] = useState<Donor | null>(null);
  const [callingDonorId, setCallingDonorId] = useState<bigint | null>(null);

  const handleCall = (donor: Donor) => {
    setCallingDonorId(donor.id);
    recordCall(donor.id, {
      onSuccess: () => {
        // Open native phone dialer after recording the call
        window.location.href = `tel:${donor.phoneNumber}`;
        
        // Open post-call form
        setSelectedDonor(donor);
        setIsPostCallFormOpen(true);
        setCallingDonorId(null);
      },
      onError: () => {
        setCallingDonorId(null);
      },
    });
  };

  const getBloodGroupLabel = (bloodGroup: string): string => {
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
    return mapping[bloodGroup] || bloodGroup;
  };

  const getStatusBadge = (status: Donor['status']) => {
    if (status.__kind__ === 'active') {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
    }
    if (status.__kind__ === 'appointed') {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Appointed</Badge>;
    }
    if (status.__kind__ === 'temporarilyRejected') {
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Temp. Rejected</Badge>;
    }
    if (status.__kind__ === 'permanentlyRejected') {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Perm. Rejected</Badge>;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-emerald-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!donors || donors.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-white p-12 text-center">
        <p className="text-muted-foreground">No donors found. Add your first donor to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50 hover:bg-emerald-50">
              <TableHead className="font-semibold text-gray-900">Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
              <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donors.map((donor) => (
              <TableRow key={donor.id.toString()} className="hover:bg-emerald-50/50">
                <TableCell className="font-medium">{donor.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                    {getBloodGroupLabel(donor.bloodGroup)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
                <TableCell>{getStatusBadge(donor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleCall(donor)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={isRecordingCall && callingDonorId === donor.id}
                    >
                      {isRecordingCall && callingDonorId === donor.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Phone className="mr-2 h-4 w-4" />
                      )}
                      Call
                    </Button>
                    <Button
                      onClick={() => setEditingDonor(donor)}
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setDeletingDonor(donor)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDonor && (
        <PostCallForm
          donor={selectedDonor}
          open={isPostCallFormOpen}
          onOpenChange={setIsPostCallFormOpen}
        />
      )}

      {editingDonor && (
        <EditDonorDialog
          donor={editingDonor}
          open={!!editingDonor}
          onOpenChange={(open) => !open && setEditingDonor(null)}
        />
      )}

      {deletingDonor && (
        <DeleteConfirmationDialog
          donor={deletingDonor}
          open={!!deletingDonor}
          onOpenChange={(open) => !open && setDeletingDonor(null)}
        />
      )}
    </>
  );
}
