import { Navigate, Outlet } from 'react-router-dom';
import { UserContext, UserContextTypes } from '../Contexts/UserContextProvider';
import { useContext } from 'react';

const Private = () => {
  const { user, userData } = useContext(UserContext) as UserContextTypes;
  const auth = user || userData;
  return auth ? <Outlet /> : <Navigate to='/login' />;
};

export default Private;
