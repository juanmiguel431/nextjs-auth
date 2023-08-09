import { SessionProvider } from 'next-auth/react';

import Layout from '../components/layout/layout';
import '../styles/globals.css';
import {AppProps} from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
