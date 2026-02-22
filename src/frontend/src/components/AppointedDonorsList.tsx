import { useMemo } from 'react';
import { useGetAllAppointedDonors, useMarkDonorAsDonated, useMarkDonorAsNotDonated } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Donor } from '../backend';

export default function AppointedDonorsList() {
  const { data: donors, isLoading } = useGetAllAppointedDonors();
  const { mutate: markAsDonated, isPending: isDonatedPending } = useMarkDonorAsDonated();
  const { mutate: markAsNotDonated, isPending: isNotDonatedPending } = useMarkDonorAsNotDonated();

  // Sort donors: nulls first, then by lastCalledDate descending (oldest first, most recent last), then by callCount ascending
  const sortedDonors = useMemo(() => {
    if (!donors) return [];
    
    return [...donors].sort((a, b) => {
      // Handle null lastCalledDate - nulls should appear first (donors NOT called recently)
      if (a.lastCalledDate === undefined && b.lastCalledDate === undefined) {
        // Both null, sort by callCount (lower first)
        return Number(a.callCount) - Number(b.callCount);
      }
      if (a.lastCalledDate === undefined) return -1; // a comes first (not called)
      if (b.lastCalledDate === undefined) return 1;  // b comes first (not called)
      
      // Both have lastCalledDate, compare them in DESCENDING order (oldest dates first, most recent last)
      const dateA = Number(a.lastCalledDate);
      const dateB = Number(b.lastCalledDate);
      
      if (dateA === dateB) {
        // Same date, sort by callCount (lower first)
        return Number(a.callCount) - Number(b.callCount);
      }
      
      // Different dates, sort DESCENDING (older dates have smaller timestamps, so they come first)
      return dateA - dateB;
    });
  }, [donors]);

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

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDonated = (donorId: bigint, donorName: string) => {
    markAsDonated(donorId, {
      onSuccess: () => {
        toast.success('Donor marked as donated', {
          description: `${donorName} has been moved to temporary rejected donors and will be available after 3 months`,
        });
      },
      onError: (error) => {
        toast.error('Failed to mark donor as donated', {
          description: error instanceof Error ? error.message : 'An error occurred',
        });
      },
    });
  };

  const handleNotDonated = (donorId: bigint, donorName: string) => {
    markAsNotDonated(donorId, {
      onSuccess: () => {
        toast.success('Donor returned to active status', {
          description: `${donorName} is now available for appointments`,
        });
      },
      onError: (error) => {
        toast.error('Failed to update donor status', {
          description: error instanceof Error ? error.message : 'An error occurred',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-blue-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!sortedDonors || sortedDonors.length === 0) {
    return (
      <div className="rounded-lg border border-blue-200 bg-white p-12 text-center">
        <p className="text-muted-foreground">No appointed donors at this time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50 hover:bg-blue-50">
            <TableHead className="font-semibold text-gray-900">Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
            <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
            <TableHead className="font-semibold text-gray-900">Calls</TableHead>
            <TableHead className="font-semibold text-gray-900">Appointment Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Patient Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDonors.map((donor) => (
            <TableRow key={donor.id.toString()} className="hover:bg-blue-50/50">
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {getBloodGroupLabel(donor.bloodGroup)}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
              <TableCell className="font-medium">{donor.callCount.toString()}</TableCell>
              <TableCell>
                {donor.status.__kind__ === 'appointed' && formatDate(donor.status.appointed.appointmentDate)}
              </TableCell>
              <TableCell className="font-medium">
                {donor.status.__kind__ === 'appointed' && donor.status.appointed.patientName}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDonated(donor.id, donor.name)}
                    size="sm"
                    disabled={isDonatedPending || isNotDonatedPending}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isDonatedPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Donated
                  </Button>
                  <Button
                    onClick={() => handleNotDonated(donor.id, donor.name)}
                    size="sm"
                    variant="outline"
                    disabled={isDonatedPending || isNotDonatedPending}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {isNotDonatedPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Not Donated
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
