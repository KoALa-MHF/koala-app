export interface UserSession {
  id: number;
  visible?: boolean | true;
  owner?: {
    id?: string | null;
    email?: string | null;
    displayName?: string | null;
  };
}
