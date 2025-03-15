
import { ComplianceItem } from '@/types/compliance';
import { FileText, Droplet, Zap, Building, AlertTriangle, Gauge } from 'lucide-react';

// Mock data for compliance items since we don't have the actual table
export const getMockComplianceItems = (userId: string): ComplianceItem[] => {
  return [
    {
      id: '1',
      name: 'Fire Risk Assessment',
      icon: AlertTriangle,
      lastCompleted: new Date(Date.now() - 86400000 * 30).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 335).toISOString(),
      status: 'completed',
      certificates: []
    },
    {
      id: '2',
      name: 'Electrical Safety',
      icon: Zap,
      lastCompleted: new Date(Date.now() - 86400000 * 90).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 275).toISOString(),
      status: 'completed',
      certificates: []
    }
  ];
};

export const getMockPropertyComplianceItems = (propertyId: string): ComplianceItem[] => {
  return [
    {
      id: '1',
      name: 'Fire Risk Assessment',
      icon: AlertTriangle,
      lastCompleted: new Date(Date.now() - 86400000 * 30).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 335).toISOString(),
      status: 'completed',
      certificates: []
    },
    {
      id: '2',
      name: 'Electrical Safety',
      icon: Zap,
      lastCompleted: new Date(Date.now() - 86400000 * 90).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 275).toISOString(),
      status: 'completed',
      certificates: []
    },
    {
      id: '3',
      name: 'Gas Inspection',
      icon: Droplet,
      lastCompleted: new Date(Date.now() - 86400000 * 180).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 185).toISOString(),
      status: 'upcoming',
      certificates: []
    },
    {
      id: '4',
      name: 'Building Insurance',
      icon: Building,
      lastCompleted: new Date(Date.now() - 86400000 * 10).toISOString(),
      nextDue: new Date(Date.now() + 86400000 * 355).toISOString(),
      status: 'completed',
      certificates: []
    },
    {
      id: '5',
      name: 'Energy Performance',
      icon: Gauge,
      lastCompleted: new Date(Date.now() - 86400000 * 365).toISOString(),
      nextDue: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'overdue',
      certificates: []
    }
  ];
};
