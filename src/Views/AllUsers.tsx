import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import ProfileCard from '../components/ProfileCard';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import defaultImg from '../assets/defaultImg.jpeg';

interface User {
  name: string;
  email: string;
  uid: string;
  logo: string;
  image: string;
}

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as User);
      });
      setAllUsers(users);
    };

    getUsers();
  }, []);

  return (
    <>
      <Navbar />
      <section className='allUsers p-12 flex flex-col'>
        <h1 className='text-2xl flex justify-center font-bold'>All Users</h1>
        <div className='profileCardWrapper flex justify-start flex-wrap gap-10'>
          {allUsers.map((user) => (
            <div key={user?.uid} className='profileCard'>
              <ProfileCard
                key={user?.uid}
                name={user?.name}
                email={user?.email}
                uid={user?.uid}
                logo={user?.image || defaultImg}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AllUsers;
