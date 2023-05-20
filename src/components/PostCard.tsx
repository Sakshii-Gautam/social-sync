import { MouseEvent, useContext, useEffect, useReducer, useState } from 'react';
import { UserContext } from '../Contexts/UserContextProvider';
import {
  PostsReducer,
  postActions,
  postsStates,
} from '../Contexts/PostReducer';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';
import CommentSection from './CommentSection';
import { toast } from 'react-toastify';

interface PostCardProps {
  logo: string;
  id: string;
  uid: string;
  name: string;
  image: string;
  email: string;
  text: string;
  timestamp: string;
}

const PostCard = ({
  logo,
  id,
  uid,
  name,
  image,
  text,
  timestamp,
}: PostCardProps) => {
  const { user } = useContext(UserContext) ?? {};
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const [isLiked, setIsLiked] = useState(false);
  const likesRef = doc(collection(db, 'posts', id, 'likes'));
  const likesCollection = collection(db, 'posts', id, 'likes');
  const singlePostDocument = doc(db, 'posts', id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const toggleCommentSection = (e: any) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const handleLike = async (e: MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    const q = query(likesCollection, where('id', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    const likesDocId = await querySnapshot?.docs[0]?.id;
    try {
      if (likesDocId !== undefined) {
        const deleteId = doc(db, 'posts', id, 'likes', likesDocId);
        await deleteDoc(deleteId);
        setIsLiked(false);
      } else {
        await setDoc(likesRef, {
          id: user?.uid,
        });
        setIsLiked(true);
      }
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const deletePost = async (e: MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      }
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      try {
        const q = collection(db, 'posts', id, 'likes');
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_LIKE,
            likes: doc.docs.map((item) => item.data()),
          });
        });
      } catch (error: any) {
        dispatch({ type: HANDLE_ERROR });
        console.error(error.message);
        const parts = error.message.split('/');
        const message = parts[1];
        toast.error(`(${message}`);
      }
    };
    return () => {
      getLikes();
    };
  }, [id, ADD_LIKE, HANDLE_ERROR]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const docSnapshot = await getDoc(singlePostDocument);
        if (docSnapshot.exists()) {
          const postTags = docSnapshot.data()?.tags || [];
          setTags(postTags);
        }
      } catch (error) {
        console.log('Error getting post tags:', error);
      }
    };

    getTags();
  }, [singlePostDocument]);

  return (
    <div className='flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-8  md:max-w-2xl'>
      <div className='flex items-start w-full px-4 py-6'>
        <img
          className='w-12 h-12 rounded-full object-cover mr-4 shadow'
          src={logo}
          alt='avatar'
        />
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900 -mt-1'>
              {name}
            </h2>
            {user?.uid === uid && (
              <Trash2
                onClick={deletePost}
                className='cursor-pointer'
                color='slategray'
              />
            )}
          </div>
          <p className='text-gray-700'>{timestamp}</p>
          <p className='my-5 text-gray-700 text-sm'>{text}</p>
          {image && (
            <img className='h-max-[500px] w-full' src={image} alt='image'></img>
          )}
          {tags?.length > 0 && (
            <div className='flex flex-wrap mt-4'>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className='text-indigo-500 bg-indigo-100 text-xs font-medium rounded-md px-2 py-1 mr-2 mb-2'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className='mt-4 flex items-center'>
            <div className='flex text-gray-700 text-sm mr-6'>
              <ThumbsUp
                className='cursor-pointer'
                color={isLiked ? 'red' : 'slategray'}
                onClick={handleLike}
              />
              <span className='font-bold mt-[0.15rem]'>
                {state.likes?.length > 0 && state?.likes?.length}
              </span>
            </div>
            <div className='flex text-gray-700 text-sm mr-8 mt-1'>
              <MessageSquare
                className='cursor-pointer'
                onClick={toggleCommentSection}
                color='slategray'
              />
            </div>
          </div>
          {open && <CommentSection postId={id} />}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
