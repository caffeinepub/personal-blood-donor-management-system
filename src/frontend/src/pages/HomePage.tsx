import { useState } from 'react';
import DonorTable from '../components/DonorTable';
import BloodRequirementForm from '../components/BloodRequirementForm';
import AppointedDonorsList from '../components/AppointedDonorsList';
import TempRejectedDonorsList from '../components/TempRejectedDonorsList';
import PermanentRejectedDonorsList from '../components/PermanentRejectedDonorsList';
import AddDonorDialog from '../components/AddDonorDialog';
import { Button } from '../components/ui/button';
import { UserPlus } from 'lucide-react';

export default function HomePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-muted-foreground">Manage your blood donor database</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Donor
        </Button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-emerald-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Total Donor List</h3>
        </div>
        <DonorTable />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-teal-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Blood Requirement</h3>
        </div>
        <BloodRequirementForm />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-blue-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Appointed Donors</h3>
        </div>
        <AppointedDonorsList />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-amber-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Temporary Rejected Donors</h3>
        </div>
        <TempRejectedDonorsList />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-red-600" />
          <h3 className="text-2xl font-semibold text-gray-900">Permanent Rejected Donors</h3>
        </div>
        <PermanentRejectedDonorsList />
      </section>

      <AddDonorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
