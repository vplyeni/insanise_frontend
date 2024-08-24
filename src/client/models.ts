export type Body_login_login_access_token = {
  username: string;
  password: string;
};

export type HTTPValidationError = {
  detail?: Array<ValidationError>;
};

export type ItemCreate = {
  title: string;
  description?: string | null;
};

export type ItemPublic = {
  title: string;
  description?: string | null;
  id: string;
  owner_id: string;
};

export type ItemUpdate = {
  title?: string | null;
  description?: string | null;
};

export type ItemsPublic = {
  data: Array<ItemPublic>;
  count: number;
};

export type Message = {
  message: string;
};

export type NewPassword = {
  token: string;
  new_password: string;
};

export type Token = {
  access: string;
  refresh: string;
};

export type UpdatePassword = {
  current_password: string;
  new_password: string;
};

export type UserCreate = {
  email: string;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  password: string;
};

export type UserPublic = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  position: string | null;
  department: string | null;
  date_of_birth: string | null;
  company: number | null;
  target_group: number | null;
  team: number | null;
  is_superuser: boolean;
  is_manager: boolean;
};

export type UserRegister = {
  email: string;
  password: string;
  full_name?: string | null;
};

export type UserUpdate = {
  email?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string | null;
  password?: string | null;
};

export type UserUpdateMe = {
  full_name?: string | null;
  email?: string | null;
};

export type UsersPublic = {
  data: Array<UserPublic>;
  count: number;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type TaskField = {
  id: string;
  type: string;
  name: string;
  content: string;
  represented_name: string;
};

export type TaskBase = {
  id: string;
  name: string;
  description: string;
  fields: TaskField[];
  created_date?: string | null;
  updated_date?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  company_id: string;
  task_period: number;
  status: string;
};

export type TaskCreate = TaskBase;

export type TaskPublic = TaskBase;

export type TaskUpdate = TaskCreate;

export type TasksPublic = {
  data: Array<TaskPublic>;
  count: number;
};

export type TaskUserPublic = {
  task_id: string;
  user_id: number;

  name: string;
  description: string;

  fields: TaskField[];
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;

  status: string;
  company_id: number;

  due_date: string;
};

export type TaskUsersPublic = {
  data: Array<TaskUserPublic>;
  count: number;
};
