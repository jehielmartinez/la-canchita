export interface Reservation {
    id: string;
    complex: any;
    ownerId: string;
    playerId: string;
    fieldId: any;
    totalPrice: number;
    duration: number,
    date: string;
    status: string;
    createdAt: string;
    fieldName: string;
    player: any;
    reservedHours: any;
    startDate: string;
    endDate: string;
  }