import { useGetAllPermanentlyRejectedDonors } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

export default function PermanentRejectedDonorsList() {
  const { data: donors, isLoading } = useGetAllPermanentlyRejectedDonors();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-red-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!donors || donors.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-12 text-center">
        <p className="text-muted-foreground">No permanently rejected donors at this time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-red-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-red-50 hover:bg-red-50">
            <TableHead className="font-semibold text-gray-900">Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
            <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id.toString()} className="hover:bg-red-50/50">
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-red-300 text-red-700">
                  {getBloodGroupLabel(donor.bloodGroup)}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
