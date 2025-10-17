export interface NotificationCountInterface {
  count: number;
}

export interface NotificationInterface {
  id: string;
  order_number: string | null;
  title: string;
  description: string;
  action_url: string;
  is_read: boolean;
  order_status: number | null;
  created_at: string;
  created_at_display: string;
}

export interface ResponseReadNotificationInterface {
  error: boolean;
  message?: string;
}

export interface NotificationReadInterface {}
