export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: 'USER' | 'BUSINESS_OWNER' | 'ADMIN';
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}
