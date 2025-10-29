import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera as CameraIcon, X, Scan, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        toast({
          title: "Camera started",
          description: "Point your camera at objects to detect them",
        });
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetectedObjects([]);
    }
  };

  const detectObjects = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsDetecting(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      try {
        console.log("Sending image for detection...");
        
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData }
        });

        if (error) {
          console.error("Error detecting objects:", error);
          toast({
            title: "Detection failed",
            description: error.message || "Failed to detect objects. Please try again.",
            variant: "destructive",
          });
          setIsDetecting(false);
          return;
        }

        const detectedObjects = data.objects || [];
        console.log("Detected objects:", detectedObjects);
        
        setDetectedObjects(detectedObjects);
        
        // Speak the detected objects
        if (detectedObjects.length > 0) {
          const speech = new SpeechSynthesisUtterance(
            `I can see: ${detectedObjects.join(", ")}`
          );
          window.speechSynthesis.speak(speech);
          
          toast({
            title: "Objects detected",
            description: detectedObjects.join(", "),
          });
        } else {
          toast({
            title: "No objects detected",
            description: "Try pointing the camera at different objects",
          });
        }
        
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An error occurred during detection",
          variant: "destructive",
        });
      }
      
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5B21B6] via-[#A855F7] to-[#F9A8D4] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-white/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="border-2 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <CameraIcon className="w-8 h-8 text-primary" />
              AI Object Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Feed */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center text-white">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera not active</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              {!isStreaming ? (
                <Button
                  size="lg"
                  onClick={startCamera}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <CameraIcon className="mr-2 h-5 w-5" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={detectObjects}
                    disabled={isDetecting}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {isDetecting ? "Detecting..." : "Detect Objects"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={stopCamera}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Stop Camera
                  </Button>
                </>
              )}
            </div>

            {/* Detected Objects */}
            {detectedObjects.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Detected Objects:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {detectedObjects.map((object, index) => (
                    <Badge
                      key={index}
                      className="text-base py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      {object}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">How to use:</strong> Grant camera access,
                point your camera at objects, and click "Detect Objects" to identify them.
                The AI will analyze the image and speak the detected objects aloud.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Camera;
