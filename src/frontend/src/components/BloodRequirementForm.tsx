import { useState } from 'react';
import { useGetDonorsByBloodGroup, useGetAllDonors, useRecordCall } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Phone, Loader2 } from 'lucide-react';
import PostCallForm from './PostCallForm';
import { BloodGroup, type Donor } from '../backend';

export default function BloodRequirementForm() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isPostCallFormOpen, setIsPostCallFormOpen] = useState(false);
  const { mutate: recordCall, isPending: isRecordingCall } = useRecordCall();
  const [callingDonorId, setCallingDonorId] = useState<bigint | null>(null);

  const { data: filteredDonors, isLoading: isLoadingFiltered } = useGetDonorsByBloodGroup(
    selectedBloodGroup && selectedBloodGroup !== 'any' ? selectedBloodGroup as BloodGroup : null
  );
  
  const { data: allDonors, isLoading: isLoadingAll } = useGetAllDonors();

  const donors = selectedBloodGroup === 'any' ? allDonors : filteredDonors;
  const isLoading = selectedBloodGroup === 'any' ? isLoadingAll : isLoadingFiltered;

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

  return (
    <>
      <Card className="border-teal-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Find Donors by Blood Group</CardTitle>
          <CardDescription>Select a blood group to view available donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                <SelectTrigger id="bloodGroup" className="border-teal-300">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="A_pos">A+</SelectItem>
                  <SelectItem value="A_neg">A-</SelectItem>
                  <SelectItem value="B_pos">B+</SelectItem>
                  <SelectItem value="B_neg">B-</SelectItem>
                  <SelectItem value="AB_pos">AB+</SelectItem>
                  <SelectItem value="AB_neg">AB-</SelectItem>
                  <SelectItem value="O_pos">O+</SelectItem>
                  <SelectItem value="O_neg">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedBloodGroup && (
              <div className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center rounded-lg border border-teal-200 bg-white p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                  </div>
                ) : !donors || donors.length === 0 ? (
                  <div className="rounded-lg border border-teal-200 bg-white p-12 text-center">
                    <p className="text-muted-foreground">No donors found for this blood group.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-teal-200 bg-white shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-teal-50 hover:bg-teal-50">
                          <TableHead className="font-semibold text-gray-900">Name</TableHead>
                          <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
                          <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
                          <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donors.map((donor) => (
                          <TableRow key={donor.id.toString()} className="hover:bg-teal-50/50">
                            <TableCell className="font-medium">{donor.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-teal-300 text-teal-700">
                                {getBloodGroupLabel(donor.bloodGroup)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{donor.phoneNumber}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleCall(donor)}
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700"
                                disabled={isRecordingCall && callingDonorId === donor.id}
                              >
                                {isRecordingCall && callingDonorId === donor.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Phone className="mr-2 h-4 w-4" />
                                )}
                                Call
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
