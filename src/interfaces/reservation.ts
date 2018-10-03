export interface Reservation {
    id: string;
    notes?: string;
    complexId: any;
    ownerId: string;
    playerId: string;
    fieldId: any;
    totalPrice: number;
    startDate: any;
    duration: number,
    endDate?: any;
    confirmed: boolean;
    status: string;
    createdAt: string;
    complexName: string;
    fieldName: string;
    player: any;
  }