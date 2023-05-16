import Image from '@/components/ui/image';
import servicesPost from '@/assets/images/services/services-post.png';
import { ArrowLeftIcon } from '../icons/arrow-left-icon';

function PostImageBar({ active = false }: { active?: boolean }) {
  return (
    <div className={`h-[5.62px] bg-white rounded-[62.45px] ${
      active ? 'w-[43.71px]' : 'w-[26.23px] opacity-30'
    }`}></div>
  )
}

export default function PostImages() {
  return (
    <div>
      <div className='relative pb-[59.67%] bg-red-700'>
        {/* image */}
        <div className='absolute inset-0 z-[1]'>
          <Image src={servicesPost} alt='Service' layout='fill' objectFit='cover' />
        </div>
        {/* left button */}
        <button className='absolute left-[7.49px] z-[2] p-[5px] top-1/2 -translate-y-1/2'>
          <ArrowLeftIcon className='h-[19.98px] w-[19.98px] text-[#fefefe]' />
        </button>
        {/* right button */}
        <button className='absolute right-[7.49px] z-[2] p-[5px] top-1/2 -translate-y-1/2'>
          <ArrowLeftIcon className='h-[19.98px] w-[19.98px] text-[#fefefe] rotate-180' />
        </button>

        <div className='absolute left-1/2 bottom-[13.74px] z-[2] -translate-x-1/2 flex space-x-[8.74px]'>
          <PostImageBar active />
          <PostImageBar />
          <PostImageBar />
          <PostImageBar />
        </div> 
      </div>
    </div>
  )
}