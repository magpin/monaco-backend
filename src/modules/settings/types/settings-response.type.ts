export type SettingsData = {
  id: string;
  hotelName: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  timezone: string;
  language: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  allowCancellations: boolean;
  cancellationHoursLimit: number;
  autoConfirm: boolean;
  taxRate: number;
  consumptionTaxRate: number;
  enableCreditCard: boolean;
  enablePse: boolean;
  enableCash: boolean;
  updatedAt: string;
};

export type SettingsResponse = {
  status: number;
  message: string;
  data?: SettingsData;
};
