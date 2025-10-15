import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { HiOutlineQrCode } from "react-icons/hi2";

import CryptoJS from 'crypto-js';

const QRModal = ({ onClose }) => {
    const cusID = localStorage.getItem('cusID');

    const encryptedCusID = CryptoJS.AES.encrypt(cusID, 'your-secret-key').toString();
    const encodedCusID = encodeURIComponent(encryptedCusID);
    
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-code');
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'qr-code.png';
        link.click();
    };

    const qrLink = `https://green-bin.vercel.app/qrDetails/${encodedCusID}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80" />
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Floating Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-200 rounded-full blur-2xl opacity-30 animate-pulse delay-1000" />
            
            {/* Main Modal */}
            <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-white/20 transform animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                            <HiOutlineQrCode className="w-6 h-6 text-white" />

                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Your QR Code</h2>
                                <p className="text-sm text-gray-600 mt-1">Scan to access your waste management profile</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-2xl transition-all duration-200 group"
                        >
                            <HiOutlineQrCode  className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* QR Code Container */}
                <div className="p-6 pt-4">
                    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 shadow-inner">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-20 h-20 bg-green-200/30 rounded-full -translate-x-10 -translate-y-10 blur-xl" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-emerald-200/30 rounded-full translate-x-10 translate-y-10 blur-xl" />
                        
                        {/* QR Code */}
                        <div className="relative bg-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <QRCodeCanvas 
                                id="qr-code" 
                                value={qrLink} 
                                size={256}
                                bgColor="#ffffff"
                                fgColor="#059669"
                                level="H"
                                includeMargin={false}
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 border border-gray-100">
                            This QR code contains your unique customer ID for quick access to your waste management services.
                        </p>
                    </div>
                </div>

                {/* Download Button */}
                <div className="p-6 pt-2">
                    <button 
                        onClick={downloadQRCode}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                    >
                        <HiOutlineQrCode  className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Download QR Code
                    </button>
                </div>

                {/* Footer Note */}
                <div className="px-6 pb-6">
                    <p className="text-xs text-gray-500 text-center">
                        Keep this QR code secure. It provides access to your personal waste management data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRModal;