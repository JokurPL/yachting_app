import 'styles/globals.css';

import Head from 'next/head';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>{pageProps.metaTitle ?? 'Yachting APP - Rent and sale your boat'}</title>
        <meta
          name="description"
          content={pageProps.metaDescription ?? 'Search for all types of boat rentals near you'}
        />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
