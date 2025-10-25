import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = data => {
        if (data) {
            setScanResult(data);
            console.log('Scanned data:', data);
            // Optional: Auto-stop scanning after successful scan
            setIsScanning(false);
        }
    };

    const handleError = err => {
        console.error(err);
    };

    const toggleScanner = () => {
        setIsScanning(!isScanning);
        if (isScanning) {
            setScanResult(null); // Clear previous results when starting new scan
        }
    };

    // Camera constraints to prefer back camera
    const constraints = {
        facingMode: { exact: "environment" } // This forces back camera
    };

    // Alternative approach using deviceId if facingMode doesn't work
    const getCameraConstraints = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            // Prefer back camera - usually the last one in the list on mobile devices
            const backCamera = videoDevices.find(device => 
                device.label.toLowerCase().includes('back') || 
                device.label.toLowerCase().includes('rear')
            ) || videoDevices[videoDevices.length - 1]; // Fallback to last camera

            if (backCamera) {
                return {
                    deviceId: { exact: backCamera.deviceId }
                };
            }
        } catch (error) {
            console.error('Error getting camera devices:', error);
        }
        
        // Fallback to environment facing mode
        return {
            facingMode: { exact: "environment" }
        };
    };

    const [cameraConstraints, setCameraConstraints] = useState(constraints);

    // Initialize camera constraints when component mounts
    React.useEffect(() => {
        const initializeCamera = async () => {
            const constraints = await getCameraConstraints();
            setCameraConstraints(constraints);
        };
        initializeCamera();
    }, []);

    return (
        <div className="p-4">
            <button 
                onClick={toggleScanner}
                className='bg-green-600 hover:bg-green-700 text-white p-3 px-6 rounded-full font-medium transition-colors duration-200'
            >
                {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
            </button>
            
            {isScanning && (
                <div className="mt-4 relative">
                    <QrScanner
                        onError={handleError}
                        onScan={handleScan}
                        constraints={cameraConstraints}
                        style={{ 
                            width: '100%', 
                            maxWidth: '400px',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                        delay={300}
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-green-500 rounded-lg pointer-events-none"></div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Point camera at QR code to scan
                    </p>
                </div>
            )}
            
            {scanResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-green-800 mb-2">Scan Successful!</h2>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-700 break-words">
                            {scanResult.text || 'No text content found'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setScanResult(null)}
                        className="mt-3 text-sm text-green-600 hover:text-green-800"
                    >
                        Clear Result
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRCodeScanner;