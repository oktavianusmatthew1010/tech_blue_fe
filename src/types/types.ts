export interface Schedule {
  id: string;
  caregiverId: string;
  clientName: string;
  serviceName: string;
  imageUrl: string;
  emailAddress: string;
  phone: string;
  dateService: string;
  startTime: string;
  endTime: string;
  serviceNote: string;
  location: Location;
  status: 'upcoming' | 'in-progress' | 'completed' | 'missed';
  tasks: Task[];
  startVisit?: VisitTime;
  endVisit?: VisitTime;
}

export interface Task {
  id: string;
  scheduleId: string;
  taskName: string;
  description: string;
  completed: boolean;
  reason?: string;
}


export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface VisitTime {
  timestamp: string;
  location: Location;
}

export interface Stats {
  total: number;
  missed: number;
  upcoming: number;
  completed: number;
}