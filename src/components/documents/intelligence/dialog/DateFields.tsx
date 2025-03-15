
import React from 'react';
import DocumentExpiryFields from './date-fields/DocumentExpiryFields';
import LeaseKeyDatesFields from './date-fields/LeaseKeyDatesFields';

interface DateFieldsProps {
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
  notificationPeriod: number;
  setNotificationPeriod: (days: number) => void;
  commencementDate: Date | undefined;
  setCommencementDate: (date: Date | undefined) => void;
  leaseExpiryDate: Date | undefined;
  setLeaseExpiryDate: (date: Date | undefined) => void;
}

const DateFields: React.FC<DateFieldsProps> = ({
  expiryDate,
  setExpiryDate,
  notificationPeriod,
  setNotificationPeriod,
  commencementDate,
  setCommencementDate,
  leaseExpiryDate,
  setLeaseExpiryDate
}) => {
  return (
    <>
      <DocumentExpiryFields 
        expiryDate={expiryDate}
        setExpiryDate={setExpiryDate}
        notificationPeriod={notificationPeriod}
        setNotificationPeriod={setNotificationPeriod}
      />
      
      <LeaseKeyDatesFields 
        commencementDate={commencementDate}
        setCommencementDate={setCommencementDate}
        leaseExpiryDate={leaseExpiryDate}
        setLeaseExpiryDate={setLeaseExpiryDate}
      />
    </>
  );
};

export default DateFields;
