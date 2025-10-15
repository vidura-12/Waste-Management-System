import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Recycle, Calendar, BarChart3, Leaf, Truck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModel from "../components/AuthModel";
import mainImg from '../images/hero.jpg';
import card1 from '../images/card1.png';
import card2 from '../images/card2.png';
import card3 from '../images/card3.png';
import cardbg1 from '../images/cardbg1.png';
import cardbg2 from '../images/cardbg2.png';
import cardbg3 from '../images/cardbg3.png';

const Home = () => {
    const token = localStorage.getItem('token');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [imageLoaded, setImageLoaded] = useState({});
    const sectionRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const handleImageLoad = (imageId) => {
        setImageLoaded(prev => ({ ...prev, [imageId]: true }));
    };

    const handleNavigation = (path) => {
        if (!token) {
            setIsModalOpen(true);
        } else {
            navigate(path);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const features = [
        {
            icon: <Recycle className="w-12 h-12" />,
            title: "Smart Recycling",
            description: "AI-powered waste classification helps you recycle correctly every time. Our system automatically identifies waste types and guides you to the right bin.",
            image: card1,
            color: "from-emerald-500 to-teal-600",
            id: "smart-recycling"
        },
        {
            icon: <Calendar className="w-12 h-12" />,
            title: "Flexible Scheduling",
            description: "Schedule pickups at your convenience with our intelligent routing system. Choose one-time or recurring collections that fit your lifestyle.",
            image: card2,
            color: "from-blue-500 to-cyan-600",
            id: "flexible-scheduling"
        },
        {
            icon: <BarChart3 className="w-12 h-12" />,
            title: "Real-Time Analytics",
            description: "Track your environmental impact with detailed insights. Monitor waste reduction, recycling rates, and earn rewards for sustainable practices.",
            image: card3,
            color: "from-violet-500 to-purple-600",
            id: "real-time-analytics"
        },
        {
            icon: <Truck className="w-12 h-12" />,
            title: "Live Tracking",
            description: "Know exactly when your waste will be collected. Get real-time updates and notifications as our trucks approach your location.",
            image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
            color: "from-orange-500 to-red-600",
            id: "live-tracking"
        }
    ];

    const stats = [
        { number: "50K+", label: "Active Users" },
        { number: "2M+", label: "Collections Completed" },
        { number: "85%", label: "Waste Recycled" },
        { number: "24/7", label: "Customer Support" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center px-6 lg:px-20 py-20">
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-60"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                />
                
                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                            <Leaf className="w-4 h-4" />
                            Eco-Friendly Waste Management
                        </div>
                        
                        <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 leading-tight">
                            Green Bin
                        </h1>
                        
                        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                            Welcome to the Waste Management System! Here, you can effortlessly schedule waste collection, manage your requests,
                            and choose the appropriate disposal methods for your waste.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleNavigation('/wasteSchedule')}
                                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Get Started
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-green-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-600">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{stat.number}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative lg:h-[700px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl rotate-6 opacity-20" />
                        <div className="relative rounded-3xl shadow-2xl overflow-hidden w-full h-full">
                            <img 
                                src={mainImg} 
                                alt="Waste Management" 
                                className={`w-full h-full object-cover transform transition-all duration-1000 ${
                                    imageLoaded['hero'] 
                                        ? 'scale-100 opacity-100 blur-0' 
                                        : 'scale-110 opacity-0 blur-sm'
                                } hover:scale-105 transition-transform duration-500`}
                                onLoad={() => handleImageLoad('hero')}
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <Recycle className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">98%</div>
                                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section with Enhanced Scroll Animations */}
            <div className="py-32 px-6 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Why Choose Green Bin?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the future of waste management with cutting-edge technology and sustainable practices
                        </p>
                    </div>

                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={(el) => (sectionRefs.current[index] = el)}
                            data-section={`feature-${index}`}
                            className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32 transition-all duration-1000 ${
                                visibleSections.has(`feature-${index}`)
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-20'
                            } ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                        >
                            <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <button className="text-green-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all group">
                                    Learn More
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl rotate-3 opacity-20 transition-all duration-1000 ${
                                    visibleSections.has(`feature-${index}`) ? 'scale-100 opacity-20' : 'scale-90 opacity-0'
                                }`} />
                                <div className="relative rounded-3xl shadow-2xl overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className={`w-full h-[400px] object-cover transform transition-all duration-1000 ${
                                            visibleSections.has(`feature-${index}`) && imageLoaded[feature.id]
                                                ? 'scale-100 opacity-100 blur-0 translate-x-0'
                                                : index % 2 === 0 
                                                    ? 'scale-110 opacity-0 blur-sm translate-x-10'
                                                    : 'scale-110 opacity-0 blur-sm -translate-x-10'
                                        } hover:scale-105 transition-transform duration-500`}
                                        onLoad={() => handleImageLoad(feature.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Cards Section with Enhanced Animations */}
            <div className="py-32 px-6 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need for efficient waste management
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Schedule Collection",
                                description: "Set up automated or on-demand waste pickups tailored to your needs",
                                image: card1,
                                background: cardbg1,
                                path: '/wasteSchedule',
                                gradient: "from-green-500 to-emerald-600",
                                id: "schedule-collection"
                            },
                            {
                                title: "All Schedules",
                                description: "Manage and track all your collection schedules in one place",
                                image: card2,
                                background: cardbg2,
                                path: '/allSchedules',
                                gradient: "from-blue-500 to-cyan-600",
                                id: "all-schedules"
                            },
                            {
                                title: "Waste Levels",
                                description: "Monitor bin capacity and get alerts before they're full",
                                image: card3,
                                background: cardbg3,
                                path: '/wasteLevels',
                                gradient: "from-purple-500 to-pink-600",
                                id: "waste-levels"
                            }
                        ].map((service, index) => (
                            <div
                                key={index}
                                onClick={() => handleNavigation(service.path)}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${service.background})` }}
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-70 transition-all duration-500`} />
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className={`relative w-full h-full object-cover transition-all duration-700 ${
                                            imageLoaded[service.id]
                                                ? 'scale-100 blur-0'
                                                : 'scale-110 blur-sm'
                                        } group-hover:scale-110`}
                                        onLoad={() => handleImageLoad(service.id)}
                                    />
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all duration-300">
                                        Explore
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-32 px-6 lg:px-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Bell className="w-16 h-16 text-white mx-auto mb-8 animate-bounce" />
                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-white/90 mb-12">
                        Join thousands of users who are transforming waste management into environmental action
                    </p>
                    <button
                        onClick={() => handleNavigation('/wasteSchedule')}
                        className="bg-white text-green-600 px-12 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Start Your Journey Today
                    </button>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModel isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Home;