interface User {
  id: string;
  email: string;
  status?: string | null;
  isOnline?: boolean | null;
}

interface Friends {
  id: string;
  email: string;
  status?: string | null;
  friend_id: string;
}

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}
