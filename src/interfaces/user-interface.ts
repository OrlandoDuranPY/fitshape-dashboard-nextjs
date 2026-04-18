export interface UserInterface {
  uuid: string;
  name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
  email: string;
  role: string;
  permissions?: string[];
}
