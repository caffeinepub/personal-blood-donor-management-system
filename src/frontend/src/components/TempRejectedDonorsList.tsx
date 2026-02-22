import { useGetAllTempRejectedDonors } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

export default function TempRejectedDonorsList() {
  const { data: donors, isLoading } = useGetAllTempRejectedDonors();

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

  const isDonatedStatus = (availableDate: bigint): boolean => {
    // Check if the available date is approximately 3 months (90 days) from now or in the future
    const date = new Date(Number(availableDate) / 1_000_000);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    // If the difference is between 85-95 days, it's likely a donation cooldown
    return diffInDays >= 85 && diffInDays <= 95;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-amber-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!donors || donors.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-white p-12 text-center">
        <p className="text-muted-foreground">No temporarily rejected donors at this time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-amber-50 hover:bg-amber-50">
            <TableHead className="font-semibold text-gray-900">Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
            <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
            <TableHead className="font-semibold text-gray-900">Available Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => {
            const availableDate =
              donor.status.__kind__ === 'temporarilyRejected'
                ? donor.status.temporarilyRejected.availableDate
                : BigInt(0);
            const donated = isDonatedStatus(availableDate);

            return (
              <TableRow key={donor.id.toString()} className="hover:bg-amber-50/50">
                <TableCell className="font-medium">{donor.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    {getBloodGroupLabel(donor.bloodGroup)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
                <TableCell>{formatDate(availableDate)}</TableCell>
                <TableCell>
                  {donated ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Donated</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Rejected</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
