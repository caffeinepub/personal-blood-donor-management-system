import { useGetAllAppointedDonors } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

export default function AppointedDonorsList() {
  const { data: donors, isLoading } = useGetAllAppointedDonors();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-blue-200 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!donors || donors.length === 0) {
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
            <TableHead className="font-semibold text-gray-900">Appointment Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Patient Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id.toString()} className="hover:bg-blue-50/50">
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {getBloodGroupLabel(donor.bloodGroup)}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
              <TableCell>
                {donor.status.__kind__ === 'appointed' && formatDate(donor.status.appointed.appointmentDate)}
              </TableCell>
              <TableCell className="font-medium">
                {donor.status.__kind__ === 'appointed' && donor.status.appointed.patientName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
