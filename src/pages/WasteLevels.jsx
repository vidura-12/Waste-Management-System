import React, { useEffect, useState } from 'react';
import { Download, TrendingUp, TrendingDown, Leaf, Recycle, Zap, AlertCircle } from 'lucide-react';

const WasteLevels = () => {
    const [wasteLevels, setWasteLevels] = useState({
        organic: 0,
        recyclable: 0,
        eWaste: 0,
    });
    const [loading, setLoading] = useState(true);
    const [previousLevels, setPreviousLevels] = useState({
        organic: 0,
        recyclable: 0,
        eWaste: 0,
    });

    // Mock customer ID - replace with your actual logic
    const cusID = 'customer123'; // localStorage.getItem('cusID');

    useEffect(() => {
        const fetchWasteLevels = async () => {
            try {
                // Simulating API call with mock data
                // Replace this with your actual API call:
                // const response = await axios.get(`https://garbage-management-system-server.vercel.app/customer/getWasteLevels/${cusID}`);
                
                setTimeout(() => {
                    const mockData = {
                        organic: 24.5,
                        recyclable: 18.3,
                        eWaste: 5.7,
                    };
                    setWasteLevels(mockData);
                    setPreviousLevels({
                        organic: 20.2,
                        recyclable: 22.1,
                        eWaste: 4.5,
                    });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching waste levels:', error);
                setLoading(false);
            }
        };

        fetchWasteLevels();
    }, [cusID]);

    const calculateChange = (current, previous) => {
        const change = ((current - previous) / previous) * 100;
        return {
            percentage: Math.abs(change).toFixed(1),
            isIncrease: change > 0
        };
    };

    const totalWaste = wasteLevels.organic + wasteLevels.recyclable + wasteLevels.eWaste;
    
    const wasteTypes = [
        {
            id: 'organic',
            name: 'Organic Waste',
            value: wasteLevels.organic,
            previous: previousLevels.organic,
            icon: <Leaf className="w-8 h-8" />,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            textColor: 'text-green-600',
            description: 'Food scraps, yard waste, and biodegradable materials',
            image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
        },
        {
            id: 'recyclable',
            name: 'Recyclable Waste',
            value: wasteLevels.recyclable,
            previous: previousLevels.recyclable,
            icon: <Recycle className="w-8 h-8" />,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600',
            description: 'Paper, plastic, glass, and metal containers',
            image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80'
        },
        {
            id: 'eWaste',
            name: 'E-Waste',
            value: wasteLevels.eWaste,
            previous: previousLevels.eWaste,
            icon: <Zap className="w-8 h-8" />,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            textColor: 'text-purple-600',
            description: 'Electronics, batteries, and electrical equipment',
            image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80'
        }
    ];

    const generatePDF = () => {
        // Create a new window for PDF
        const pdfWindow = window.open('', '_blank');
        const currentDate = new Date().toLocaleDateString();
        
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Waste Management Report</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 40px; 
                        color: #333;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 3px solid #10b981;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 { 
                        color: #059669; 
                        font-size: 32px;
                        margin: 0;
                    }
                    .header p { 
                        color: #6b7280; 
                        font-size: 16px;
                    }
                    .summary { 
                        background: #f9fafb; 
                        padding: 25px; 
                        border-radius: 12px;
                        margin-bottom: 30px;
                        border-left: 4px solid #10b981;
                    }
                    .stats-grid { 
                        display: grid; 
                        grid-template-columns: repeat(4, 1fr); 
                        gap: 15px; 
                        margin-bottom: 30px;
                    }
                    .stat-card { 
                        background: white; 
                        padding: 20px; 
                        border-radius: 8px; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        text-align: center;
                        border-top: 4px solid #10b981;
                    }
                    .waste-card { 
                        margin-bottom: 25px; 
                        padding: 20px; 
                        border-radius: 8px;
                        background: #f8fafc;
                        border-left: 4px solid;
                    }
                    .organic { border-left-color: #10b981; }
                    .recyclable { border-left-color: #3b82f6; }
                    .ewaste { border-left-color: #8b5cf6; }
                    .progress-bar { 
                        background: #e5e7eb; 
                        height: 8px; 
                        border-radius: 4px;
                        margin: 10px 0;
                        overflow: hidden;
                    }
                    .progress-fill { 
                        height: 100%; 
                        border-radius: 4px;
                    }
                    .impact-section { 
                        background: linear-gradient(135deg, #059669, #047857); 
                        color: white; 
                        padding: 30px; 
                        border-radius: 12px;
                        margin: 30px 0;
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 40px; 
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .trend-up { color: #dc2626; }
                    .trend-down { color: #16a34a; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Waste Management Report</h1>
                    <p>Generated on ${currentDate} | Customer ID: ${cusID}</p>
                </div>

                <div class="summary">
                    <h2>Executive Summary</h2>
                    <p>Total waste generated: <strong>${totalWaste.toFixed(1)} kg</strong></p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Waste</h3>
                        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${totalWaste.toFixed(1)} kg</div>
                    </div>
                    <div class="stat-card" style="border-top-color: #10b981;">
                        <h3>Organic</h3>
                        <div style="font-size: 24px; font-weight: bold; color: #059669;">${((wasteLevels.organic / totalWaste) * 100).toFixed(0)}%</div>
                        <div>${wasteLevels.organic} kg</div>
                    </div>
                    <div class="stat-card" style="border-top-color: #3b82f6;">
                        <h3>Recyclable</h3>
                        <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${((wasteLevels.recyclable / totalWaste) * 100).toFixed(0)}%</div>
                        <div>${wasteLevels.recyclable} kg</div>
                    </div>
                    <div class="stat-card" style="border-top-color: #8b5cf6;">
                        <h3>E-Waste</h3>
                        <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${((wasteLevels.eWaste / totalWaste) * 100).toFixed(0)}%</div>
                        <div>${wasteLevels.eWaste} kg</div>
                    </div>
                </div>

                <h2>Waste Breakdown</h2>
                ${wasteTypes.map(waste => {
                    const change = calculateChange(waste.value, waste.previous);
                    const progress = Math.min(100, (waste.value / 30) * 100);
                    return `
                        <div class="waste-card ${waste.id}">
                            <h3>${waste.name}</h3>
                            <p>${waste.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0;">
                                <div>
                                    <div style="font-size: 28px; font-weight: bold; color: ${waste.id === 'organic' ? '#059669' : waste.id === 'recyclable' ? '#3b82f6' : '#8b5cf6'};">
                                        ${waste.value} kg
                                    </div>
                                    <div style="color: ${change.isIncrease ? '#dc2626' : '#16a34a'};">
                                        ${change.isIncrease ? '↑' : '↓'} ${change.percentage}% from previous period
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                    <span>Progress to goal</span>
                                    <span>${progress.toFixed(0)}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%; background: ${waste.id === 'organic' ? '#10b981' : waste.id === 'recyclable' ? '#3b82f6' : '#8b5cf6'};"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}

                <div class="impact-section">
                    <h2 style="color: white; margin-top: 0;">Environmental Impact</h2>
                    <p>By properly segregating and recycling ${wasteLevels.recyclable.toFixed(1)}kg of waste, you've helped save approximately:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 24px; font-weight: bold;">${(totalWaste * 0.8).toFixed(0)} kg</div>
                            <div>CO₂ Emissions Saved</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                            <div style="font-size: 24px; font-weight: bold;">${(wasteLevels.recyclable * 1.2).toFixed(0)}</div>
                            <div>Trees Saved</div>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for contributing to a sustainable environment!</p>
                    <p>Generated by Waste Management System</p>
                </div>
            </body>
            </html>
        `;

        pdfWindow.document.write(pdfContent);
        pdfWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            pdfWindow.print();
        }, 250);
    };

    const handleDownloadReport = () => {
        console.log('Downloading waste report...', wasteLevels);
        generatePDF();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 text-lg">Loading your waste levels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Leaf className="w-4 h-4" />
                        Environmental Impact Dashboard
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                        My Waste Levels
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Track your waste generation and environmental impact in real-time
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="text-gray-600 text-sm font-medium mb-2">Total Waste</div>
                        <div className="text-4xl font-bold text-gray-900">{totalWaste.toFixed(1)}</div>
                        <div className="text-gray-500 text-sm mt-1">kilograms</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="text-green-100 text-sm font-medium mb-2">Organic</div>
                        <div className="text-4xl font-bold">{((wasteLevels.organic / totalWaste) * 100).toFixed(0)}%</div>
                        <div className="text-green-100 text-sm mt-1">of total waste</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="text-blue-100 text-sm font-medium mb-2">Recyclable</div>
                        <div className="text-4xl font-bold">{((wasteLevels.recyclable / totalWaste) * 100).toFixed(0)}%</div>
                        <div className="text-blue-100 text-sm mt-1">of total waste</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="text-purple-100 text-sm font-medium mb-2">E-Waste</div>
                        <div className="text-4xl font-bold">{((wasteLevels.eWaste / totalWaste) * 100).toFixed(0)}%</div>
                        <div className="text-purple-100 text-sm mt-1">of total waste</div>
                    </div>
                </div>
            </div>

            {/* Waste Cards Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {wasteTypes.map((waste, index) => {
                    const change = calculateChange(waste.value, waste.previous);
                    return (
                        <div
                            key={waste.id}
                            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={waste.image}
                                    alt={waste.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${waste.color} opacity-60`}></div>
                                <div className={`absolute top-4 right-4 ${waste.iconBg} p-3 rounded-xl shadow-lg`}>
                                    <div className={waste.textColor}>
                                        {waste.icon}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className={`${waste.bgColor} p-6`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {waste.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {waste.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Weight Display */}
                                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Current Level</div>
                                            <div className={`text-4xl font-bold ${waste.textColor}`}>
                                                {waste.value}
                                                <span className="text-xl ml-1">kg</span>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 ${change.isIncrease ? 'text-red-600' : 'text-green-600'} text-sm font-semibold`}>
                                            {change.isIncrease ? (
                                                <TrendingUp className="w-5 h-5" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5" />
                                            )}
                                            {change.percentage}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Progress to goal</span>
                                        <span>{Math.min(100, (waste.value / 30) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${waste.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${Math.min(100, (waste.value / 30) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Environmental Impact Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                                <AlertCircle className="w-4 h-4" />
                                Environmental Impact
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold">
                                Your Green Footprint
                            </h2>
                            <p className="text-lg text-white/90 leading-relaxed">
                                By properly segregating and recycling {wasteLevels.recyclable.toFixed(1)}kg of waste, you've helped save approximately 
                                <span className="font-bold text-2xl mx-2">{(wasteLevels.recyclable * 2.5).toFixed(0)}kg</span>
                                of CO₂ emissions this month.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                                    <div className="text-3xl font-bold">{(totalWaste * 0.8).toFixed(0)}kg</div>
                                    <div className="text-sm text-white/80">CO₂ Saved</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                                    <div className="text-3xl font-bold">{(wasteLevels.recyclable * 1.2).toFixed(0)}</div>
                                    <div className="text-sm text-white/80">Trees Saved</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80" 
                                alt="Environmental Impact" 
                                className="rounded-2xl shadow-2xl max-w-md w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Section */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                    <Download className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        Download Your Waste Report
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Get a detailed PDF report of your waste levels, recycling progress, and environmental impact metrics
                    </p>
                    <button
                        onClick={handleDownloadReport}
                        className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-3"
                    >
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        Download Waste Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WasteLevels;