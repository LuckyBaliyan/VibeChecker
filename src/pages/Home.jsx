import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FiArrowRight, FiBookmark, FiCompass, FiFolder, FiGithub, FiHeart } from 'react-icons/fi';
import { AiFillThunderbolt } from 'react-icons/ai';

const REPO_URL = 'https://github.com/LuckyBaliyan/VibeChecker';

const Home = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    if (!gridRef.current) {
      return undefined;
    }

    const tiles = gridRef.current.querySelectorAll('.home-tile');
    const ctx = gsap.context(() => {
      gsap.set(tiles, { opacity: 0, y: 30, scale: 0.86, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({ defaults: { ease: 'sine.out' } });
      tl.to(tiles, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.38,
        stagger: 0.09
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className='pinspire-home'>
      <div className='pinspire-shell'>
        <div className='pinspire-badge'>
          <AiFillThunderbolt />
        </div>
        <h1 className='pinspire-title'>
          <span className='uppercase'>Vibe Vault</span>
        </h1>
        <p className='pinspire-subtitle italic text-black'>Your Images, GIF and video library, neatly organized in one place.</p>

        <div className='pinspire-grid' ref={gridRef}>
          <button className='home-tile tile-gallery' onClick={() => navigate('/browse')} type='button'>
            <FiArrowRight className='tile-icon tile-icon-light' />
            <h2>Enter Gallery</h2>
            <p>Explore curated inspiration</p>
          </button>

          <button
            className='home-tile tile-collections'
            onClick={() => navigate('/collection', { state: { source: 'saved' } })}
            type='button'
          >
            <FiFolder className='tile-icon' />
            <h2>Collections</h2>
            <p>View your boards</p>
          </button>

          <button
            className='home-tile tile-saved'
            onClick={() => navigate('/collection', { state: { source: 'saved' } })}
            type='button'
          >
            <FiBookmark className='tile-icon' />
            <h2>Saved</h2>
            <p>Bookmarked pins</p>
          </button>

          <button
            className='home-tile tile-liked'
            onClick={() => navigate('/collection', { state: { source: 'liked' } })}
            type='button'
          >
            <FiHeart className='tile-icon' />
            <h2>Liked</h2>
            <p>Your favorites</p>
          </button>

          <a
            className='home-tile tile-github'
            href={REPO_URL}
            target='_blank'
            rel='noreferrer'
            aria-label='Open project repository'
          >
            <FiGithub className='tile-icon' />
            <h2>GitHub</h2>
            <p>View source code</p>
          </a>

          <button className='home-tile tile-explore' onClick={() => navigate('/browse')} type='button'>
            <FiCompass className='tile-icon' />
            <h2>Explore</h2>
            <p>Discover trending</p>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
