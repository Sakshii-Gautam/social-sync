import { useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { UserContext } from '../Contexts/UserContextProvider';
import { db } from '../firebaseConfig';
import { toast } from 'react-toastify';

interface ProfileCardProps {
  name: string;
  email: string;
  uid: string;
  logo: string;
}

interface UserData {
  id: string;
  image: string;
  name: string;
}

const ProfileCard = ({ name, email, uid, logo }: ProfileCardProps) => {
  const { user } = useContext(UserContext) ?? {};
  const [isFollowing, setIsFollowing] = useState(false);

  const followUser = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].ref;

      await updateDoc(data, {
        following: arrayUnion({
          id: uid,
          image: logo,
          name: name,
        }),
      });
      setIsFollowing(true);
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const unfollowUser = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const dataRef = doc.docs[0].ref;
      const dataDoc = await getDoc(dataRef);
      const data = dataDoc.data();
      console.log('data', data);
      // Filtering out the user
      const updatedFollowing = data?.following.filter(
        (user: UserData) => user.id !== uid
      );
      await updateDoc(dataRef, { following: updatedFollowing });
      setIsFollowing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const followStatus = async () => {
    if (isFollowing) {
      await unfollowUser();
    } else {
      await followUser();
    }
  };

  useEffect(() => {
    // Check if the user is already following
    const checkFollowingStatus = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const following = querySnapshot.docs[0].data().following || [];
          if (following.length > 0) {
            const isUserFollowing = following.some(
              (user: UserData) => user.id === uid
            );
            setIsFollowing(isUserFollowing);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkFollowingStatus();
  }, [uid, user?.uid]);

  return (
    <div id='container' className='mx-auto'>
      <div className='flex flex-col sm:flex-row'>
        <div className='p-2 w-60'>
          <div className=' bg-white px-6 py-8 rounded-lg shadow-lg text-center'>
            <div className='mx-auto w-36 h-36'>
              <img
                className='h-full mx-auto rounded-full object-cover'
                src={logo}
                alt='profileImage'
              />
            </div>
            <h2 className='mt-2 text-xl font-medium text-gray-700'>{name}</h2>
            <span className='text-blue-500 block mb-5 overflow-hidden whitespace-nowrap overflow-ellipsis'>
              {email}
            </span>
            {user?.uid !== uid ? (
              <button
                onClick={followStatus}
                className='px-4 py-2 bg-blue-500 hover:bg-blue-300 text-white rounded-full'
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            ) : (
              <button className='px-4 py-2 bg-blue-900 text-white rounded-full cursor-default'>
                You
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
