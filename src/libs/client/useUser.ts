import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

export default function useUser() {
  const { data, error, isLoading } = useSWR('/api/users/me');
  console.log('user isLoading', isLoading);
  const router = useRouter();
  // useEffect(() => {
  //   if (data && !data.ok) {
  //     router.replace('/auth/login');
  //   }
  // }, [data, router]);

  return { user: data, isLoading: true };
  // return { user: data?.profile, isLoading: !data && !error };
}
