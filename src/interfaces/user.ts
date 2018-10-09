export interface User {
    name: string;
    uid: any;
    email: string;
    phone?: string;
    avatar?: string;
    address?: string;
    age?: number;
    type: string;
    blacklist?: any;
  }