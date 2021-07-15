import BaseLayout from 'components/BaseLayout';
import Link from 'next/link';
import Image from 'next/image';
import getForUser from 'services/offers/getForUser';

import { getSession } from 'next-auth/client';
import OfferItem from 'components/OfferItem';
export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/users/signin',
        permanent: false
      }
    };
  }
  const offers = await getForUser(session.user.email);

  const userName = session.user.name;

  return {
    props: {
      offers,
      userName
    }
  };
};

export default function My({ offers, userName }) {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                Your offers, {userName}:
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {offers.length === 0 && (
              <div className="w-full text-center bg-yellow-100 py-4">
                You do not have any offers.
              </div>
            )}

            {offers.map((offer) => (
              <OfferItem offer={offer} key={offer.id} />
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
