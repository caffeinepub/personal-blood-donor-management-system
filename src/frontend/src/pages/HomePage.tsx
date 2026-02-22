import { useState } from 'react';
import DonorTable from '../components/DonorTable';
import BloodRequirementForm from '../components/BloodRequirementForm';
import AppointedDonorsList from '../components/AppointedDonorsList';
import TempRejectedDonorsList from '../components/TempRejectedDonorsList';
import PermanentRejectedDonorsList from '../components/PermanentRejectedDonorsList';
import AddDonorDialog from '../components/AddDonorDialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserPlus, Users, Droplet, Calendar, Clock, XCircle, ArrowLeft } from 'lucide-react';

type Section = 'donors' | 'blood-requirement' | 'appointed' | 'temp-rejected' | 'perm-rejected' | null;

export default function HomePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(null);

  const sections = [
    {
      id: 'donors' as Section,
      title: 'Total Donor List',
      description: 'View and manage all registered blood donors',
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'blood-requirement' as Section,
      title: 'Blood Requirement',
      description: 'Search donors by blood group for urgent needs',
      icon: Droplet,
      color: 'teal',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconColor: 'text-teal-600',
    },
    {
      id: 'appointed' as Section,
      title: 'Appointed Donors',
      description: 'Donors scheduled for blood donation appointments',
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'temp-rejected' as Section,
      title: 'Temporary Rejected Donors',
      description: 'Donors temporarily unavailable with return dates',
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      id: 'perm-rejected' as Section,
      title: 'Permanent Rejected Donors',
      description: 'Donors permanently unable to donate blood',
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'donors':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-emerald-600" />
                <h3 className="text-2xl font-semibold text-gray-900">Total Donor List</h3>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Donor
              </Button>
            </div>
            <DonorTable />
          </div>
        );
      case 'blood-requirement':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-teal-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Blood Requirement</h3>
            </div>
            <BloodRequirementForm />
          </div>
        );
      case 'appointed':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Appointed Donors</h3>
            </div>
            <AppointedDonorsList />
          </div>
        );
      case 'temp-rejected':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-amber-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Temporary Rejected Donors</h3>
            </div>
            <TempRejectedDonorsList />
          </div>
        );
      case 'perm-rejected':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-red-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Permanent Rejected Donors</h3>
            </div>
            <PermanentRejectedDonorsList />
          </div>
        );
      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div className="space-y-6">
        <Button
          onClick={() => setActiveSection(null)}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sections
        </Button>
        {renderSectionContent()}
        <AddDonorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-muted-foreground">Select a section to manage your blood donor database</p>
        </div>
        <Button
          onClick={() => {
            setActiveSection('donors');
            setIsAddDialogOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Donor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${section.borderColor} border-2 ${section.bgColor}`}
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${section.bgColor} border ${section.borderColor}`}>
                    <Icon className={`h-6 w-6 ${section.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddDonorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
