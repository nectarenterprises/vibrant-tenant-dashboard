
import { EventData } from '@/types/property';

// Mock data for calendar events since we don't have the actual table
export const getMockCalendarEvents = (userId: string): EventData[] => {
  return [
    {
      id: '1',
      title: 'Rent Payment Due',
      date: new Date().toISOString(),
      type: 'rent',
      propertyId: '1',
      propertyName: 'Property 1'
    },
    {
      id: '2',
      title: 'Maintenance Check',
      date: new Date(Date.now() + 86400000).toISOString(),
      type: 'maintenance',
      propertyId: '2',
      propertyName: 'Property 2'
    }
  ];
};

export const getMockPropertyEvents = (propertyId: string): EventData[] => {
  return [
    {
      id: '1',
      title: 'Rent Payment Due',
      date: new Date().toISOString(),
      type: 'rent',
      propertyId,
      propertyName: 'Property Name'
    },
    {
      id: '2',
      title: 'Inspection',
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
      type: 'inspection',
      propertyId,
      propertyName: 'Property Name'
    }
  ];
};
