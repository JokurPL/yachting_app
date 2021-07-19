import BaseLayout from 'components/BaseLayout';
import OfferItem from 'components/OfferItem';
import getForCity from 'services/offers/getForCity';

export const getServerSideProps = async ({ params }) => {
  const offers = await getForCity(params.city);

  return {
    props: {
      offers,
      city: params.city
    }
  };
};

export default function CityOffers({ offers, city }) {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                Yachts in: {city}
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4 ">
            {offers?.length > 0 ? (
              offers.map((offer) => <OfferItem offer={offer} key={offer.id} />)
            ) : (
              <>
                <h2 className="text-center ml-20 p-2 bg-gray-300 w-80 rounded-md">
                  Not yachts found
                </h2>
              </>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
