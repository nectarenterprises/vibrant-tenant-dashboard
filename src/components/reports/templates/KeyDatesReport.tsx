
import React from 'react';
import { Property } from '@/types/property';
import { format, addMonths, isBefore, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface KeyDatesReportProps {
  properties: Property[];
}

const KeyDatesReport: React.FC<KeyDatesReportProps> = ({ properties }) => {
  // Generate key dates from properties with some mock additional dates
  const getCurrentDate = () => new Date();
  const getThreeMonthsFromNow = () => addMonths(new Date(), 3);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const generateKeyDates = () => {
    const keyDates: Array<{
      id: string;
      title: string;
      date: string;
      propertyName: string;
      type: 'lease' | 'compliance' | 'payment' | 'inspection';
      status: 'overdue' | 'upcoming' | 'future';
    }> = [];

    properties.forEach(property => {
      // Lease expiry
      if (property.leaseExpiry) {
        const leaseExpiryDate = new Date(property.leaseExpiry);
        const status = isBefore(leaseExpiryDate, getCurrentDate())
          ? 'overdue'
          : isBefore(leaseExpiryDate, getThreeMonthsFromNow())
          ? 'upcoming'
          : 'future';
        
        keyDates.push({
          id: `lease-${property.id}`,
          title: 'Lease Expiry',
          date: property.leaseExpiry,
          propertyName: property.name,
          type: 'lease',
          status
        });
      }

      // Next payment date
      if (property.nextPaymentDate) {
        const paymentDate = new Date(property.nextPaymentDate);
        const status = isBefore(paymentDate, getCurrentDate())
          ? 'overdue'
          : isBefore(paymentDate, getThreeMonthsFromNow())
          ? 'upcoming'
          : 'future';
        
        keyDates.push({
          id: `payment-${property.id}`,
          title: 'Rent Payment Due',
          date: property.nextPaymentDate,
          propertyName: property.name,
          type: 'payment',
          status
        });
      }

      // Mock compliance dates
      const complianceDate = addMonths(getCurrentDate(), Math.floor(Math.random() * 6) - 1);
      const complianceStatus = isBefore(complianceDate, getCurrentDate())
        ? 'overdue'
        : isBefore(complianceDate, getThreeMonthsFromNow())
        ? 'upcoming'
        : 'future';
      
      keyDates.push({
        id: `compliance-${property.id}`,
        title: 'Fire Safety Inspection',
        date: format(complianceDate, 'yyyy-MM-dd'),
        propertyName: property.name,
        type: 'compliance',
        status: complianceStatus
      });

      // Mock inspection dates
      const inspectionDate = addMonths(getCurrentDate(), Math.floor(Math.random() * 4) + 1);
      
      keyDates.push({
        id: `inspection-${property.id}`,
        title: 'Property Inspection',
        date: format(inspectionDate, 'yyyy-MM-dd'),
        propertyName: property.name,
        type: 'inspection',
        status: 'future'
      });
    });

    // Sort by date
    return keyDates.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  const keyDates = generateKeyDates();

  // Count dates by status
  const overdueDates = keyDates.filter(date => date.status === 'overdue');
  const upcomingDates = keyDates.filter(date => date.status === 'upcoming');
  const futureDates = keyDates.filter(date => date.status === 'future');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Key Dates Timeline</h1>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-800">Overdue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 mb-2">{overdueDates.length}</div>
            <p className="text-sm text-red-600">
              {overdueDates.length === 0
                ? 'No overdue items'
                : `${overdueDates.length} items require immediate attention`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg text-yellow-800">Upcoming (Next 3 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700 mb-2">{upcomingDates.length}</div>
            <p className="text-sm text-yellow-600">
              {upcomingDates.length === 0
                ? 'No upcoming items in the next 3 months'
                : `${upcomingDates.length} items due in the next 3 months`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-green-800">Future Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-2">{futureDates.length}</div>
            <p className="text-sm text-green-600">
              {futureDates.length === 0
                ? 'No future dates scheduled'
                : `${futureDates.length} items scheduled for the future`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {keyDates.map((keyDate, index) => (
              <div key={keyDate.id} className="relative flex items-start group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow border border-slate-200 group-hover:border-slate-300 ml-0.5">
                  <CalendarIcon className={`w-5 h-5 ${
                    keyDate.status === 'overdue' 
                      ? 'text-red-500' 
                      : keyDate.status === 'upcoming'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`} />
                </div>
                <div className="ml-4 bg-white p-3 rounded-lg shadow border border-slate-200 group-hover:border-slate-300">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-slate-900">{keyDate.title}</div>
                    <Badge className={
                      keyDate.status === 'overdue'
                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                        : keyDate.status === 'upcoming'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        : 'bg-green-100 text-green-800 hover:bg-green-100'
                    }>
                      {keyDate.status === 'overdue' ? 'Overdue' : keyDate.status === 'upcoming' ? 'Upcoming' : 'Future'}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-slate-500">{formatDate(keyDate.date)}</div>
                  <div className="text-sm">{keyDate.propertyName}</div>
                  <div className="mt-1">
                    <Badge variant="outline" className={
                      keyDate.type === 'lease'
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                        : keyDate.type === 'compliance'
                        ? 'bg-purple-50 text-purple-700 hover:bg-purple-50'
                        : keyDate.type === 'payment'
                        ? 'bg-pink-50 text-pink-700 hover:bg-pink-50'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
                    }>
                      {keyDate.type.charAt(0).toUpperCase() + keyDate.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Key Dates Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Event</th>
                  <th className="py-2 px-4 text-left">Property</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {keyDates.map(keyDate => (
                  <tr key={keyDate.id} className="border-b">
                    <td className="py-2 px-4">{formatDate(keyDate.date)}</td>
                    <td className="py-2 px-4">{keyDate.title}</td>
                    <td className="py-2 px-4">{keyDate.propertyName}</td>
                    <td className="py-2 px-4">
                      <Badge variant="outline" className={
                        keyDate.type === 'lease'
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                          : keyDate.type === 'compliance'
                          ? 'bg-purple-50 text-purple-700 hover:bg-purple-50'
                          : keyDate.type === 'payment'
                          ? 'bg-pink-50 text-pink-700 hover:bg-pink-50'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
                      }>
                        {keyDate.type.charAt(0).toUpperCase() + keyDate.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">
                      <Badge className={
                        keyDate.status === 'overdue'
                          ? 'bg-red-100 text-red-800 hover:bg-red-100'
                          : keyDate.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          : 'bg-green-100 text-green-800 hover:bg-green-100'
                      }>
                        {keyDate.status.charAt(0).toUpperCase() + keyDate.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyDatesReport;
