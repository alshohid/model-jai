import Cookies from "js-cookie";
import { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/features/auth/authSlice";

export const handleSocialAuth = (
  encodedData: string,
  dispatch: AppDispatch,
) => {
  const parsedData = JSON.parse(atob(decodeURIComponent(encodedData)));

  const { access_token, user } = parsedData;

  Cookies.set("token", access_token);
  Cookies.set("role", user.role);

  dispatch(
    setCredentials({
      token: access_token,
      role: user.role,
      refreshToken: null,
    }),
  );
};
