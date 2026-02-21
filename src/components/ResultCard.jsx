import React from 'react';
import Button from './Button';

const ResultCard = ({ elem, isLoading = false, heightClass = 'h-[280px]' }) => {
  const isVideo = elem.type === 'video';
  const isGifMp4 = elem.type === 'gif' && elem.src?.includes('.mp4');
  const mediaTypeLabel = elem.type === 'photo' ? 'img' : elem.type || 'img';

  const addToCollection = (item) => {
    const oldData = JSON.parse(localStorage.getItem('collections')) || [];
    const newData = [...oldData, item];
    localStorage.setItem('collections', JSON.stringify(newData));
  };

  if (isLoading) {
    return (
      <article className='mb-4 break-inside-avoid overflow-hidden bg-black/60 sm:mb-5 lg:mb-6'>
        <div className={`card-skeleton-glow w-full ${heightClass} bg-zinc-800/80`} />
      </article>
    );
  }

  return (
    <article className='group relative mb-4 break-inside-avoid overflow-hidden bg-black sm:mb-5 lg:mb-6'>
      <div className={`relative w-full ${heightClass} bg-black`}>
        {isVideo || isGifMp4 ? (
          <video
            src={elem.src}
            poster={elem.thumbnail}
            className='h-full w-full object-cover'
            muted
            autoPlay
            loop
            playsInline
            draggable='true'
            loading='lazy'
          />
        ) : (
          <img
            src={elem.thumbnail || elem.src}
            alt={elem.title}
            className='h-full w-full object-cover'
            loading='lazy'
            draggable='true'
          />
        )}

        <div className='absolute left-2 top-2 max-w-[75%] px-2 py-1'>
          <p className='text-accent capitalize line-clamp-2 text-lg font-semibold leading-[1] tracking-wide'>
            {elem.title || 'Untitled'}
          </p>
          <p className='mt-4 w-fit rounded-full bg-black px-2.5 py-1 text-[12px] uppercase tracking-[0.12em] text-white'>
            {mediaTypeLabel}
          </p>
        </div>

        <div className='absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <Button
            text='SAVE'
            variant='ghostCyber'
            className='btn-cyber pointer-events-auto px-3 py-1.5 text-[10px]'
            onClick={() => addToCollection(elem)}
          />

          <a
            href={elem.src}
            target='_blank'
            rel='noreferrer'
            className='border-accent bg-accent text-black hover:text-accent pointer-events-auto inline-flex h-8 w-8 items-center justify-center border transition-colors duration-200 hover:bg-transparent'
            aria-label={isVideo ? 'Download video' : 'Open media source'}
          >
            {isVideo ? (
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                <path d='M12 3a.75.75 0 0 1 .75.75v9.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V3.75A.75.75 0 0 1 12 3Z' />
                <path d='M3.75 14.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 1 1.5 0v3a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18.25v-3a.75.75 0 0 1 .75-.75Z' />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
                <path d='M12.75 3a.75.75 0 0 0 0 1.5h5.69l-8.72 8.72a.75.75 0 1 0 1.06 1.06l8.72-8.72v5.69a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 20.25 3h-7.5Z' />
                <path d='M5.25 4.5A2.25 2.25 0 0 0 3 6.75v12A2.25 2.25 0 0 0 5.25 21h12a2.25 2.25 0 0 0 2.25-2.25v-5.5a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 1-.75.75h-12a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 0 0-1.5h-5.5Z' />
              </svg>
            )}
          </a>
        </div>
      </div>
    </article>
  );
};

export default ResultCard;
