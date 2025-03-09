
import { LucideIcon } from 'lucide-react';

export interface ComplianceCertificate {
  id: string;
  name: string;
  date: string;
  fileUrl: string;
}

export interface ComplianceItem {
  id: string;
  name: string;
  icon: LucideIcon;
  lastCompleted: string;
  nextDue: string;
  status: 'completed' | 'upcoming' | 'overdue';
  certificates: ComplianceCertificate[];
}
