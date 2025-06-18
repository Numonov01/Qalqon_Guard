export interface IUserItem {
  id: string;
  email: string;
  phone: string;
  avatar: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
}
