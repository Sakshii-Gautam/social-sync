import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Contexts/UserContextProvider';
import { auth, onAuthStateChanged } from '../firebaseConfig';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import signup from '../assets/signup.jpeg';
import google from '../assets/google.svg';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, registerWithUserEmailAndPassword } =
    useContext(UserContext) ?? {};

  let initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Required')
      .min(4, 'Must be at least 4 characters long'),
    email: yup
      .string()
      .email('This must be a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be greater than or equal to six characters'),
  });

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (formik.isValid === true) {
      registerWithUserEmailAndPassword?.(formik?.values);
      setIsLoading(true);
    } else {
      setIsLoading(false);
      toast.error('Invalid Input Fields');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleRegister,
  });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className='h-screen bg-[#fcf8f5] grid grid-cols-1 md:grid-cols-2'>
        <div className='h-full w-full hidden md:flex'>
          <img
            className='mx-auto h-full w-full rounded-md object-cover'
            src={signup}
            alt='signupImage'
          />
        </div>
        <div className='flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
          <div className='w-5/6 lg:mx-auto lg:w-full lg:max-w-sm 2xl:max-w-md'>
            <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl'>
              Sign up
            </h2>
            <p className='mt-2 text-base text-gray-600'>
              Already have an account?{' '}
              <Link
                to='/login'
                title=''
                className='font-medium text-black transition-all duration-200 hover:underline'
              >
                Sign In
              </Link>
            </p>
            <form onSubmit={handleRegister} className='mt-8'>
              <div className='space-y-5'>
                <div>
                  <label
                    htmlFor='name'
                    className='text-base font-medium text-gray-900'
                  >
                    Full Name
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='text'
                      placeholder='Full Name'
                      id='name'
                      {...formik.getFieldProps('name')}
                    ></input>
                  </div>
                  <div>
                    {formik.touched.name && formik.errors.name && (
                      <span className='text-red-500 text-sm'>
                        {formik?.errors?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='text-base font-medium text-gray-900'
                  >
                    Email address
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='email'
                      placeholder='Email'
                      id='email'
                      {...formik.getFieldProps('email')}
                    ></input>
                  </div>
                  <div>
                    {formik.touched.email && formik.errors.email && (
                      <span className='text-red-500 text-sm'>
                        {formik.errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='text-base font-medium text-gray-900'
                    >
                      Password
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='password'
                      placeholder='Password'
                      id='password'
                      {...formik.getFieldProps('password')}
                    ></input>
                  </div>
                  <div>
                    {formik.touched.password && formik.errors.password && (
                      <span className='text-red-500 text-sm'>
                        {formik.errors.password}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type='submit'
                    className='inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80'
                  >
                    Create Account <ArrowRight className='ml-2' size={16} />
                  </button>
                </div>
              </div>
            </form>
            <div className='mt-3 space-y-3'>
              <button
                onClick={signInWithGoogle}
                type='button'
                className='relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none'
              >
                <span className='mr-2 inline-block'>
                  <img src={google} alt='google' />
                </span>
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
