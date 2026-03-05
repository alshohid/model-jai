import { baseApi, useLoginMutation } from "@/redux/api/baseApi";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  invalidToken,
  logOut as reduxLogout,
  selectCurrentRole,
  selectCurrentToken,
} from "./authSlice";
import { IAuthUserRole } from "@/types/user/auth";

export function useAuth() {
  const dispatch = useAppDispatch();
  const [logIn, ctx] = useLoginMutation();
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);

  function logOut() {
    dispatch(reduxLogout({ role }));
    dispatch(baseApi.util.resetApiState());
  }

  function invalidUserToken() {
    dispatch(invalidToken());
  }

  return {
    token,
    role,
    isAuthenticated: !!token,
    logIn,
    logOut,
    invalidUserToken,
    ...ctx,
  };
}
