import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface TaggedUser {
  name: string;
  position: { x: number; y: number };
}

interface User {
  name: string;
  uid: string;
}

interface UserTaggingProps {
  image: string;
  users: User[];
  onTaggedUsersChange: (taggedUsers: TaggedUser[]) => void;
}

const UserTagging = ({
  image,
  users,
  onTaggedUsersChange,
}: UserTaggingProps) => {
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [clickedPosition, setClickedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTagInput, setShowTagInput] = useState(false);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setClickedPosition({ x: offsetX, y: offsetY });
    setShowTagInput(true);
  };

  const handleTaggedUser = () => {
    if (!selectedUser || !clickedPosition) return;

    const newTaggedUser: TaggedUser = {
      name: selectedUser.name,
      position: { ...clickedPosition },
    };

    setTaggedUsers([...taggedUsers, newTaggedUser]);
    setSelectedUser(null);
    setClickedPosition(null);
    setShowTagInput(false);

    onTaggedUsersChange([...taggedUsers, newTaggedUser]);
  };

  const handleRemoveTagInput = () => {
    setShowTagInput(false);
  };

  return (
    <div className='relative inline-block'>
      {image && (
        <img
          className='image w-full mt-4 mb-2 rounded border border-gray-300'
          src={image}
          alt='uploadedImage'
          onClick={handleImageClick}
        />
      )}

      {image &&
        taggedUsers.map((taggedUser, index) => (
          <div
            key={index}
            className='tagged-user absolute text-white bg-black bg-opacity-80 py-1 px-2 rounded-md'
            style={{
              top: `${Math.max(0, Math.min(taggedUser.position.y, 350))}px`,
              left: `${Math.max(0, Math.min(taggedUser.position.x, 400))}px`,
            }}
          >
            {taggedUser.name}
          </div>
        ))}

      {image && showTagInput && clickedPosition && (
        <div
          className='tag-input-container absolute top-0 left-0 transform translate-x-10 translate-y-10 flex flex-col bg-white p-4 border border-gray-300 rounded-md shadow-md'
          style={{
            top: `${Math.max(0, Math.min(clickedPosition.y, 350))}px`,
            left: `${Math.max(0, Math.min(clickedPosition.x, 400))}px`,
          }}
        >
          <div className='tag-input flex items-center gap-2'>
            <select
              className='border border-gray-300 px-2 py-1 rounded-md'
              value={selectedUser?.uid || ''}
              onChange={(event) => {
                const selectedUid = event.target.value;
                const selectedUser = users.find(
                  (user) => user.uid === selectedUid
                );
                setSelectedUser(selectedUser || null);
              }}
            >
              <option value=''>Select user</option>
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              className='tag-button bg-blue-600 text-white border-none px-2 py-1 rounded-md cursor-pointer'
              onClick={handleTaggedUser}
            >
              Tag
            </button>
          </div>
          <div
            className='remove-tag-input absolute top-0 right-0 px-1 py-1 cursor-pointer'
            onClick={handleRemoveTagInput}
          >
            <XIcon size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTagging;
