import { useState } from 'react';
import { QrCode, Download, Printer, Copy, Check } from 'lucide-react';

const QRCode = () => {
  const shopId = localStorage.getItem('shopId') || '69974a06fefa11f4f525a43f';
  const qrUrl = `http://localhost:5173/shop/${shopId}`;
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // In production, this would generate and download actual QR code
    alert('QR Code download functionality will be implemented with a QR code library');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideDown">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">QR Code</h1>
            <p className="text-muted-foreground">Share your digital menu with customers</p>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="bg-card border border-border rounded-lg p-8 text-center animate-slideUp hover:shadow-lg transition-shadow duration-300">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-6">Your Shop QR Code</h2>
          
          {/* QR Code Placeholder */}
          <div className="bg-white p-8 rounded-lg shadow-lg inline-block mb-6">
            <div className="w-64 h-64 bg-linear-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* QR Code Pattern Simulation */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4">
                {[...Array(64)].map((_, i) => (
                  <div>
                    <div className="text-green-600 relative z-10">
                      <QrCode className="w-16 h-16" />
                    </div>
                  </div>
                ))}              </div>
              <QrCode className="w-16 h-16 text-green-600 relative z-10" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Scan this QR code to view your shop's menu
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleDownloadQR}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download QR Code
            </button>
            <button
              onClick={handleDownloadQR}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Share URL */}
      <div className="bg-card border border-border rounded-lg p-6 animate-slideUp">
        <h3 className="text-lg font-bold text-foreground mb-4">Share Your Menu URL</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={qrUrl}
            readOnly
            className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg text-muted-foreground"
          />
          <button
            onClick={handleCopyUrl}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-foreground mb-2">1. Download</h3>
          <p className="text-sm text-muted-foreground">
            Download your QR code as an image file (PNG or SVG format)
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <Printer className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-bold text-foreground mb-2">2. Print</h3>
          <p className="text-sm text-muted-foreground">
            Print the QR code on table tents, posters, or business cards
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <Copy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-foreground mb-2">3. Share</h3>
          <p className="text-sm text-muted-foreground">
            Share your menu URL on social media or your website
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="font-bold text-foreground mb-2">💡 QR Code Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Place QR codes where customers can easily see and scan them</li>
          <li>• Ensure adequate lighting and contrast for reliable scanning</li>
          <li>• Test your QR code with different devices before printing</li>
          <li>• Keep the QR code size at least 2x2 inches for easy scanning</li>
          <li>• Add a call-to-action like "Scan to view our menu"</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCode;
