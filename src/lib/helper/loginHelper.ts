export const handleAfterLogin = (
  role: string | null | undefined,
  redirect: string | null | undefined,
  router: { replace: (url: string) => void },
) => {
  if (role === "super_admin") {
    router.replace("/admin/dashboard");
    return;
  }

  if ((role === "user" || role === "artist") && redirect) {
    router.replace(redirect);
    return;
  }

  router.replace("/");
};
