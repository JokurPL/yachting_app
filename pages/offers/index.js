import BaseLayout from 'components/BaseLayout';
import Link from 'next/link';
import paginateOffers from 'services/offers/paginate';
import { jsonFetcher } from 'utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OfferItem from 'components/OfferItem';

export const getStaticProps = async () => {
  const offers = await paginateOffers();

  return {
    props: {
      offers: offers.records.map((offer) => offer.fields),
      offset: offers.offset
    }
  };
};

export default function AllOffers({ offers, offset }) {
  const { query } = useRouter();

  const [currentOffset, setOffset] = useState(offset);
  const [currentOffers, setOffers] = useState(offers);

  const loadMore = async () => {
    const response = await jsonFetcher(`/api/offers/paginate?offset=${currentOffset}`);
    setOffset(response.offset);
    setOffers([...currentOffers, ...response.offers]);
  };

  const handleFitlers = async () => {
    let filters = '';

    if (query.category) {
      filters += `?category=${query.category}`;
    }

    const response = await jsonFetcher(`api/offers/paginate${filters}`);
    setOffset(response.offset);
    setOffers([...response.offers]);
  };

  useEffect(() => {
    handleFitlers();
  }, [query]);

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-around w-full mb-4">
            <Link href="/offers">
              <button className={query.category ? 'btn-secondary' : 'btn-primary'}>All</button>
            </Link>
            <Link href="?category=sale">
              <button className={query.category === 'sale' ? 'btn-primary' : 'btn-secondary'}>
                For sale
              </button>
            </Link>
            <Link href="?category=rent">
              <button className={query.category === 'rent' ? 'btn-primary' : 'btn-secondary'}>
                For rent
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap -m-4">
            {currentOffers.map((offer) => (
              <OfferItem offer={offer} key={offer.id} />
            ))}
          </div>
          {currentOffset && (
            <button
              className="flex mx-auto mt-5 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={loadMore}>
              Load more
            </button>
          )}
        </div>
      </section>
    </BaseLayout>
  );
}
