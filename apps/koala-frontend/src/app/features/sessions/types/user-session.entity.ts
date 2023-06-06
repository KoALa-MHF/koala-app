export interface UserSession {
  id: number;
  owner?: {
    id?: string | null;
    email?: string | null;
  };
}
