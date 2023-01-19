import { useState, ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import useAuth from '../hooks/useAuth';
import Login from '../pages/auth/login';
// components
import LoadingScreen from '../components/LoadingScreen';
import useUser from 'src/libs/client/useUser';
import useSWR from 'swr';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { isInitialized } = useAuth();
  // const { isAuthenticated, isInitialized } = useAuth();

  const { pathname, push } = useRouter();

  const { user } = useUser();

  // const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  // useEffect(() => {
  //   if (requestedLocation && pathname !== requestedLocation) {
  //     setRequestedLocation(null);
  //     push(requestedLocation);
  //   }
  // }, [pathname, push, requestedLocation]);

  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  // if (!user) {
  //   if (pathname !== requestedLocation) {
  //     setRequestedLocation(pathname);
  //   }
  //   return <Login />;
  // }

  return <>{children}</>;
}
