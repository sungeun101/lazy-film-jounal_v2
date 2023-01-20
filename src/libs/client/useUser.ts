import useSWR from 'swr';

export default function useUser() {
  const { data, error } = useSWR('/api/users/me');
  return { user: data?.profile, isLoading: !data && !error };
}
