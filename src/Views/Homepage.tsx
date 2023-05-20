import { useContext, useEffect, useRef, useState, useReducer } from 'react';
import { UserContext } from '../Contexts/UserContextProvider';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  PostsReducer,
  postActions,
  postsStates,
} from '../Contexts/PostReducer';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadMetadata,
} from 'firebase/storage';
import uploadImage from '../assets/uploadImage.svg';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import UserTagging from '../components/UserTagging';
import { toast } from 'react-toastify';
import defaultImg from '../assets/defaultImg.jpeg';

interface User {
  uid: string;
  name: string;
}

interface TaggedUser {
  name: string;
  position: { x: number; y: number };
}

interface FeedPost {
  timestamp: {
    toDate: () => Date;
  };
  documentId: string;
  name: string;
  uid: string;
  text: string;
  logo: string | null;
  image: string;
  tags: string[];
  email: string;
}

const Homepage = () => {
  const { user, userData } = useContext(UserContext) ?? {};
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [image, setImage] = useState<any>(null);
  const collectionRef = collection(db, 'posts');
  const postRef = doc(collection(db, 'posts'));
  const document = postRef.id;
  const { SUBMIT_POST, HANDLE_ERROR } = postActions;
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const [users, setUsers] = useState<User[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);

  const storage = getStorage();

  const metadata: UploadMetadata = {
    contentType: '',
  };

  const submitImage = async () => {
    if (!file) return;

    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on('state_changed', async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
        } catch (error: any) {
          dispatch({ type: HANDLE_ERROR });
          console.error(error.message);
          const parts = error.message.split('/');
          const message = parts[1];
          toast.error(`(${message}`);
        }
      });
    } catch (error: any) {
      dispatch({ type: HANDLE_ERROR });
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const resetFields = () => {
    setImage(null);
    setFile(null);
    if (inputRef?.current?.value) {
      inputRef.current.value = '';
    }
  };

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef?.current?.value !== '') {
      try {
        const post = {
          documentId: document,
          uid: user?.uid || userData?.uid,
          logo: user?.photoURL || userData?.image || defaultImg,
          name: user?.displayName || userData?.name,
          email: user?.email || userData?.email,
          text: inputRef?.current?.value,
          image,
          timestamp: serverTimestamp(),
          tags: taggedUsers.map((taggedUser) => taggedUser.name),
        };

        await setDoc(postRef, post);

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } catch (error: any) {
        dispatch({ type: HANDLE_ERROR });
        console.error(error.message);
        const parts = error.message.split('/');
        const message = parts[1];
        toast.error(`(${message}`);
      }
    }
  };

  const getFollowingPosts = async () => {
    try {
      // list of users the logged-in user is following
      const followingRef = collection(db, 'users');
      const q = query(followingRef, where('uid', '==', user?.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const followingUser = querySnapshot.docs[0];
        const following = followingUser.data().following || [];
        const followingUIDs = following.map((user: any) => user.id);
        const postsRef = collection(db, 'posts');

        // fetching posts from followed users and the logged-in user
        const qPosts = query(
          postsRef,
          orderBy('timestamp', 'desc'),
          where('uid', 'in', [...followingUIDs, user?.uid])
        );

        const querySnapshotPosts = await getDocs(qPosts);
        const posts = querySnapshotPosts.docs.map(
          (doc) => doc.data() as FeedPost
        );
        setFeedPosts(posts);
      }
    } catch (error) {
      console.log('Error getting following posts:', error);
    }
  };

  useEffect(() => {
    // Fetch users from Firebase Firestore
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ uid: doc.id, name: doc.data().name });
      });
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const postData = async () => {
      const q = query(collectionRef, orderBy('timestamp', 'desc'));
      await onSnapshot(q, (doc) => {
        dispatch({
          type: SUBMIT_POST,
          posts: doc?.docs?.map((item) => item?.data()),
        });
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
        resetFields();
      });
    };

    postData();
  }, [SUBMIT_POST]);

  useEffect(() => {
    submitImage();
  }, [file, dispatch]);

  useEffect(() => {
    getFollowingPosts();
    const postsRef = collection(db, 'posts');
    const qPosts = query(postsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(qPosts, () => {
      getFollowingPosts();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className='flex flex-col justify-center'>
        <div className='heading text-center font-bold text-2xl m-5 text-gray-800'>
          Welcome, {user?.displayName || userData?.name || 'User'}
        </div>

        {/* Create Post Form */}
        <form
          onSubmit={handleSubmitPost}
          className='editor w-[95%] mx-auto flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-[30rem]'
        >
          <div className='w-full ml-4 flex'>
            <input
              type='text'
              name='text'
              placeholder={`Whats on your mind ${
                user?.displayName || userData?.name || 'User'
              }`}
              className='outline-none w-full bg-white rounded-md'
              ref={inputRef}
            />

            <div className='icons flex text-gray-500 m-2'>
              <label
                htmlFor='uploadImage'
                className='cursor-pointer flex items-center'
              >
                <img
                  className='mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7'
                  src={uploadImage}
                  alt='uploadImage'
                />
                <input
                  id='uploadImage'
                  type='file'
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                ></input>
              </label>
            </div>
          </div>

          <UserTagging
            users={users}
            image={image}
            onTaggedUsersChange={setTaggedUsers}
          />

          <div className='buttons flex mt-4'>
            <button
              onClick={resetFields}
              className='btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500'
            >
              Post
            </button>
          </div>
        </form>

        {/* Feed Posts */}
        <div className='container mx-auto px-4'>
          <div className='flex flex-col py-4 w-full'>
            {state?.error ? (
              <div className='flex justify-center items-center'>
                <p>Something went wrong. Please refresh and try again.</p>
              </div>
            ) : (
              <div>
                {feedPosts?.length > 0 &&
                  feedPosts?.map((post) => (
                    <PostCard
                      key={post.documentId}
                      logo={post.logo || defaultImg}
                      id={post.documentId}
                      uid={post.uid}
                      name={post.name}
                      email={post.email}
                      image={post.image}
                      text={post.text}
                      timestamp={new Date(
                        post?.timestamp?.toDate()
                      )?.toUTCString()}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
