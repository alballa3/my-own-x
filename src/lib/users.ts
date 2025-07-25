
interface Session {
    session_id: string,
    expiresAt: Date | string,
    createdAt: Date | string
}

interface IUser {
    id: string,
    name: string,
    email: string,
    password: string,
    session: Session[],
}
export interface UserInDB extends IUser {
    created_at: Date | String
}
export async function getUserFrontEnd(): Promise<UserInDB | null> {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/session`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        // Not authenticated or server error
        return null;
      }
  
      const json = await response.json();
      return json || null;
    } catch (err) {
      console.error("getUserFrontEnd error:", err);
      return null;
    }
  }
  