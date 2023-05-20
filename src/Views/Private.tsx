import { Navigate, Outlet } from 'react-router-dom';

const Private = () => {
  const auth = localStorage.getItem('userInfo');
  return auth ? <Outlet /> : <Navigate to='/login' />;
};

export default Private;
