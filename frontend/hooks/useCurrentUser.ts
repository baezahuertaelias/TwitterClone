import useSWR from "swr";
import fetcher from "@/libs/fetcher";

//Reemplaza a global state como redux

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
