import BaseLayout from 'components/BaseLayout';
import getOffer from 'services/offers/get';
import getRecent from 'services/offers/getRecent';

import Head from 'next/head';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import isAuthorized from 'services/offers/isAuthorized';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import isFavourite from 'services/offers/isFavourite';

export const getStaticPaths = async () => {
  const offers = await getRecent(6);

  return {
    paths: offers.map((offer) => ({ params: { id: String(offer.id) } })),
    fallback: true
  };
};

export const getStaticProps = async ({ params }) => {
  const offer = await getOffer(params.id);

  return {
    revalidate: 30,
    props: {
      offer,
      metaTitle: offer.title,
      metaDescription: offer.description
    }
  };
};

export default function OfferPage({ offer }) {
  const router = useRouter();
  const [session] = useSession();

  if (router.isFallback) {
    return (
      <BaseLayout>
        <div className="text-center">Loading...</div>
      </BaseLayout>
    );
  }

  const [views, setViews] = useState(offer.views ?? 0);

  const [favourite, setFavourite] = useState(isFavourite(offer, session?.user?.id));

  useEffect(async () => {
    console.log('reload');
    if (offer) {
      const response = await fetch(`/api/offers/${offer.id}/view`, {
        method: 'POST',
        body: JSON.stringify({
          id: offer.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const receivedData = await response.json();
        setViews(receivedData.views);
      }

      if (session && session.user) {
        const response = await fetch(`/api/offers/${offer.id}/isFavourite`, {
          method: 'POST',
          body: JSON.stringify({
            offer: offer,
            userId: session.user.id
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const receivedData = await response.json();
          setFavourite(receivedData.favStatus);
        }
      }
    }
  }, [offer, session]);

  const favouriteAction = async () => {
    if (session && session.user) {
      const response = await fetch(`/api/offers/${offer.id}/favourite`, {
        method: 'PUT',
        body: JSON.stringify({
          userId: session.user.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const receivedData = await response.json();
        setFavourite(receivedData.favStatus.favourite);
      }
    }
  };

  return (
    <BaseLayout>
      <Head>
        <title>{offer.title}</title>
      </Head>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-900 tracking-widest">{offer.category}</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{offer.title}</h1>
              <div className="flex mb-4">
                <p className="flex-grow text-indigo-900 border-b-2 border-indigo-500 py-2 text-lg px-1">
                  Description
                </p>
              </div>
              <p className="leading-relaxed mb-4">{offer.description}</p>
              <div className="flex border-t border-gray-400 py-2">
                <span className="text-gray-500">Location</span>
                <span className="ml-auto text-gray-900">{offer.location}</span>
              </div>
              <div className="flex border-t border-gray-400  py-2">
                <span className="text-gray-500">Price</span>
                <span className="ml-auto text-gray-900">
                  {offer.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                </span>
              </div>
              <div className="flex border-t border-gray-400 py-2">
                <span className="text-gray-500">Views</span>
                <span className="ml-auto text-gray-900">{views ?? 'No views'}</span>
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {offer.mobile}
                </span>
                {session && session.user ? (
                  <button
                    aria-label="Mark as favourite"
                    onClick={favouriteAction}
                    className={
                      favourite
                        ? 'transition duration-300 ease-in-out rounded-full outline-none w-10 h-10 bg-indigo-500 p-0 border-0 inline-flex items-center justify-center text-white ml-4 focus:outline-none hover:bg-gray-300'
                        : 'transition duration-300 ease-in-out rounded-full outline-none w-10 h-10 bg-gray-300 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 focus:outline-none hover:bg-indigo-500 hover:text-white'
                    }>
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                ) : (
                  <span className="rounded-full outline-none w-200 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 focus:outline-none ">
                    Login to mark this offer as favourite
                  </span>
                )}
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center">
              <Image
                alt={`Preview photo of ${offer.title}`}
                src={offer.imageUrl ?? '/noimage.jpg'}
                width={offer.imageUrl ? 800 : 1200}
                height={800}
                className="rounded"
              />
            </div>

            {isAuthorized(offer, session) && (
              <p>
                <Link href={`/offers/${offer.id}/edit`}>Edit this offer</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
