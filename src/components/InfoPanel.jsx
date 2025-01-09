import React, { useRef, useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Phone } from 'lucide-react';

// Info panel that displays info to the corresponding model
const InfoPanel = ({ name, onClose, onTabSelect, activeTab }) => {
    const [isClosing, setIsClosing] = useState(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);
  
    // Update content height when tab changes
    useEffect(() => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        // Limit the height to 400px maximum while allowing smaller heights
        setContentHeight(Math.min(height, 400));
      }
    }, [activeTab]);
  
    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    };
  
    const handleTabClick = (tab) => {
      onTabSelect(tab);
    };
  
  
    const content = {
      About: (
        <div className="flex flex-col items-center space-y-6">
          {/* Image and Content */}
          <div className="flex items-center space-x-6">
            {/* Image */}
            <div className="relative">
              <img 
                src="/PortfolioHeadshot.jpg"
                alt="Jose Castro"
                className="w-[73rem] h-72 rounded-full object-fill shadow-lg"
              />
              <div className="absolute inset-0 border-4 border-blue-400 rounded-full hover:animate-pulse"></div>
            </div>
      
            {/* Content */}
            <div className="space-y-3">
              {/* Introduction Section */}
              <h2 className="text-xl font-bold text-blue-400">Hello, I'm Jose Castro!</h2>
              <p className="text-base leading-relaxed text-gray-300">
                I'm a Computer Science student at the University of Florida with a strong interest in web development and full-stack engineering.
              </p>
      
              {/* Divider */}
              <div className="h-1 border-b border-gray-700 mt-8"></div>
      
              {/* Website Info Section */}
              <h2 className="text-xl font-bold text-blue-400">How I Built This Website</h2>
              <p className="text-base leading-relaxed text-gray-300">
                This website was built using React Three Fiber, which utilizes Three.js for 3D rendering. I also leveraged React Drei, a library with helpers for React Three Fiber, including Rapier for physics, Spring for mesh animations, and Postprocessing to enhance lighting and depth.
              </p>
            </div>
          </div>
        </div>
      ),
      Projects: (
        <div className="space-y-6 text-lg">
        {/* Steam Wrapped Website */}
        <div className="project-item">
          <div className="flex justify-between items-center mb-2">
            <a 
              href="https://steam-wrapped-frontend.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center group"
            >
              <span>Steam Wrapped Website</span>
              <svg 
                className="mt-1 w-7 h-7 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200 self-center" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <span className="text-gray-400 text-base mr-4 mt-1">Fall 2024</span>
          </div>
            <div className="text-gray-300 text-base mb-3">Javascript, Python</div>
            <ul className="list-disc pl-5 space-y-2 mr-4 text-base">
              <li>Collaboratively developed a full-stack web application hosted on Vercel, allowing users to create tasks, set goals, track progress, and visualize & analyze habits for game achievements from their Steam profile.</li>
              <li>Developed a RESTful Flask API integrating Google OAuth for one-time user login using Steam profile links.</li>
              <li>Utilized Next.js/React for the frontend, styled with Tailwind CSS, and Flask for core API functionality, with Express.js handling responses between the frontend and backend.</li>
              <li>Built endpoints to retrieve user information, game data, and achievements from the Steam API, with MongoDB used to store and manage user data.</li>
              <li>Implemented unit testing with pytest for Flask endpoints to ensure reliable functionality.</li>
            </ul>
            <div className="border-b border-gray-700 mt-6 mr-4"></div>
          </div>
  
          {/* County Demographic Viewer */}
          <div className="project-item">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-blue-400">County Demographic Viewer</h3>
              <span className="text-gray-400 text-base mr-4 mt-1">Summer 2024</span>
            </div>
            <div className="text-gray-300 text-base mb-3">Javascript</div>
            <ul className="list-disc pl-5 space-y-2 text-base mr-4">
              <li>Collaboratively developed a web application that allows users to select a state and county in the United States, filter demographic categories, and display the data in either a list or bar chart format.</li>
              <li>Employed algorithms for fetching and processing JSON data, populating dropdowns dynamically, and handling form events and user interactions efficiently.</li>
              <li>Utilized HTML, CSS, JS-sdsl, Chart.js, Tailwind CSS, and Flowbite.</li>
            </ul>
            <div className="border-b border-gray-700 mt-6 mr-4"></div>
          </div>
  
          {/* SHPE Discord Bot */}
          <div className="project-item">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-blue-400">SHPE Discord Bot</h3>
              <span className="text-gray-400 text-base mr-4 mt-1">Fall 2023 – Spring 2024</span>
            </div>
            <div className="text-gray-300 text-base mb-3">Python</div>
            <ul className="list-disc pl-5 space-y-2 text-base mr-4">
              <li>Collaborated with a team to develop an essential communication tool within our Discord SHPE community, which serves as a hub for real-time announcements, event reminders, and member engagement.</li>
              <li>Asana is utilized to streamline project management, the Discord API is implemented for seamless integration, APScheduler is used to send out automated announcements, the bot's functionality is thoroughly documented, and pytests are employed for rigorous unit testing to ensure robust performance and reliability.</li>
            </ul>
            <div className="border-b border-gray-700 mt-6 mr-4"></div>
          </div>
  
          {/* Perfect Pigment */}
          <div className="project-item">
            <div className="flex justify-between items-center mb-2">
              <a 
                href="https://play.unity.com/en/games/59451da3-2747-4ded-8781-8c3feae2d0bd/perfect-pigment" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center group"
              >
                <span>Perfect Pigment</span>
                <svg 
                  className="mt-1 w-7 h-7 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200 self-center" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <span className="text-gray-400 text-base mr-4 mt-1">Summer 2023</span>
            </div>
            <div className="text-gray-300 text-base mb-3">C#</div>
            <ul className="list-disc pl-5 space-y-2 text-base mr-4">
              <li>Developed a 3D platformer first-person shooter with two other colleagues in which you must traverse multiple levels while being timed, using the Unity Engine and C#.</li>
              <li>Modeled custom assets, created custom textures, designed UI, programmed movement, scoreboards, weapon animations, enemies, and creating particle effects.</li>
            </ul>
          </div>
        </div>
      ),
      Contact: (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-4"> 
          {/* Header */}
          <h2 className="text-2xl font-bold text-blue-400 mb-3">Get in Touch</h2>
          
          {/* Contact Details Container */}
          <div className="w-full max-w-lg bg-gray-900/50 rounded-lg p-4 shadow-lg mb-4">
            {/* Contact Grid */}
            <div className="grid grid-cols-1 gap-2">
              {/* Email */}
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">Email</span>
                  <span className="text-sm text-gray-200">josecastro3249@gmail.com</span>
                </div>
              </div>
      
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/josecastro01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded-lg transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">LinkedIn</span>
                  <span className="text-sm text-gray-200 group-hover:text-blue-400 transition-colors">linkedin.com/in/josecastro01</span>
                </div>
              </a>
      
              {/* GitHub */}
              <a
                href="https://github.com/josecast1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded-lg transition-colors group"
              >
                <Github className="w-5 h-5 text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">GitHub</span>
                  <span className="text-sm text-gray-200 group-hover:text-blue-400 transition-colors">github.com/josecast1</span>
                </div>
              </a>
      
              {/* Phone */}
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400">Phone</span>
                  <span className="text-sm text-gray-200">(305)-728-9492</span>
                </div>
              </div>
            </div>
          </div>
      
          {/* CTA Button */}
          <a
            href="mailto:josecastro3249@gmail.com"
            className="bg-blue-500 text-white text-base font-semibold px-6 py-2 rounded-lg shadow-lg 
                       hover:bg-blue-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200
                       flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Send Me a Message</span>
          </a>
        </div>
      ),
    };
  
    return (
      // Placement of info panel
      <div
        className={`fixed top-1/2 z-50 pointer-events-none ${
          isClosing ? "animate-scale-out" : "animate-scale-in"
        }`}
        style={{ 
          right: "10vw",
          width: "40rem",
          transform: `translateY(-50%) scale(var(--viewport-scale))`,
          transformOrigin: 'right center'
        }}
      >
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 sm:p-8 rounded-xl shadow-2xl pointer-events-auto relative">
          {/* X close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
  
          {/* Tabs */}
          <div className="flex justify-around border-b border-gray-700 pb-4 mb-6 overflow-x-auto">
            {Object.keys(content).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Content with dynamic height */}
          <div 
            className="overflow-y-auto custom-scrollbar transition-[height] duration-300 ease-in-out"
            style={{ height: `${contentHeight}px`, maxHeight: "calc(90vh - 12rem)" }}
          >
            <div ref={contentRef}>
              {content[activeTab]}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default InfoPanel;