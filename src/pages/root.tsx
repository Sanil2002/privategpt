import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { checkIsPgptHealthy } from '@/lib/pgpt';
import { useEffect } from 'react';
// import { useLocalStorage } from 'usehooks-ts';

export const RootPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const staticUrl = 'https://ai.kutana.net/';

  const checkPrivateGptHealth = async () => {
    try { 
      const isHealthy = await checkIsPgptHealthy(staticUrl);
      if (!isHealthy) {
        alert('The Private GPT instance is not healthy');
      }
      if (pathname === '/') {
        navigate('/chat');
      }
    } catch(error) {
      console.error('Health check failed:', error);
      alert('The Private GPT instance is not healthy');
    }
  };

  useEffect(() => {
      checkPrivateGptHealth();
  }, []);

  return <Outlet />;
};
