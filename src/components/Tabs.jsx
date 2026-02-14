import React from 'react';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/features/searchSlice';

const Tabs = () => {
  const tabs = [
    { label: 'Photos', value: 'photos' },
    { label: 'GIFs', value: 'gifs' },
    { label: 'Videos', value: 'videos' },
  ];

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.search.activeTab);

  return (
    <div className='flex justify-center items-center gap-4 w-full p-6'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <Button
            key={tab.value}
            text={tab.label}
            onClick={() => dispatch(setActiveTab(tab.value))}
            className={
              isActive
                ? 'bg-white text-black border border-white scale-105 shadow-[0_0_18px_rgba(255,255,255,0.35)]'
                : 'bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 opacity-80 hover:opacity-100'
            }
            aria-pressed={isActive}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
