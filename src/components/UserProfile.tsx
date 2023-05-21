interface UserProfileProps {
  name: string;
  email: string;
  bio: string;
  profilePic: string;
  posts: number;
  following: number;
}

const UserProfile = ({
  name,
  email,
  profilePic,
  posts,
  following,
  bio,
}: UserProfileProps) => {
  return (
    <section className='p-12 bg-blueGray-50'>
      <div className='w-full lg:w-4/12 px-4 mx-auto'>
        <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16'>
          <div className='px-6'>
            <div className='flex flex-wrap justify-center'>
              <div className='w-full px-4 flex justify-center'>
                <img
                  alt='profile-picture'
                  style={{ transform: 'translate(0%,-35%)' }}
                  src={profilePic}
                  className='object-cover shadow-xl rounded-full align-middle border-none absolute transform -translate-y-35 w-40 h-40'
                />
              </div>
              <div className='mt-24 w-full px-4 text-center'>
                <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                  <div className='mx-4 p-3 text-center'>
                    <span className='text-xl font-bold block uppercase tracking-wide text-blueGray-600'>
                      {posts}
                    </span>
                    <span className='text-sm text-blueGray-400'>Posts</span>
                  </div>
                  <div className='mx-4 p-3 text-center'>
                    <span className='text-xl font-bold block uppercase tracking-wide text-blueGray-600'>
                      {following}
                    </span>
                    <span className='text-sm text-blueGray-400'>Following</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='text-center'>
              <h3 className='text-xl font-semibold leading-normal text-blueGray-700'>
                {name}
              </h3>
              <div className='text-blueGray-600'>
                <i className='fas fa-briefcase mr-2 text-lg text-blueGray-400'></i>
                {email}
              </div>
              <div className='mt-5 py-2 border-t border-blueGray-200 text-center'>
                <div className='flex flex-wrap justify-center'>
                  <div className='w-full lg:w-9/12 px-4'>
                    <p className='mb-4 text-lg leading-relaxed text-blueGray-700'>
                      {bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
