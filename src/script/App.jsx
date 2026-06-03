import React, { Suspense, useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';
import '../style/App.css';
import { default as Counter } from './counter.jsx';
import { default as Swiper } from './Swiper.jsx';
import { default as Chat } from './chat.jsx';

function App()
{

  return (
    <>
      <section id="center" className='no-select'>

        <Suspense fallback={<Swiper />}>
          <Chat />

          <div className="hero">
            <img src={heroImg} className="base" width="170" height="179" alt="" />
            <img src={reactLogo} className="framework" alt="React logo" />
            <img src={viteLogo} className="vite" alt="Vite logo" />
          </div>

          <Counter />
        </Suspense>



      </section>


      <span id="spacer"></span>
    </>
  )
}

export default App;



