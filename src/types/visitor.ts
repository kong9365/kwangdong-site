export interface VisitData {
  id: number;
  company: string;
  department: string;
  purpose: string;
  visitDate: string;
  requesterName: string;
  requesterPhone: string;
  status: string;
}

export interface VisitorForm {
  name: string;
  phone: string;
  email: string;
  carNumber: string;
  idFileName: string;
}

export interface Checklist {
  security: boolean;
  safety: boolean;
  privacy: boolean;
  upload: boolean;
}

export interface VisitRequest {
  id: number;
  visitorName: string;
  purpose: string;
  date: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}
