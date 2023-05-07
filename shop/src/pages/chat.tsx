import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  ProductQueryOptions,
  TypeQueryOptions,
} from '@/types';
import type { GetStaticProps } from 'next';
import Layout from '@/layouts/_layout';
import ChatSidebar from '@/components/chat/sidebar';
import ChatContent from '@/components/chat/content';
import ChatDetails from '@/components/chat/details';
import { useRouter } from 'next/router';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import client from '@/data/client';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import PromoCarousel from '@/components/product/promo-carousel';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTypes } from '@/data/type';
import isEmpty from 'lodash/isEmpty';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { SetStateAction, useState } from 'react';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  try {
    await Promise.all([
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, { language: locale }],
        ({ queryKey }) =>
          client.products.all(queryKey[1] as ProductQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.CATEGORIES, { limit: 100, language: locale }],
        ({ queryKey }) =>
          client.categories.all(queryKey[1] as CategoryQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.TYPES, { limit: 100, language: locale }],
        ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
      ),
    ]);
    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function ChatMain() {
  const { query } = useRouter();
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();

  const [channelID, setChannelID] = useState(-1);

  return (
    <div
      className={`${
        isMounted && ['xs'].indexOf(breakpoint) !== -1
          ? 'h-[calc(100vh-120px)]'
          : 'h-[calc(100vh-70px)]'
      } flex  flex-row bg-white dark:bg-dark-100`}
    >
      <ChatSidebar
        onSelectChannel={(selectedChannelID: SetStateAction<number>) =>
          setChannelID(selectedChannelID)
        }
        selectedChannelID={channelID}
      />
      <ChatContent
        onSelectChannel={(selectedChannelID: SetStateAction<number>) =>
          setChannelID(-1)
        }
        selectedChannelID={channelID}
      />
      <ChatDetails />
    </div>
  );
}

const Chat: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="UI Design Resources, UI Kits, Wireframes, Icons and More"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.home}
      />
      <ChatMain />
    </>
  );
};

Chat.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Chat;
