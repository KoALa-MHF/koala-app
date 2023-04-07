export interface UserSession {
  id: number;
  owner?: {
    email?: string | null;
  };
}
