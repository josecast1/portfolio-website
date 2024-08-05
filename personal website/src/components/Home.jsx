import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

const Home = () => {
  return (
    <>
    <section className="flex items-center justify-center h-screen w-screen bg-transparent">
      <motion.h1
        className="text-center text-5xl font-poppins font-bold bg-gradient-to-tr from-rose-600 to-purple-500 
        bg-clip-text text-transparent"
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y:0,
          transition: {
            duration: 1,
            delay: 0.6
          }
        }}
      >
        Home
      </motion.h1>
    </section>
    </>
  );
};

export default Home;
