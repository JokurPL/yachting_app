import BaseLayout from 'components/BaseLayout';
import OfferItem from 'components/OfferItem';
import getActiveUsersOffers from 'services/offers/getActiveUsersOffers';
import getUsername from 'services/users/getUsername';

export const getServerSideProps = async ({ params }) => {
  const userName = await getUsername(params.airtableId);
  if (userName === null) return { notFound: true };

  const offers = await getActiveUsersOffers(params.airtableId);

  return {
    props: {
      userName,
      offers
    }
  };
};

export default function ActiveUsersOffer({ offers, userName }) {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                {userName}&apos;s active offers:
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {offers.length === 0 && (
              <div className="w-full text-center bg-yellow-100 py-4">
                This user do not have any offers.
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
