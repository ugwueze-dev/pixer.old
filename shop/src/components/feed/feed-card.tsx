import React from 'react';
import Image from '@/components/ui/image';
import FeedCardImage from '@/components/feed/feed-card-image';
import { HeartIcon } from '../icons/heart-icon';
import { HeartFillIcon } from '../icons/heart-fill';
import { CommentIcon } from '../icons/comment-icon';
import { ShareIcon } from '../icons/share-icon';
import { EllipsisVerticalIcon } from '../icons/ellipsis-vertical-icon';
import teamImage from '@/assets/images/omnico-team.png';
import { Feed } from '@/types';
import client from '@/data/client';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useMe } from '@/data/user';
import { useModalAction } from '@/components/modal-views/context';
import FeedCardButton from './feed-card-button';
import Avatar from 'react-avatar';

interface FeedCardProps {
  feed: Feed;
}

export default function FeedCard({ feed }: FeedCardProps) {
  const [selectedFeed, setSelectedFeed] = useState<Feed>(feed);
  const { me } = useMe();
  const { openModal } = useModalAction();

  const { mutate: mutateFeed, isLoading } = useMutation(client.feeds.get, {
    onSuccess: (res) => {
      setSelectedFeed(res);
    },
    onError: (err: any) => {
      console.log(err.response.data, 'error');
    },
  });

  const { mutate: mutateLike } = useMutation(client.feeds.like, {
    onSuccess: (res) => {
      mutateFeed({ id: selectedFeed.id });
    },
    onError: (err: any) => {
      console.log(err.response.data, 'error');
    },
  });

  const onClickedAction = (actionType: string) => {
    if (!me) return;
    if (actionType === 'heart') {
      mutateLike({ user_id: me!.id, feed_id: selectedFeed.id });
    } else if (actionType === 'comment') {
      openModal('COMMENT_DETAILS', {
        slug: selectedFeed.id,
      });
    } else if (actionType === 'share') {
    } else {
      //more menu
    }
  };

  return (
    <div className="group rounded-[9.6px] bg-[#f3f3f3] pb-[14px] transition-shadow duration-300 hover:shadow-feed-card dark:bg-[#292929]">
      <div className="flex px-[20.5px] pt-[30.69px] pb-[21.56px]">
        <div className="mr-[5.58px] flex w-[46.8px] items-center overflow-hidden rounded-full">
          <Avatar
            size="48"
            round={true}
            name={me?.name}
            textSizeRatio={2}
            src={me?.profile ? me!.profile.avatar.thumbnail : undefined}
          />
        </div>
        <div className="max-w-[224.13px] font-poppins">
          <p className="mb-[4px] truncate text-[14.88px] font-semibold text-dark-300 dark:text-white md:text-[13.91px] 2xl:text-[16px]">
            {me?.name}
          </p>
          <p className="truncate text-[13.02px] font-medium italic text-dark-700 md:text-[12.17px] 2xl:text-[14px]">
            {selectedFeed.descr}
          </p>
        </div>
      </div>

      <div className="px-[20px]">
        <FeedCardImage
          feedID={selectedFeed.id}
          cardImage={selectedFeed.content[0].thumbnail?.replace(
            'localhost',
            'localhost:8000'
          )}
          feedType={selectedFeed.type}
        />
      </div>

      <div className="mt-[22.32px]">
        <div className="flex items-center p-[12.85px]">
          <div className="ml-[12px] flex gap-[21.41px]">
            <FeedCardButton
              type="heart"
              toogleClicked={onClickedAction}
              label={`${selectedFeed.likes_count}`}
              activePossible={selectedFeed.likes?.find(
                (eachLike) => eachLike.user_id === me?.id
              )}
              icon={<HeartIcon />}
              fillIcon={<HeartFillIcon />}
            />
            <FeedCardButton
              type="comment"
              toogleClicked={onClickedAction}
              label={`${selectedFeed.comments_count}`}
              icon={<CommentIcon />}
            />
            <FeedCardButton
              icon={<ShareIcon />}
              type="share"
              toogleClicked={onClickedAction}
            />
          </div>
          <div className="ml-auto mr-1">
            <FeedCardButton
              icon={<EllipsisVerticalIcon />}
              menu
              type="menu"
              toogleClicked={onClickedAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
