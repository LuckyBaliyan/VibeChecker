import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { FiExternalLink, FiLink2, FiShare2 } from 'react-icons/fi';
import { AiFillThunderbolt } from 'react-icons/ai';
import { toggleLikes } from '../redux/features/likeSlice';
import { addCollection } from '../redux/features/collectionSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';


const MediaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = useSelector((store) => store.search);

  const dispatch = useDispatch();

  const stateItem = location.state?.item;
  const fallbackItem = useMemo(() => {
    const fromStore = (results || []).find((item) => String(item?.id) === String(id));
    if (fromStore) return fromStore;

    const cached = localStorage.getItem('lastViewedMedia');
    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);
      if (String(parsed?.id) === String(id)) return parsed;
      return null;
    } catch {
      return null;
    }
  }, [id, results]);

  const currentItem = stateItem || fallbackItem;
  const [feedbackText, setFeedbackText] = useState('');
  const [relatedType, setRelatedType] = useState(currentItem?.type || 'photo');
  const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem('themeMode') === 'dark');

  useEffect(() => {
    if (!currentItem) return;
    localStorage.setItem('lastViewedMedia', JSON.stringify(currentItem));
  }, [currentItem]);

  useEffect(() => {
    if (currentItem) setRelatedType(getMediaKind(currentItem));
  }, [currentItem]);

  useEffect(() => {
    if (!feedbackText) return undefined;
    const timer = setTimeout(() => setFeedbackText(''), 2200);
    return () => clearTimeout(timer);
  }, [feedbackText]);

  useEffect(() => {
    const root = document.documentElement;
    const syncThemeFromRoot = () => {
      setIsDarkTheme(root.getAttribute('data-theme') === 'dark');
    };

    syncThemeFromRoot();

    const observer = new MutationObserver(syncThemeFromRoot);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const collectionItems = useSelector((state) => state.collections.items);
  const likedItems = useSelector((state)=>state.like.likedItems);

  const getMediaKind = (item) => {
    const type = String(item?.type || '').toLowerCase();
    const src = String(item?.src || item?.thumbnail || '').toLowerCase();

    if (type === 'gif') return 'gif';
    if (type === 'video') return 'video';
    if (type === 'photo' || type === 'image') return 'photo';
    if (src.includes('.gif')) return 'gif';
    if (src.includes('.mp4') || src.includes('.webm') || src.includes('.mov')) return 'video';
    return 'photo';
  };

  const relatedPool = useMemo(() => {
    const merged = [...(results || []), ...(collectionItems || []), ...(likedItems || [])];
    const uniqueMap = new Map();

    merged.forEach((item) => {
      const key = `${String(item?.id || '')}-${String(item?.src || '')}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [results, collectionItems, likedItems]);

  const relatedContent = useMemo(() => {
    if (!currentItem) return [];

    return relatedPool
      .filter((item) => getMediaKind(item) === relatedType)
      .filter((item) => !(String(item?.id) === String(currentItem.id) && item?.src === currentItem.src))
      .slice(0, 8);
  }, [currentItem, relatedType, relatedPool]);

  const addToCollection = () => {
    if (!currentItem) return;
    const isDuplicate = (collectionItems || []).some(
      (collectionItem) =>
        String(collectionItem?.id) === String(currentItem?.id) && collectionItem?.src === currentItem?.src
    );

    if (isDuplicate) {
      toast.warning('Already in collection');
      return;
    }

    dispatch(addCollection(currentItem));
    toast.success('Added to collection');
  };

  const handleShare = async () => {
    if (!currentItem) return;

    const shareUrl = currentItem.src || window.location.href;
    const shareData = {
      title: currentItem.title || 'VibeVault media',
      text: 'Check this media on VibeVault',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setFeedbackText('Shared');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setFeedbackText('Link copied');
    } catch {
      setFeedbackText('Unable to share');
    }
  };

  const openDetailFor = (item) => {
    navigate(`/media/${encodeURIComponent(item.id || 'preview')}`, { state: { item } });
  };

  const pageBgClass = isDarkTheme ? 'bg-[#0f1219]' : 'bg-[#f0f0f3]';
  const panelBgClass = isDarkTheme ? 'bg-[#141a27] border-[#2a3042]' : 'bg-white border-[#e7e7ee]';
  const textPrimaryClass = isDarkTheme ? 'text-zinc-100' : 'text-[#111623]';
  const textSecondaryClass = isDarkTheme ? 'text-zinc-400' : 'text-[#5f6674]';
  const mutedPanelClass = isDarkTheme ? 'bg-[#171e2d] border-[#2a3042] text-zinc-200' : 'bg-[#f7f7fa] border-[#e2e2e9] text-[#1b1b1f]';
  const relatedCardClass = isDarkTheme ? 'border-[#2a3042] bg-[#171e2d]' : 'border-[#ececf2] bg-[#fafafd]';

  if (!currentItem) {
    return (
      <section className={`min-h-screen px-4 py-10 ${pageBgClass}`}>
        <div className={`mx-auto max-w-4xl rounded-3xl border p-8 text-center ${panelBgClass}`}>
          <p className={`text-lg font-semibold ${textPrimaryClass}`}>Media not found</p>
          <p className={`mt-2 text-sm ${textSecondaryClass}`}>Open an item from Browse to see the detail page.</p>
          <Button text='Go to Browse' className='mt-6 rounded-full bg-[#ef3f73] text-white' onClick={() => navigate('/browse')} />
        </div>
      </section>
    );
  }

  const mediaKind = getMediaKind(currentItem);
  const isVideo = mediaKind === 'video';
  const isGifMp4 = mediaKind === 'gif' && currentItem.src?.includes('.mp4');
  const previewSrc = currentItem.thumbnail || currentItem.src;
  const isLiked = likedItems.some(
    (item)=> String(item.id) === String(currentItem?.id)
  );

  const handleLikes = ()=>{
    if(!currentItem)return;
    dispatch(toggleLikes(currentItem));
  }

  return (
    <section className={`min-h-screen px-2 pb-28 pt-5 sm:px-4 sm:pt-6 ${pageBgClass}`}>
      <div className='mx-auto w-full max-w-[1280px]'>
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]'>
          <article className={`overflow-hidden rounded-3xl border shadow-[0_10px_26px_rgba(0,0,0,0.08)] ${panelBgClass}`}>
            <div className={`relative aspect-[4/3] w-full ${isDarkTheme ? 'bg-[#171e2d]' : 'bg-[#e8e8ee]'}`}>
              {isVideo || isGifMp4 ? (
                <video
                  src={currentItem.src}
                  poster={currentItem.thumbnail}
                  className='h-full w-full object-cover'
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img src={previewSrc} alt={currentItem.title || 'Media'} className='h-full w-full object-cover' />
              )}
            </div>
          </article>

          <aside className={`rounded-3xl border p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] sm:p-6 ${panelBgClass}`}>
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 rounded-full bg-[#ffe8f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ef3f73]'>
                <AiFillThunderbolt className='h-3.5 w-3.5' />
                {currentItem.type || 'media'}
              </div>
              <button type='button' onClick={handleShare} className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[#ef3f73] hover:text-[#ef3f73] ${isDarkTheme ? 'border-[#2a3042] text-zinc-300' : 'border-[#e4e4ec] text-[#5b6270]'}`} aria-label='Share'>
                <FiShare2 className='h-4 w-4' />
              </button>
            </div>

            <h1 className={`mt-4 text-3xl font-bold leading-tight ${textPrimaryClass}`}>
              {currentItem.title || 'Untitled media'}
            </h1>
            <p className={`mt-3 text-sm leading-6 ${textSecondaryClass}`}>
              Capturing high-energy visual mood with clean composition. Save it to your collection and explore similar picks below.
            </p>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <Button
                text='Add to Collection'
                className='rounded-xl border border-[#ef3f73] bg-[#ef3f73] px-3 py-2 text-[11px] text-white hover:bg-transparent hover:text-[#ef3f73]'
                onClick={addToCollection}
              />
              <Button
                text={isLiked ? 'Liked' : 'Like'}
                className={`rounded-xl border px-3 py-2 text-[11px] ${isLiked ? 'border-[#ef3f73] bg-[#ffe8f0] text-[#ef3f73]' : mutedPanelClass}`}
                onClick={handleLikes}
              >
                <span className='inline-flex items-center gap-1.5'>
                  {isLiked ? <HiHeart className='h-4 w-4 text-[#ef3f73]' /> : <HiOutlineHeart className='h-4 w-4' />}
                  {isLiked ? 'Liked' : 'Like'}
                </span>
              </Button>
            </div>

            <div className='mt-3 grid grid-cols-2 gap-3'>
              <a
                href={currentItem.src}
                target='_blank'
                rel='noreferrer'
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-[#ef3f73] hover:text-[#ef3f73] ${mutedPanelClass}`}
              >
                <FiExternalLink className='h-3.5 w-3.5' />
                Open Source
              </a>
              <button
                type='button'
                onClick={handleShare}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-[#ef3f73] hover:text-[#ef3f73] ${mutedPanelClass}`}
              >
                <FiLink2 className='h-3.5 w-3.5' />
                Share Link
              </button>
            </div>

            {feedbackText && (
              <p className={`mt-4 rounded-lg px-3 py-2 text-xs ${isDarkTheme ? 'bg-[#171e2d] text-zinc-300' : 'bg-[#f6f7fb] text-[#505868]'}`}>
                {feedbackText}
              </p>
            )}
          </aside>
        </div>

        <section className={`mt-8 rounded-3xl border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:p-6 ${panelBgClass}`}>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2 className={`text-xl font-semibold ${isDarkTheme ? 'text-zinc-100' : 'text-[#121827]'}`}>Related Content</h2>
            <div className='flex items-center gap-2'>
              {[
                { label: 'Images', value: 'photo' },
                { label: 'GIFs', value: 'gif' },
                { label: 'Videos', value: 'video' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type='button'
                  onClick={() => setRelatedType(tab.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    relatedType === tab.value
                      ? 'bg-[#101520] text-white'
                      : isDarkTheme
                        ? 'bg-[#171e2d] text-zinc-300 hover:bg-[#20293b]'
                        : 'bg-[#f3f3f7] text-[#333b4c] hover:bg-[#e8e8f0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {relatedContent.length === 0 ? (
            <p className={`mt-6 text-sm ${isDarkTheme ? 'text-zinc-400' : 'text-[#717789]'}`}>No related content available for this type yet.</p>
          ) : (
            <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {relatedContent.map((item, index) => {
                const relatedVideo = item.type === 'video' || (item.type === 'gif' && item.src?.includes('.mp4'));
                const title = item.title || 'Untitled';

                return (
                  <article
                    key={`${item.id || 'item'}-${index}`}
                    onClick={() => openDetailFor(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDetailFor(item);
                      }
                    }}
                    role='button'
                    tabIndex={0}
                    className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 ${relatedCardClass}`}
                  >
                    <div className={`aspect-[4/3] w-full ${isDarkTheme ? 'bg-[#20293b]' : 'bg-[#e6e6eb]'}`}>
                      {relatedVideo ? (
                        <video
                          src={item.src}
                          poster={item.thumbnail}
                          className='h-full w-full object-cover'
                          muted
                          autoPlay
                          loop
                          playsInline
                        />
                      ) : (
                        <img src={item.thumbnail || item.src} alt={title} className='h-full w-full object-cover' />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default MediaDetail;
