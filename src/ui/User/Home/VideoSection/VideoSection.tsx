"use client";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const VideoSection = () => {
   const videoRef = useRef<HTMLVideoElement>(null);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   const [isDesktop, setIsDesktop] = useState(false);
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [showControls, setShowControls] = useState(true);

   const togglePlay = () => {
      if (!videoRef.current) return;

      if (videoRef.current.paused) {
         videoRef.current.play();
         setIsPlaying(true);
      } else {
         videoRef.current.pause();
         setIsPlaying(false);
      }
   };

   const handleTimeUpdate = () => {
      if (!videoRef.current) return;

      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
         setProgress((current / duration) * 100);
      }
   };

   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!videoRef.current) return;

      const value = Number(e.target.value);
      const duration = videoRef.current.duration;

      videoRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
   };

   const handleMouseMove = () => {
      if (!isDesktop) return; // mobile/tablet pe hide nahi hoga

      setShowControls(true);

      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
         setShowControls(false);
      }, 1000);
   };

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         video.removeEventListener("timeupdate", handleTimeUpdate);
      };
   }, []);

   useEffect(() => {
      const handleResize = () => {
         setIsDesktop(window.innerWidth >= 900);
      };

      handleResize(); // initial check
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return (
      <section className={`relative w-screen overflow-hidden ${!showControls ? "cursor-none" : "cursor-pointer"}`} onMouseMove={handleMouseMove} onClick={togglePlay}>
         <video ref={videoRef} src="/Dummy/Home/TestingVideo.mp4" className="w-screen object-cover h-[calc(100vh-100px)]" />

         <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 left-0 right-0 flex items-center gap-4 
bg-black/30 p-3 py-4 px-10 w-full
transition-all duration-300 ease-in-out
${!isDesktop ? "translate-y-0 opacity-100" : showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
         >
            <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="flex-1 h-1" />

            <button onClick={togglePlay} className="px-4 py-1 rounded-md">
               {isPlaying ? <Pause color="white" /> : <Play color="white" />}
            </button>
         </div>
      </section>
   );
};

export default VideoSection;
