import { Routes, Route } from 'react-router-dom';
import LoginPage from './Views/LoginPage';
import SignupPage from './Views/SignupPage';
import Homepage from './Views/Homepage';
import UserContextProvider from './Contexts/UserContextProvider';
import AllUsers from './Views/AllUsers';
import ProfilePage from './Views/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <UserContextProvider>
      <ToastContainer theme='dark' position='top-center' autoClose={2000} />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/allUsers' element={<AllUsers />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </UserContextProvider>
  );
};

export default App;
