import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { UPLOAD_CONFIG, isVideoFile, validateFile } from '@/shared/config/upload.config';

interface UploadBackgroundStepProps {
  onNext: (customImage: string) => void;
  onBack: () => void;
}

export function UploadBackgroundStep({
  onNext,
  onBack
}: UploadBackgroundStepProps) {
  const [uploadedMedia, setUploadedMedia] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = uploadedFile ? isVideoFile(uploadedFile) : false;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using centralized config
    const validation = validateFile(file, 'media');
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedMedia(reader.result as string);
      setUploadedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (uploadedMedia) {
      onNext(uploadedMedia);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-4 p-2 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-[#222526] mb-2">
            Upload your background
          </h2>
          <p className="text-sm text-[#69737c] max-w-md">
            This media will appear behind your certificate content and define its visual style.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upload Area */}
        <Card className="border border-[#e1e1e1] rounded-[16px]">
          <CardContent className="p-3">
            <div
              className={`bg-[rgba(205,223,236,0.15)] border-2 border-dashed border-[#e1e1e1] rounded-[4px] p-3 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all hover:bg-[rgba(205,223,236,0.25)]`}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={UPLOAD_CONFIG.media.acceptString}
                onChange={handleMediaUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#222526]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>

                <p className="text-base font-medium text-[#69737c] mb-2">
                  <span className="text-[#615bff] font-medium">Upload</span> your background image or video
                </p>

                <p className="text-sm text-[#69737c] mb-4">Recommended format: 1350x950px</p>

                <div className="text-xs text-[#69737c] text-center space-y-1">
                  <p className="font-semibold">{UPLOAD_CONFIG.media.formatLabel}</p>
                  <p className="font-semibold">Images: max {UPLOAD_CONFIG.image.maxSizeMB}MB | Videos: max {UPLOAD_CONFIG.video.maxSizeMB}MB</p>
                  <p className="font-normal">Note: We recommend you to not have any text on the background.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <Card className="border border-[#e1e1e1] rounded-[16px]">
          <CardContent className="p-3">
            <div className="mb-2">
              <h3 className="text-lg font-medium text-[#222526]">Preview</h3>
            </div>

            <div className="bg-[#232526] rounded-[8px] p-5 flex items-center justify-center min-h-[300px]">
              <div
                className="border border-[#69737c] border-dashed flex gap-[10px] items-center px-[49px] py-[74px] relative rounded-[16px] w-[235px] h-[345px] overflow-hidden"
              >
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                  <div className="absolute bg-[rgba(255,255,255,0.04)] inset-0 rounded-[16px]" />
                  {uploadedMedia && (
                    <div className="absolute inset-0 overflow-hidden rounded-[16px]">
                      {isVideo ? (
                        <video
                          src={uploadedMedia}
                          className="absolute h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <img
                          alt=""
                          className="absolute h-full w-full object-cover"
                          src={uploadedMedia}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-[rgba(2,2,2,0.2)] rounded-[8px] p-4 w-[137px] h-[197px] flex flex-col items-center justify-center z-10">
                  {/* Certificate Preview Content */}
                  <div className="text-white text-center space-y-2">
                    <div className="w-4 h-4 bg-white rounded-full mb-2"></div>
                    <div className="text-xs space-y-1">
                      <p className="uppercase tracking-wider text-[2.8px]">Footballer</p>
                      <p className="text-[10px]">César Azpilicueta</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="uppercase tracking-wider text-[2.8px]">ID number</p>
                      <p className="text-[4.8px]">66a104f4f8a24534ecaf0634</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="uppercase tracking-wider text-[2.8px]">Certified by</p>
                      <p className="text-[4.8px]">UEFA</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="uppercase tracking-wider text-[2.8px]">Date of certification</p>
                      <p className="text-[4.8px]">March 2024</p>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="uppercase tracking-wider text-[2.8px]">Player name</p>
                      <p className="text-[4.8px]">EDERSON GOALKEEPERS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={!uploadedMedia}
          className="bg-[#222526] hover:bg-[#333333] text-white px-10 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
