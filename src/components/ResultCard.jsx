import React from 'react';
import Button from './Button';

const heightVariants = ['h-56', 'h-64', 'h-72', 'h-80', 'h-[22rem]', 'h-[26rem]'];

const ResultCard = ({ elem, index, isLoading = false }) => {
  const mediaHeight = heightVariants[index % heightVariants.length];
  const isVideo = elem.type === 'video';
  const isGifMp4 = elem.type === 'gif' && elem.src?.includes('.mp4');

  if (isLoading) {
    return (
      <article className='relative mb-3 break-inside-avoid overflow-hidden rounded border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 sm:mb-5'>
        <div className={`card-skeleton-glow w-full ${mediaHeight} bg-zinc-800`} />
        <div className='flex items-center justify-between gap-2 p-3'>
          <div className='flex-1'>
            <div className='card-skeleton-glow mb-2 h-3 w-3/4 rounded bg-zinc-800' />
            <div className='card-skeleton-glow h-2 w-1/3 rounded bg-zinc-800' />
          </div>
          <div className='card-skeleton-glow h-8 w-14 rounded-md bg-zinc-800' />
        </div>
      </article>
    );
  }

  return (
    <article className='group relative mb-3 break-inside-avoid overflow-hidden rounded border bg-zinc-900/80 shadow-lg shadow-black/20 sm:mb-5'>
      <div className={`relative w-full ${mediaHeight} bg-black`}>
        {isVideo || isGifMp4 ? (
          <video
            src={elem.src}
            poster={elem.thumbnail}
            className='h-full w-full object-cover'
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={elem.thumbnail || elem.src}
            alt={elem.title}
            className='h-full w-full object-cover'
            loading='lazy'
          />
        )}

        <div className='absolute inset-0 flex flex-col justify-between from-black/80 via-black/35 to-black/20 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='flex items-start justify-between gap-2'>
            <div>
              <p className='line-clamp-2 leading-4 text-sm font-semibold text-white capitalize mix-blend-difference'>{elem.title}</p>
              <p className='text-[10px] uppercase tracking-wide text-white bg-zinc-900 py-1 px-2 mt-2 rounded-full w-fit'>{elem.type}</p>
            </div>
            <Button text='Save' className='px-3 py-1.5 text-xs font-semibold' />
          </div>

          <div className='flex justify-end'>
            <a
              href={elem.src}
              target='_blank'
              rel='noreferrer'
              className='rounded-full bg-white p-2 text-black'
              aria-label='Open media source'
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                <path d='M12.75 3a.75.75 0 0 0 0 1.5h5.69l-8.72 8.72a.75.75 0 1 0 1.06 1.06l8.72-8.72v5.69a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 20.25 3h-7.5Z' />
                <path d='M5.25 4.5A2.25 2.25 0 0 0 3 6.75v12A2.25 2.25 0 0 0 5.25 21h12a2.25 2.25 0 0 0 2.25-2.25v-5.5a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 1-.75.75h-12a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 0 0-1.5h-5.5Z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResultCard;
