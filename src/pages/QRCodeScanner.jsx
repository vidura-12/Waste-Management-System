import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = (result, error) => {
        if (result) {
            setScanResult(result);
            console.log('Scanned data:', result);
            setIsScanning(false);
        }
        if (error) {
            console.error(error);
        }
    };

    const toggleScanner = () => {
        setIsScanning(!isScanning);
        if (isScanning) {
            setScanResult(null);
        }
    };

    return (
        <div className="p-4">
            <button 
                onClick={toggleScanner}
                className='bg-green-600 hover:bg-green-700 text-white p-3 px-6 rounded-full font-medium transition-colors duration-200'
            >
                {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
            </button>
            
            {isScanning && (
                <div className="mt-4">
                    <QrReader
                        onResult={handleScan}
                        constraints={{ 
                            facingMode: "environment" 
                        }}
                        style={{ 
                            width: '100%', 
                            maxWidth: '400px',
                            borderRadius: '12px'
                        }}
                        scanDelay={300}
                    />
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Point back camera at QR code
                    </p>
                </div>
            )}
            
            {scanResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-green-800 mb-2">Scan Result:</h2>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-700 break-words">
                            {scanResult.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeScanner;