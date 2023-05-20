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

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithUserEmailAndPassword } =
    useContext(UserContext) ?? {};

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  }, [navigate]);

  const validationSchema = yup
    .object({
      email: yup
        .string()
        .email('This must be a valid email')
        .required('Email is required'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be greater than or equal to six characters'),
    })
    .required();

  const handleSubmit = (e: any) => {
    try {
      e.preventDefault();
      if (validationSchema.isValidSync(formik?.values)) {
        signInWithUserEmailAndPassword?.(formik?.values);
        setIsLoading(true);
      } else {
        setIsLoading(false);
        toast.error('Invalid Input Fields');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <section>
      <div className='h-screen bg-[#fcf8f5] grid grid-cols-1 md:grid-cols-2'>
        <div className='relative hidden md:flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24'>
          <div className='absolute inset-0'>
            <img
              className='h-full w-full rounded-md object-cover object-top'
              src={signup}
              alt='login'
            />
          </div>
        </div>
        <div className='flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
          <div className='w-5/6 lg:mx-auto lg:w-full lg:max-w-sm 2xl:max-w-md'>
            <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl'>
              Sign in
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link
                to='/signup'
                title=''
                className='font-semibold text-black transition-all duration-200 hover:underline'
              >
                Create a free account
              </Link>
            </p>
            <form onSubmit={handleSubmit} className='mt-8'>
              <div className='space-y-5'>
                <div>
                  <label
                    htmlFor=''
                    className='text-base font-medium text-gray-900'
                  >
                    Email address
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      type='email'
                      placeholder='Email'
                      {...formik.getFieldProps('email')}
                    ></input>
                  </div>
                  <div>
                    {formik?.touched?.email && formik?.errors?.email && (
                      <span className='text-red-500 text-sm'>
                        {formik.errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor=''
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
                      {...formik.getFieldProps('password')}
                    ></input>
                  </div>
                  <div>
                    {formik?.touched?.password && formik?.errors?.password && (
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
                    Get started <ArrowRight className='ml-2' size={16} />
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
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
