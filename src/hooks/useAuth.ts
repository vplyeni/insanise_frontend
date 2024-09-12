import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AxiosError } from "axios";
import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  TDataLoginRefreshAccessToken,
  TDataLoginRefreshToken,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "../client";
import useCustomToast from "./useCustomToast";

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};
function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}
const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      let result = {} as UserPublic;
      let i = 0;
      let failed = false;
      while (i < 3) {
        i++;
        try {
          failed = false;
          result = await UsersService.readUserMe();
          break;
        } catch (e) {
          failed = true;
          await timeout(300);
        }
      }
      if (failed) {
        if (localStorage.getItem("refresh_token") !== null) {
          const { access } = await LoginService.loginAccessRefresh({
            refresh: localStorage.getItem("refresh_token"),
          } as TDataLoginRefreshToken).catch(() => {
            logout();
            return {} as TDataLoginRefreshAccessToken;
          });
          localStorage.setItem("access_token", access);
        } else {
          logout();
        }
      }
      return result;
    },
    enabled: isLoggedIn(),
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" });
      showToast(
        "Account created.",
        "Your account has been created successfully.",
        "success"
      );
    },
    onError: (err: ApiError) => {
      let errDetail = (err.body as any)?.detail;

      if (err instanceof AxiosError) {
        errDetail = err.message;
      }

      showToast("Something went wrong.", errDetail, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const login = async (data: AccessToken) => {
    const response = await LoginService.loginAccessToken({
      formData: data,
    });
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (err: ApiError) => {
      let errDetail = (err.body as any)?.detail;

      if (err instanceof AxiosError) {
        errDetail = err.message;
      }

      if (Array.isArray(errDetail)) {
        errDetail = "Something went wrong";
      }

      setError(errDetail);
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate({ to: "/login" });
  };

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  };
};

export { isLoggedIn };
export default useAuth;
