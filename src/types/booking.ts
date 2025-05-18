export type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  flightNumber?: string | null;
  personen: string[];
  guest: boolean;
  createdAt: string;
};
