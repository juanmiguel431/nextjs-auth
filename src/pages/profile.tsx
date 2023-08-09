import {GetServerSideProps, NextPage} from "next";
import { getSession } from 'next-auth/react';
import UserProfile from '../components/profile/user-profile';

const ProfilePage: NextPage = () => {
  return <UserProfile />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
