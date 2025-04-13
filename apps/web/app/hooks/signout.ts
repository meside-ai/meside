import { useRouter } from "next/navigation";
import { clearAuthTokens } from "../../utils/auth-storage";
import { queryClient } from "../../utils/query-client";

export const useSignout = () => {
  const router = useRouter();

  const signout = () => {
    clearAuthTokens();
    // Important to reload the page to clear the cache of the previous user
    queryClient.clear();
    router.push("/login");
  };

  return { signout };
};
