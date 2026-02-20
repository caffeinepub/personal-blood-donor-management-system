import { useState } from 'react';
import { useGetAllDonors } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Phone, Loader2 } from 'lucide-react';
import PostCallForm from './PostCallForm';
import type { Donor } from '../backend';

export default function DonorTable() {
  const { data: donors, isLoading } = useGetAllDonors();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isPostCallFormOpen, setIsPostCallFormOpen] = useState(false);

  const handleCall = (donor: Donor) => {
    // Open native phone dialer
    window.location.href = `tel:${donor.phoneNumber}`;
    
    // Open post-call form
    setSelectedDonor(donor);
    setIsPostCallFormOpen(true);
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
              <TableHead className="font-semibold text-gray-900">Action</TableHead>
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
                  <Button
                    onClick={() => handleCall(donor)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
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
    </>
  );
}
