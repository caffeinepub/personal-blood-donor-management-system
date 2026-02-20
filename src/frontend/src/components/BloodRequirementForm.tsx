import { useState } from 'react';
import { useGetDonorsByBloodGroup, useGetAllDonors } from '../hooks/useQueries';
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

  const { data: filteredDonors, isLoading: isLoadingFiltered } = useGetDonorsByBloodGroup(
    selectedBloodGroup && selectedBloodGroup !== 'any' ? selectedBloodGroup as BloodGroup : null
  );
  
  const { data: allDonors, isLoading: isLoadingAll } = useGetAllDonors();

  const donors = selectedBloodGroup === 'any' ? allDonors : filteredDonors;
  const isLoading = selectedBloodGroup === 'any' ? isLoadingAll : isLoadingFiltered;

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

  return (
    <>
      <Card className="border-teal-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Find Donors by Blood Group</CardTitle>
          <CardDescription>Select a blood group to view available donors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="blood-group">Required Blood Group</Label>
            <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
              <SelectTrigger id="blood-group" className="border-emerald-300">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
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

          {selectedBloodGroup && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Matching Donors</h4>
                {donors && (
                  <Badge variant="outline" className="border-teal-300 text-teal-700">
                    {donors.length} {donors.length === 1 ? 'donor' : 'donors'} found
                  </Badge>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50/50 p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                </div>
              ) : !donors || donors.length === 0 ? (
                <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No available donors found for this blood group.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-teal-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-teal-50 hover:bg-teal-50">
                        <TableHead className="font-semibold text-gray-900">Name</TableHead>
                        <TableHead className="font-semibold text-gray-900">Blood Group</TableHead>
                        <TableHead className="font-semibold text-gray-900">Phone Number</TableHead>
                        <TableHead className="font-semibold text-gray-900">Action</TableHead>
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
              )}
            </div>
          )}
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
