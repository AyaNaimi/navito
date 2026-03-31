import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Languages, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function OCRTranslator() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = () => {
    // Mock OCR and translation
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedText('مرحبا بكم في المغرب\nأهلا وسهلا');
      setTranslation('Welcome to Morocco\nHello and welcome');
      setIsProcessing(false);
      toast.success('Text extracted and translated!');
    }, 2000);
  };

  return (
    <div className="size-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OCR Translator</h1>
            <p className="text-sm text-gray-600">Scan and translate text instantly</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">How It Works</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take a photo of any sign or menu</li>
                <li>• AI extracts the text automatically</li>
                <li>• Instant translation to your language</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Camera/Upload Section */}
        {!image ? (
          <div className="space-y-4">
            <Button
              onClick={handleImageCapture}
              className="w-full h-32 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex flex-col gap-3"
            >
              <Camera className="h-12 w-12" />
              <span className="text-lg font-semibold">Take Photo</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col gap-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-600">Upload Image</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Captured Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-20 w-20 text-gray-300" />
              </div>
            </div>

            {/* Results */}
            {isProcessing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Processing image...</p>
              </div>
            ) : (
              <>
                {/* Extracted Text */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="h-5 w-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900">Extracted Text (Arabic)</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-900 leading-relaxed" dir="rtl">{extractedText}</p>
                  </div>
                </div>

                {/* Translation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Translation (English)</h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-gray-900 leading-relaxed">{translation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setImage(null);
                      setExtractedText('');
                      setTranslation('');
                    }}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    Scan Another
                  </Button>
                  <Button
                    onClick={() => toast.success('Copied to clipboard!')}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    Copy Translation
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Supported Languages */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Supported Languages</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Arabic', 'French', 'English', 'Spanish', 'Darija', 'Amazigh'].map((lang) => (
              <div key={lang} className="bg-gray-50 px-4 py-2 rounded-lg text-center text-sm text-gray-700">
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
