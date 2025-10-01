import React, { useState, useEffect } from "react";
import { AnimatedSection, fadeInUp, slideInLeft } from "@workspace/ui/components/ui/animated-section";
import HERO_BG_HOME1 from "@/assets/hero/img1.jpg";
import HERO_BG_HOME2 from "@/assets/hero/img2.jpg";
import HERO_BG_HOME3 from "@/assets/hero/img3.jpg";
import HERO_BG_HOME4 from "@/assets/hero/img4.jpg";
import ConvexShape from "./ConvexShape";

interface HeroSectionProps {
    title: string | React.ReactNode;
    subtitle: string;
    heroImages?: string[];
    autoSwipeInterval?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    heroImages = [HERO_BG_HOME1, HERO_BG_HOME2, HERO_BG_HOME3, HERO_BG_HOME4],
    autoSwipeInterval = 5000,
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto swipe effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, autoSwipeInterval);

        return () => clearInterval(interval);
    }, [heroImages.length, autoSwipeInterval]);

    const goToSlide = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Background Images Gallery with Auto Swipe */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ zIndex: index === currentImageIndex ? 1 : 0 }}
                    >
                        <img
                            src={image}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt={`Hero background ${index + 1}`}
                            style={{
                                objectPosition: isMobile
                                    ? 'center center'
                                    : isTablet
                                        ? 'center top'
                                        : 'center center'
                            }}
                        />
                    </div>
                ))}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-primary/30 to-primary/20" style={{ zIndex: 2 }}></div>
            </div>

            {/* Gallery Indicators */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Content - Title & Subtitle positioned to the left */}
            <div className="relative z-10 w-full h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-42">
                <div className="w-full max-w-4xl">
                    {/* Title */}
                    <AnimatedSection
                        variants={slideInLeft}
                        triggerOnce={false}
                        className="mb-4 sm:mb-6"
                        threshold={0.1}
                    >
                        <h1 className="text-popover text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            {title}
                        </h1>
                    </AnimatedSection>

                    {/* Subtitle */}
                    <AnimatedSection
                        variants={fadeInUp}
                        triggerOnce={false}
                        className="mb-8"
                        delay={0.3}
                        threshold={0.1}
                    >
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-popover leading-relaxed max-w-2xl">
                            {subtitle}
                        </p>
                    </AnimatedSection>
                </div>
            </div>

            <ConvexShape />
        </div>
    );
};

export default HeroSection;