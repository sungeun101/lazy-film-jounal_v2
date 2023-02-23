import useSWR from 'swr';

export default function useUser() {
  const { data, error } = useSWR('/api/users/me');

  const isLoggedOut = data && !data.ok;

  return { user: data?.profile, isLoading: !data && !error, isLoggedOut };
}
