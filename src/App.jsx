import { useState } from 'react'
import P1 from './components/P1'
import './App.css'
import { useEffect } from 'react';
import gsap from 'gsap';
function App() {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const titles = ['Earth', 'Scilla', 'Volcanic', 'Venus'];
  let lastScrollTime = 0;
    const scrollThrottleTime = 2000; // 2 seconds
   let scrollCount=0;
    const handleWheel = (event) => {
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime >= scrollThrottleTime) {
        lastScrollTime = currentTime;
        
        // Determine scroll direction
        const direction = event.deltaY > 0 ? 1 : -1;
        scrollCount=(scrollCount+1)%4;
        const heading = document.querySelectorAll('h1');
        gsap.to(heading, {
          duration: 1,
          y: `-=${100}%`, 
          ease: "power2.inOut",
          
        });
        if(scrollCount===0){
          gsap.to(heading,{
            duration:1,
            y:`0`,
            ease:"power2.inOut",
          });
        }
        // Rotate the spheres group
       
      }
    };

    window.addEventListener('wheel', handleWheel);

  

  // Add event listener when component mounts
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
    <div className='w-full h-screen overflow-hidden'>
      <div className='w-full h-screen absolute top-0 left-0 z-[2] text-white font-["Helvetica Now Display"]'>
        <nav className='w-full py-10 px-10 flex justify-between items-center'>
          <h3>Planets</h3>
          <div className='flex gap-6'>
            <a className='text-sm' href="#">Home</a>
            <a className='text-sm'href="#">About</a>
            <a className='text-sm' href="#">Contact</a>
          </div>
        </nav>
        <div className='absolute top-[15%] left-1/2 -translate-x-1/2 text-center font-["Bellina"]'>
        <div className='w-[40vw] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent '></div>
        <div className='w-full h-[5em] md:h-[9em] overflow-hidden'>
        <h1 className='h-full text-7xl  md:text-9xl font-light tracking-tighter'>Earth</h1>
        <h1 className='h-full text-7xl  md:text-9xl font-light tracking-tighter'>Scilla</h1>
        <h1 className='h-full text-7xl  md:text-9xl font-light tracking-tighter'>Volcanic</h1>
        <h1 className='h-full text-7xl  md:text-9xl font-light tracking-tighter'>Venus</h1>
        </div>
        <div className='w-[40vw] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent '></div>
        </div>
      </div>
        <P1/></div>
  
    </>
  )
}

export default App
