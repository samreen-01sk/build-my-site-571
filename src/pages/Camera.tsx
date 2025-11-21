import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera as CameraIcon, X, Scan, ArrowLeft, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [personCount, setPersonCount] = useState<number>(0);
  const [detectedText, setDetectedText] = useState<string>("");
  const [sceneDescription, setSceneDescription] = useState<string>("");
  const [sceneConfidence, setSceneConfidence] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isReadingText, setIsReadingText] = useState(false);
  const [isDescribingScene, setIsDescribingScene] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      setPersonCount(0);
      setDetectedText("");
      setSceneDescription("");
      setSceneConfidence(0);
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
        const personCount = data.personCount || 0;
        console.log("Detected objects:", detectedObjects);
        console.log("Person count:", personCount);
        
        setDetectedObjects(detectedObjects);
        setPersonCount(personCount);
        
        // Speak the detected objects and person count
        if (detectedObjects.length > 0) {
          let spokenText = "";
          if (personCount > 0) {
            spokenText = `I can see ${personCount} ${personCount === 1 ? 'person' : 'people'}. `;
          }
          spokenText += `Objects detected: ${detectedObjects.join(", ")}`;
          
          const speech = new SpeechSynthesisUtterance(spokenText);
          window.speechSynthesis.speak(speech);
          
          toast({
            title: "Objects detected",
            description: personCount > 0 
              ? `${personCount} ${personCount === 1 ? 'person' : 'people'}, ${detectedObjects.join(", ")}`
              : detectedObjects.join(", "),
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

  const readText = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsReadingText(true);
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
        console.log("Sending image for text detection...");
        
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData, mode: 'text' }
        });

        if (error) {
          console.error("Error detecting text:", error);
          toast({
            title: "Text detection failed",
            description: error.message || "Failed to detect text. Please try again.",
            variant: "destructive",
          });
          setIsReadingText(false);
          return;
        }

        const detectedText = data.text || '';
        console.log("Detected text:", detectedText);
        
        setDetectedText(detectedText);
        
        // Speak the detected text
        if (detectedText.trim()) {
          const speech = new SpeechSynthesisUtterance(detectedText);
          window.speechSynthesis.speak(speech);
          
          toast({
            title: "Text detected",
            description: "Reading text aloud...",
          });
        } else {
          toast({
            title: "No text detected",
            description: "Try pointing the camera at text",
          });
        }
        
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An error occurred during text detection",
          variant: "destructive",
        });
      }
      
      setIsReadingText(false);
    }
  };

  const describeScene = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsDescribingScene(true);
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
        console.log("Sending image for scene description...");
        
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData, mode: 'scene' }
        });

        if (error) {
          console.error("Error describing scene:", error);
          toast({
            title: "Scene detection failed",
            description: error.message || "Failed to detect scene. Please try again.",
            variant: "destructive",
          });
          setIsDescribingScene(false);
          return;
        }

        const description = data.description || 'No description available';
        const confidence = data.confidence || 0;
        console.log("Scene description:", description, "Confidence:", confidence);
        
        setSceneDescription(description);
        setSceneConfidence(confidence);
        
        // Speak the detailed scene description
        const speech = new SpeechSynthesisUtterance(description);
        window.speechSynthesis.speak(speech);
        
        toast({
          title: "Scene described",
          description: description.substring(0, 100) + (description.length > 100 ? "..." : ""),
        });
        
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An error occurred during scene description",
          variant: "destructive",
        });
      }
      
      setIsDescribingScene(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Voice recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Say 'detect objects', 'read text', or 'describe scene'",
      });
      
      const speech = new SpeechSynthesisUtterance("Voice commands activated");
      window.speechSynthesis.speak(speech);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Voice command:", transcript);

      if (transcript.includes("detect") && transcript.includes("object")) {
        toast({
          title: "Command recognized",
          description: "Detecting objects...",
        });
        detectObjects();
      } else if (transcript.includes("read") && transcript.includes("text")) {
        toast({
          title: "Command recognized",
          description: "Reading text...",
        });
        readText();
      } else if (transcript.includes("describe") && transcript.includes("scene")) {
        toast({
          title: "Command recognized",
          description: "Describing scene...",
        });
        describeScene();
      } else if (transcript.includes("stop") && transcript.includes("listening")) {
        stopVoiceRecognition();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech') {
        return; // Ignore no-speech errors
      }
      toast({
        title: "Recognition error",
        description: event.error,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if still in listening mode
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      toast({
        title: "Stopped listening",
        description: "Voice commands deactivated",
      });
      
      const speech = new SpeechSynthesisUtterance("Voice commands deactivated");
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      stopVoiceRecognition();
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
                    disabled={isDetecting || isReadingText || isDescribingScene}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {isDetecting ? "Detecting..." : "Detect Objects"}
                  </Button>
                  <Button
                    size="lg"
                    onClick={readText}
                    disabled={isDetecting || isReadingText || isDescribingScene}
                    className="bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {isReadingText ? "Reading..." : "Read Text"}
                  </Button>
                  <Button
                    size="lg"
                    onClick={describeScene}
                    disabled={isDetecting || isReadingText || isDescribingScene}
                    className="bg-gradient-to-r from-primary via-secondary to-primary hover:opacity-90"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {isDescribingScene ? "Describing..." : "Describe Scene"}
                  </Button>
                  {!isListening ? (
                    <Button
                      size="lg"
                      onClick={startVoiceRecognition}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Voice Commands
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={stopVoiceRecognition}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 animate-pulse"
                    >
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Listening
                    </Button>
                  )}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Detected Objects:
                  </h3>
                  {personCount > 0 && (
                    <Badge variant="default" className="text-base py-2 px-4">
                      {personCount} {personCount === 1 ? 'person' : 'people'}
                    </Badge>
                  )}
                </div>
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

            {/* Detected Text */}
            {detectedText && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Detected Text:
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">{detectedText}</p>
                </div>
              </div>
            )}

            {/* Scene Description */}
            {sceneDescription && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Scene Description:
                </h3>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <p className="text-foreground whitespace-pre-wrap">
                    {sceneDescription}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Confidence:</span> {(sceneConfidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">How to use:</strong> Grant camera access,
                then point your camera at objects or text. Click "Voice Commands" and say:
                <br />• "detect objects" to identify objects
                <br />• "read text" to extract text
                <br />• "describe scene" for a detailed description
                <br />• "stop listening" to deactivate voice commands
                <br />All features provide audio and text output.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Camera;
