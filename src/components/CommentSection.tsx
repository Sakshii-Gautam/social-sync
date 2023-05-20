import { useContext, useRef, useReducer, useEffect, FormEvent } from 'react';
import { Avatar } from '@material-tailwind/react';
import { UserContext } from '../Contexts/UserContextProvider';
import {
  setDoc,
  collection,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {
  PostsReducer,
  postActions,
  postsStates,
} from '../Contexts/PostReducer';
import { db } from '../firebaseConfig';
import Comment from './Comment';
import { toast } from 'react-toastify';
import defaultImg from '../assets/defaultImg.jpeg';

interface CommentSectionProps {
  postId: string;
}

interface CommentTypes {
  name: string;
  image: string;
  comment: string;
  index: number;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const comment = useRef<HTMLInputElement>(null);
  const { user, userData } = useContext(UserContext) ?? {};
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { ADD_COMMENT, HANDLE_ERROR } = postActions;

  const addComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment?.current?.value !== '') {
      try {
        await setDoc(commentRef, {
          id: commentRef.id,
          comment: comment?.current?.value,
          image: user?.photoURL,
          name: user?.name || userData?.name,
          timestamp: serverTimestamp(),
        });
        if (comment?.current?.value) {
          comment.current.value = '';
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

  useEffect(() => {
    const getComments = async () => {
      try {
        const collectionOfComments = collection(db, `posts/${postId}/comments`);
        const q = query(collectionOfComments, orderBy('timestamp', 'desc'));
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_COMMENT,
            comments: doc.docs?.map((item) => item.data()),
          });
        });
      } catch (error: any) {
        console.error(error.message);
        const parts = error.message.split('/');
        const message = parts[1];
        toast.error(`(${message}`);
      }
    };

    return () => {
      getComments();
    };
  }, [postId, ADD_COMMENT, HANDLE_ERROR]);

  return (
    <div className='flex flex-col bg-white w-full py-2 rounded-full'>
      <div className='flex items-center'>
        <div className='mr-2'>
          <Avatar
            size='sm'
            className='w-10'
            variant='circular'
            src={user?.photoURL || defaultImg}
          />
        </div>
        <div className='w-full pr-2'>
          <form className='flex items-center w-full' onSubmit={addComment}>
            <input
              name='comment'
              type='text'
              placeholder='Write a comment...'
              className='w-full rounded-2xl outline-none border-0 p-2 bg-gray-100'
              ref={comment}
            ></input>
            <button className='hidden' type='submit'>
              Submit
            </button>
          </form>
        </div>
      </div>
      {state?.comments?.map((comment: CommentTypes, index: number) => {
        return (
          <Comment
            key={index}
            image={comment?.image}
            name={comment?.name}
            comment={comment?.comment}
          />
        );
      })}
    </div>
  );
};

export default CommentSection;
