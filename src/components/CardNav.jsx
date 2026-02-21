import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { AiFillThunderbolt } from 'react-icons/ai';

const accentModes = ['mint', 'cyan', 'magenta', 'violet'];

const CardNav = () => {
  const items = [
    {
      label: 'Navigation',
      links: [
        { label: 'Home', ariaLabel: 'Home' },
        { label: 'Browse', ariaLabel: 'Serach Assets' },
        { label: 'Collections', ariaLabel: 'Saved Assets' },
      ],
    },
    {
      label: 'Projects',
      links: [
        { label: 'Featured', ariaLabel: 'Featured Projects' },
        { label: 'Case Studies', ariaLabel: 'Project Case Studies' },
      ],
    },
    {
      label: 'Contact',
      links: [
        { label: 'Email', ariaLabel: 'Email us' },
        { label: 'Twitter', ariaLabel: 'Twitter' },
        { label: 'LinkedIn', ariaLabel: 'LinkedIn' },
      ],
    },
  ];

  const ease = 'power3.out';

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [accentIndex, setAccentIndex] = useState(0);

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const applyAccent = (index) => {
    const mode = accentModes[index % accentModes.length];
    document.documentElement.setAttribute('data-accent', mode);
    localStorage.setItem('accentMode', mode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('accentMode');
    const initialIndex = accentModes.indexOf(savedMode);
    const resolvedIndex = initialIndex >= 0 ? initialIndex : 0;
    setAccentIndex(resolvedIndex);
    applyAccent(resolvedIndex);
  }, []);

  const handleChangeVibe = () => {
    const nextIndex = (accentIndex + 1) % accentModes.length;
    setAccentIndex(nextIndex);
    applyAccent(nextIndex);
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector('.card-nav-content');
    if (!contentEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      const prevStyles = {
        visibility: contentEl.style.visibility,
        position: contentEl.style.position,
        height: contentEl.style.height,
      };

      contentEl.style.visibility = 'hidden';
      contentEl.style.position = 'relative';
      contentEl.style.height = 'auto';

      const topBarHeight = navEl.querySelector('.card-nav-top')?.offsetHeight || 60;
      const fullHeight = topBarHeight + contentEl.scrollHeight + 24;

      contentEl.style.visibility = prevStyles.visibility;
      contentEl.style.position = prevStyles.position;
      contentEl.style.height = prevStyles.height;

      return fullHeight;
    }

    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease,
        stagger: 0.05,
      },
      '-=0.1'
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className='card-nav-container'>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
        <div className='card-nav-top'>
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role='button'
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
          >
            <div className='hamburger-line' />
            <div className='hamburger-line' />
          </div>

          <div className='logo-container'>
            <div className='logo-badge' aria-hidden='true'>
              <AiFillThunderbolt className='logo-bolt-icon' />
            </div>
          </div>

          <button type='button' className='card-nav-cta-button' onClick={handleChangeVibe}>
            Change The Vibe
          </button>
        </div>

        <div className='card-nav-content' aria-hidden={!isExpanded}>
          {items.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className='nav-card' ref={setCardRef(idx)}>
              <div className='nav-card-label'>{item.label}</div>

              <div className='nav-card-links'>
                {item.links?.map((lnk, i) => (
                  <a key={`${lnk.label}-${i}`} className='nav-card-link' href={lnk.href} aria-label={lnk.ariaLabel}>
                    <GoArrowUpRight className='nav-card-link-icon' aria-hidden='true' />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
