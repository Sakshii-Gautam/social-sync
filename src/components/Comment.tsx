import { Avatar } from '@material-tailwind/react';

interface CommentProps {
  name: string;
  comment: string;
  image: string;
}

const Comment = ({ name, comment, image }: CommentProps) => {
  return (
    <div className='flex items-center mt-2 w-full'>
      <div className='mx-2'>
        <Avatar
          size='sm'
          className='w-10 rounded-full'
          alt='avatar'
          variant='circular'
          src={image || 'https://shrtco.de/A4INQp'}
        ></Avatar>
      </div>
      <div className='flex flex-col items-start bg-gray-100 rounded-2xl p-1 max-w-[600px]'>
        <p className='font-roboto text-black text-sm no-underline tracking-normal leading-none p-1 font-medium'>
          {name}
        </p>

        <p className='font-roboto text-black text-sm no-underline tracking-normal leading-none p-1 font-medium'>
          {comment}
        </p>
      </div>
    </div>
  );
};

export default Comment;
