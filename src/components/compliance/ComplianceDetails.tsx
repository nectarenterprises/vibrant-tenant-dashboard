
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FireExtinguisher, ShieldCheck, TestTube, FileText, CalendarCheck, Bell } from 'lucide-react';
import ComplianceItemCard from './ComplianceItemCard';
import ComplianceItemDetail from './ComplianceItemDetail';
import { ComplianceItem } from '@/types/compliance';

// Mock compliance data
const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    name: 'Fire Alarm Testing',
    icon: FireExtinguisher,
    lastCompleted: '2023-02-15',
    nextDue: '2023-05-15',
    status: 'upcoming',
    certificates: [
      { id: '101', name: 'Fire Alarm Certificate 2023', date: '2023-02-15', fileUrl: '#' },
      { id: '102', name: 'Fire Alarm Certificate 2022', date: '2022-02-10', fileUrl: '#' },
      { id: '103', name: 'Fire Alarm Certificate 2021', date: '2021-02-12', fileUrl: '#' },
    ]
  },
  {
    id: '2',
    name: 'Insurance Inspection',
    icon: ShieldCheck,
    lastCompleted: '2023-01-20',
    nextDue: '2024-01-20',
    status: 'completed',
    certificates: [
      { id: '201', name: 'Insurance Certificate 2023', date: '2023-01-20', fileUrl: '#' },
      { id: '202', name: 'Insurance Certificate 2022', date: '2022-01-15', fileUrl: '#' },
    ]
  },
  {
    id: '3',
    name: 'Legionella Testing',
    icon: TestTube,
    lastCompleted: '2022-11-05',
    nextDue: '2023-05-05',
    status: 'overdue',
    certificates: [
      { id: '301', name: 'Legionella Test Report 2022', date: '2022-11-05', fileUrl: '#' },
      { id: '302', name: 'Legionella Test Report 2021', date: '2021-11-10', fileUrl: '#' },
    ]
  },
  {
    id: '4',
    name: 'Asbestos Survey',
    icon: FileText,
    lastCompleted: '2023-03-10',
    nextDue: '2026-03-10',
    status: 'completed',
    certificates: [
      { id: '401', name: 'Asbestos Survey Report 2023', date: '2023-03-10', fileUrl: '#' },
      { id: '402', name: 'Asbestos Survey Report 2020', date: '2020-03-15', fileUrl: '#' },
    ]
  },
  {
    id: '5',
    name: 'Fire Risk Assessment',
    icon: FireExtinguisher,
    lastCompleted: '2022-08-20',
    nextDue: '2023-08-20',
    status: 'upcoming',
    certificates: [
      { id: '501', name: 'Fire Risk Assessment 2022', date: '2022-08-20', fileUrl: '#' },
      { id: '502', name: 'Fire Risk Assessment 2021', date: '2021-08-25', fileUrl: '#' },
    ]
  },
  {
    id: '6',
    name: 'Electrical Safety Check',
    icon: ShieldCheck,
    lastCompleted: '2022-12-05',
    nextDue: '2023-12-05',
    status: 'completed',
    certificates: [
      { id: '601', name: 'Electrical Safety Certificate 2022', date: '2022-12-05', fileUrl: '#' },
      { id: '602', name: 'Electrical Safety Certificate 2021', date: '2021-12-10', fileUrl: '#' },
    ]
  },
  {
    id: '7',
    name: 'Health & Safety Inspection',
    icon: CalendarCheck,
    lastCompleted: '2023-01-15',
    nextDue: '2023-04-15',
    status: 'overdue',
    certificates: [
      { id: '701', name: 'H&S Inspection Report 2023', date: '2023-01-15', fileUrl: '#' },
      { id: '702', name: 'H&S Inspection Report 2022', date: '2022-10-20', fileUrl: '#' },
    ]
  },
  {
    id: '8',
    name: 'Emergency Lighting Test',
    icon: Bell,
    lastCompleted: '2023-02-25',
    nextDue: '2023-08-25',
    status: 'upcoming',
    certificates: [
      { id: '801', name: 'Emergency Lighting Test 2023', date: '2023-02-25', fileUrl: '#' },
      { id: '802', name: 'Emergency Lighting Test 2022', date: '2022-08-20', fileUrl: '#' },
    ]
  }
];

interface ComplianceDetailsProps {
  property: Property;
}

const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ property }) => {
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Count items by status
  const statusCounts = mockComplianceItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property.name} - Compliance</CardTitle>
          <CardDescription>{property.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{statusCounts.completed || 0}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold">{statusCounts.upcoming || 0}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{statusCounts.overdue || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedItem ? (
        <ComplianceItemDetail item={selectedItem} onBack={handleBackToList} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockComplianceItems.map((item) => (
            <ComplianceItemCard 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedItem(item)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplianceDetails;
