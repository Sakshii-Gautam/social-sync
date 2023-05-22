import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Contexts/UserContextProvider';
import Navbar from '../components/Navbar';
import UserProfile from '../components/UserProfile';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PostCard from '../components/PostCard';

interface UserPost {
  logo: string | null;
  documentId: string;
  uid: string;
  name: string;
  email: string;
  image: string;
  text: string;
  timestamp: {
    toDate: () => Date;
  };
}

const ProfilePage = () => {
  const { user, userData } = useContext(UserContext) ?? {};
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userInfo, setUserInfo] = useState<any>([]);

  const getUserPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('uid', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => doc.data() as UserPost);
      setUserPosts(postsData);
    } catch (error) {
      console.log('Error getting user posts:', error);
    }
  };

  const getUserInfo = async () => {
    try {
      const userRef = collection(db, 'users');
      const qUser = query(userRef, where('uid', '==', user?.uid));
      const snapshot = await getDocs(qUser);
      const userDetails = snapshot.docs.map((doc) => doc.data());
      setUserInfo(userDetails[0]);
    } catch (error) {
      console.log('Error getting user info:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    getUserPosts();
    const postsRef = collection(db, 'posts');
    const qPosts = query(postsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(qPosts, () => {
      getUserPosts();
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <UserProfile
        name={user?.displayName || userData?.name}
        email={user?.email || userData?.email}
        bio={user?.bio || userData?.bio}
        profilePic={
          user?.photoURL || userData?.image || 'https://shrtco.de/A4INQp'
        }
        posts={userPosts?.length || 0}
        following={userInfo?.following?.length || 0}
      />
      <div className='postcards flex flex-col-reverse'>
        {userPosts?.length ? (
          userPosts.map((post) => (
            <div key={post?.documentId}>
              <PostCard
                logo={post?.logo || 'https://shrtco.de/A4INQp'}
                id={post?.documentId}
                uid={post?.uid}
                name={post?.name}
                email={post?.email}
                image={post?.image}
                text={post?.text}
                timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
              />
            </div>
          ))
        ) : (
          <h3 className='text-2xl font-bold text-center'>No posts yet!</h3>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
