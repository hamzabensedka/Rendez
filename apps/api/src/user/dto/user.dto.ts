export class UserDto {
  id: number;
  name: string;
  email: string;
  profile: ProfileDto;
}

export class ProfileDto {
  id: number;
  bio: string;
  avatar: string;
}