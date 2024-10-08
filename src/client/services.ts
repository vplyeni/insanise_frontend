import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

import type {
  Body_login_login_access_token,
  ItemCreate,
  ItemPublic,
  ItemUpdate,
  ItemsPublic,
  LeaveCreate,
  LeavePublic,
  LeaveUpdate,
  LeavesPublic,
  Message,
  NewPassword,
  TargetGroupCreate,
  TargetGroupPublic,
  TargetGroupUpdate,
  TargetGroupsPublic,
  TaskCreate,
  TaskPublic,
  TaskResultsPublic,
  TaskUpdate,
  TaskUserPublic,
  TaskUsersPublic,
  TasksPublic,
  TeamCreate,
  TeamPublic,
  TeamUpdate,
  TeamsPublic,
  Token,
  UpdatePassword,
  UserCreate,
  UserPublic,
  UserRegister,
  UserUpdate,
  UserUpdateMe,
  UsersPublic,
} from "./models";

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token;
};
export type TDataLoginRefreshToken = {
  refresh: string;
};
export type TDataLoginRefreshAccessToken = {
  access: string;
};
export type TDataRecoverPassword = {
  email: string;
};
export type TDataResetPassword = {
  requestBody: NewPassword;
};
export type TDataRecoverPasswordHtmlContent = {
  email: string;
};

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken
  ): CancelablePromise<Token> {
    const { formData } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/token/",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static loginAccessRefresh(
    data: TDataLoginRefreshToken
  ): CancelablePromise<TDataLoginRefreshAccessToken> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/token/refresh/",
      formData: data,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/token/test/",
    });
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword
  ): CancelablePromise<Message> {
    const { email } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Reset Password
   * Reset password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword
  ): CancelablePromise<Message> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent
  ): CancelablePromise<string> {
    const { email } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export type TDataReadUsers = {
  limit?: number;
  skip?: number;
};
export type TDataCreateUser = {
  requestBody: UserCreate;
};
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe;
};
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword;
};
export type TDataRegisterUser = {
  requestBody: UserRegister;
};
export type TDataReadUserById = {
  userId: string;
};
export type TDataUpdateUser = {
  requestBody: UserUpdate;
  userId: string;
};
export type TDataDeleteUser = {
  userId: string;
};
export type TDataSearchUserPagination = {
  skip: number;
  limit: number;
  request_body: TDataSearchUser;
};
export type TDataSearchUser = {
  search: string;
  selected_employees: number[];
};

export class UsersService {
  /**
   * Read Users
   * Retrieve employees.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readEmployees(
    data: TDataReadUsers = {}
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/employees/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createEmployee(
    data: TDataCreateUser
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/employees/create_employee/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/auth/user/me/",
    });
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/employees/me",
    });
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/company/employees/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe
  ): CancelablePromise<Message> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/auth/user/change_password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/employees/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser
  ): CancelablePromise<UserPublic> {
    const { requestBody, userId } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/company/employees/{user_id}/",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/employees/{user_id}/",
      path: {
        user_id: userId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static searchUser(
    data: TDataSearchUserPagination
  ): CancelablePromise<Message> {
    const { skip, limit, request_body } = data;
    console.log(request_body);

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/employees/search/?skip=" + skip + "&limit=" + limit,
      body: request_body,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static readLeaveData(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/employees/leave_days/",
    });
  }
  public static readTaskData(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/employees/task_count/",
    });
  }
}

export type TDataTestEmail = {
  emailTo: string;
};

export class UtilsService {
  /**
   * Test Email
   * Test emails.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
    const { emailTo } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/utils/test-email/",
      query: {
        email_to: emailTo,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export type TDataReadItems = {
  limit?: number;
  skip?: number;
};
export type TDataCreateItem = {
  requestBody: ItemCreate;
};
export type TDataReadItem = {
  id: string;
};
export type TDataUpdateItem = {
  id: string;
  requestBody: ItemUpdate;
};
export type TDataDeleteItem = {
  id: string;
};

export class ItemsService {
  /**
   * Read Items
   * Retrieve items.
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItems(
    data: TDataReadItems = {}
  ): CancelablePromise<ItemsPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/items/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create Item
   * Create new item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createItem(
    data: TDataCreateItem
  ): CancelablePromise<ItemPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/items/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Item
   * Get item by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readItem(data: TDataReadItem): CancelablePromise<ItemPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/items/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Item
   * Update an item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateItem(
    data: TDataUpdateItem
  ): CancelablePromise<ItemPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/company/items/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Item
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteItem(data: TDataDeleteItem): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/items/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

("Bitiş");

export type TDataReadTeams = {
  limit?: number;
  skip?: number;
};
export type TDataCreateTeam = {
  requestBody: TeamCreate;
};
export type TDataReadTeam = {
  id: string;
};
export type TDataUpdateTeam = {
  id: string;
  requestBody: TeamUpdate;
};
export type TDataDeleteTeam = {
  id: string;
};

export class TeamsService {
  /**
   * Read Teams
   * Retrieve items.
   * @returns TeamsPublic Successful Response
   * @throws ApiError
   */
  public static readTeams(
    data: TDataReadTeams = {}
  ): CancelablePromise<TeamsPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/teams/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create Team
   * Create new item.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static createTeam(
    data: TDataCreateTeam
  ): CancelablePromise<TeamPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/teams/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Team
   * Get item by ID.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static readTeam(data: TDataReadTeam): CancelablePromise<TeamPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/teams/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Team
   * Update an item.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static updateTeam(
    data: TDataUpdateTeam
  ): CancelablePromise<TeamPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/company/teams/{id}/",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Team
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTeam(data: TDataDeleteTeam): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/teams/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

("Bitiş");

export type TDataReadTargetGroups = {
  limit?: number;
  skip?: number;
};
export type TDataCreateTargetGroup = {
  requestBody: TargetGroupCreate;
};
export type TDataReadTargetGroup = {
  id: string;
};
export type TDataUpdateTargetGroup = {
  id: string;
  requestBody: TargetGroupUpdate;
};
export type TDataDeleteTargetGroup = {
  id: string;
};

export class TargetGroupsService {
  /**
   * Read TargetGroups
   * Retrieve items.
   * @returns TargetGroupsPublic Successful Response
   * @throws ApiError
   */
  public static readTargetGroups(
    data: TDataReadTargetGroups = {}
  ): CancelablePromise<TargetGroupsPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/target_groups/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create TargetGroup
   * Create new item.
   * @returns TargetGroupPublic Successful Response
   * @throws ApiError
   */
  public static createTargetGroup(
    data: TDataCreateTargetGroup
  ): CancelablePromise<TargetGroupPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/target_groups/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read TargetGroup
   * Get item by ID.
   * @returns TargetGroupPublic Successful Response
   * @throws ApiError
   */
  public static readTargetGroup(
    data: TDataReadTargetGroup
  ): CancelablePromise<TargetGroupPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/target_groups/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update TargetGroup
   * Update an item.
   * @returns TargetGroupPublic Successful Response
   * @throws ApiError
   */
  public static updateTargetGroup(
    data: TDataUpdateTargetGroup
  ): CancelablePromise<TargetGroupPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/company/target_groups/{id}/",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete TargetGroup
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTargetGroup(
    data: TDataDeleteTargetGroup
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/target_groups/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export type TDataReadTasks = {
  limit?: number;
  skip?: number;
  search?: string;
};
export type TDataCreateTask = {
  requestBody: TaskCreate;
};
export type TDataReadTask = {
  id: string;
};
export type TDataUpdateTask = {
  id: string;
  requestBody: TaskPublic;
};
export type TDataDeleteTask = {
  id: string;
};

export type TDataCompleteTask = {
  task_id: string;
};

export type TDataAssignTask = {
  task_id: string;
  assigned_to: number[];
};

export class TasksService {
  /**
   * Read Teams
   * Retrieve items.
   * @returns TasksPublic Successful Response
   * @throws ApiError
   */
  public static readTasks(
    data: TDataReadTasks = {}
  ): CancelablePromise<TaskUsersPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/harmonise/task/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Teams
   * Retrieve items.
   * @returns TasksPublic Successful Response
   * @throws ApiError
   */
  public static readAllTasks(
    data: TDataReadTasks = {}
  ): CancelablePromise<TasksPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/harmonise/task/manager/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static readTaskResults(
    data: TDataReadTasks = {}
  ): CancelablePromise<TaskResultsPublic> {
    const { limit = 100, skip = 0, search = "" } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/harmonise/task/manager/",
      query: {
        skip,
        limit,
        type: 1,
        full_name: search,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create Task
   * Create new item.
   * @returns TaskPublic Successful Response
   * @throws ApiError
   */
  public static createTask(
    data: TDataCreateTask
  ): CancelablePromise<TaskUpdate> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/harmonise/task/manager/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Task
   * Get item by ID.
   * @returns TaskUpdate Successful Response
   * @throws ApiError
   */
  public static readTask(data: TDataReadTask): CancelablePromise<TaskUpdate> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/harmonise/task/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Task
   * Update an item.
   * @returns TaskUpdate Successful Response
   * @throws ApiError
   */
  public static updateTask(
    data: TDataUpdateTask
  ): CancelablePromise<TaskPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/harmonise/task/manager/{id}/",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Task
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTask(data: TDataDeleteTask): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/harmonise/task/manager/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
  /**
   * Alter Field
   * Alter an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static addFileToField(
    data: TDataFileForField
  ): CancelablePromise<Message> {
    const { task_id, field_id, file } = data;
    return __request(OpenAPI, {
      method: "POST",
      url:
        "/api/harmonise/task_user/file/?task_id=" +
        task_id +
        "&field_id=" +
        field_id,
      errors: {
        422: "Validation Error",
      },
      formData: {
        file: file,
      },
    });
  }

  public static downloadFile(data: {
    task_id: string;
    field_id: string;
  }): CancelablePromise<Message> {
    const { task_id, field_id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url:
        "/api/harmonise/task_user/download/?task_id=" +
        task_id +
        "&field_id=" +
        field_id,
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Alter Field
   * Alter an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static customizeFieldWithTaskId(
    data: TDataFieldCustomize
  ): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/harmonise/task_user/text/",
      errors: {
        422: "Validation Error",
      },
      body: data,
    });
  }

  public static completeTaskByTaskId(
    data: TDataCompleteTask
  ): CancelablePromise<Message> {
    const { task_id } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/harmonise/task_user/complete/?task_id=" + task_id,
      errors: {
        422: "Validation Error",
      },
      body: data,
    });
  }

  public static assignTask(data: TDataAssignTask): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/harmonise/task/manager/assign_task/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export type TDataReadLeaves = {
  limit?: number;
  skip?: number;
};
export type TDataCreateLeave = {
  requestBody: LeaveCreate;
};
export type TDataReadLeave = {
  id: string;
};
export type TDataUpdateLeave = {
  id: string;
  requestBody: LeavePublic;
};
export type TDataDeleteLeave = {
  id: string;
};

export type TDataFieldCustomize = {
  content: string;
  task_id: string;
  field_id: string;
};

export type TDataCompleteLeave = {
  task_id: string;
};

export type TDataFileForField = {
  task_id: string;
  field_id: string;
  file: File | null;
};

export type TDataAssignLeave = {
  task_id: string;
  assigned_to: number[];
};

export class LeavesService {
  /**
   * Read Teams
   * Retrieve items.
   * @returns LeavesPublic Successful Response
   * @throws ApiError
   */
  public static readLeaves(
    data: TDataReadLeaves = {}
  ): CancelablePromise<LeavesPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/leave/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Teams
   * Retrieve items.
   * @returns LeavesPublic Successful Response
   * @throws ApiError
   */
  public static readAllLeaves(
    data: TDataReadLeaves = {}
  ): CancelablePromise<LeavesPublic> {
    const { limit = 100, skip = 0 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/leave/waiting_for_approve/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create Leave
   * Create new item.
   * @returns LeavePublic Successful Response
   * @throws ApiError
   */
  public static createLeave(
    data: TDataCreateLeave
  ): CancelablePromise<LeaveUpdate> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/leave/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Leave
   * Get item by ID.
   * @returns LeaveUpdate Successful Response
   * @throws ApiError
   */
  public static readLeave(
    data: TDataReadLeave
  ): CancelablePromise<LeaveUpdate> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/company/leave/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Leave
   * Update an item.
   * @returns LeaveUpdate Successful Response
   * @throws ApiError
   */
  public static updateLeave(
    data: TDataUpdateLeave
  ): CancelablePromise<LeavePublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/company/leave/{id}/",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Leave
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteLeave(
    data: TDataDeleteLeave
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/company/leave/{id}/",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Teams
   * Retrieve items.
   * @returns LeavesPublic Successful Response
   * @throws ApiError
   */
  public static approveLeave(
    data: TDataReadLeave = { id: "0" }
  ): CancelablePromise<LeavesPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/company/leave/approve/",
      query: {
        leave_id: id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}
