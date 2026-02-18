/* eslint-disable @typescript-eslint/no-explicit-any */
export const executeSocialLogin = async (mutationFn: () => Promise<any>) => {
  try {
    const result = await mutationFn();
    const redirectUrl = result?.data?.url;

    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error("Social login failed:", error);
  }
};
