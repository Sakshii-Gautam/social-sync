import { useContext, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { UserContext } from '../Contexts/UserContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import logoSmall from '../assets/logoSmall.svg';

const menuItems = [
  {
    name: 'Home',
    to: '/',
  },
  {
    name: 'Users',
    to: '/allUsers',
  },
  {
    name: 'Profile',
    to: '/profile',
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { signOutUser, user, userData } = useContext(UserContext) ?? {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='relative w-full bg-white'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8'>
        <div className='inline-flex items-center space-x-2'>
          <span>
            <img onClick={() => navigate('/')} src={logo} alt='logo' />
          </span>
          <span
            className='font-bold cursor-pointer'
            onClick={() => navigate('/')}
          >
            Social Sync
          </span>
        </div>
        <div className='hidden grow items-start lg:flex'>
          <ul className='ml-12 inline-flex space-x-8'>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className='text-sm font-semibold text-gray-800 hover:text-gray-900'
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='hidden lg:block'>
          <button
            onClick={signOutUser}
            type='button'
            className='rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
          >
            Signout
          </button>
        </div>
        <div className='lg:hidden'>
          <Menu onClick={toggleMenu} className='h-6 w-6 cursor-pointer' />
        </div>
        {isMenuOpen && (
          <div className='absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden'>
            <div className='divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
              <div className='px-5 pb-6 pt-5'>
                <div className='flex items-center justify-between'>
                  <div className='inline-flex items-center space-x-2'>
                    <span>
                      <img src={logoSmall} alt='logoSmall' />
                    </span>
                    <span className='font-bold'>
                      {user?.displayName || userData?.name}
                    </span>
                  </div>
                  <div className='-mr-2'>
                    <button
                      type='button'
                      onClick={toggleMenu}
                      className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                    >
                      <span className='sr-only'>Close menu</span>
                      <X className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>
                </div>
                <div className='mt-6'>
                  <nav className='grid gap-y-4'>
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className='-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50'
                      >
                        <span className='ml-3 text-base font-medium text-gray-900'>
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
                <button
                  onClick={signOutUser}
                  type='button'
                  className='mt-4 w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                >
                  Signout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
