import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera as CameraIcon, X, Scan, ArrowLeft, Mic, MicOff, Eye, FileText, Waves } from "lucide-react";
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
    
    // Reduce resolution for faster processing (max 640px width)
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.6);
      
      try {
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData }
        });

        if (error) {
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
        
        setDetectedObjects(detectedObjects);
        setPersonCount(personCount);
        
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
    
    // Reduce resolution for faster processing (max 640px width)
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.6);
      
      try {
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData, mode: 'text' }
        });

        if (error) {
          toast({
            title: "Text detection failed",
            description: error.message || "Failed to detect text. Please try again.",
            variant: "destructive",
          });
          setIsReadingText(false);
          return;
        }

        const detectedText = data.text || '';
        setDetectedText(detectedText);
        
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
    
    // Reduce resolution for faster processing (max 640px width)
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.6);
      
      try {
        const { data, error } = await supabase.functions.invoke('detect-objects', {
          body: { image: imageData, mode: 'scene' }
        });

        if (error) {
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
        
        setSceneDescription(description);
        setSceneConfidence(confidence);
        
        const speech = new SpeechSynthesisUtterance(description);
        window.speechSynthesis.speak(speech);
        
        toast({
          title: "Scene described",
          description: description.substring(0, 100) + (description.length > 100 ? "..." : ""),
        });
        
      } catch (error) {
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

      if (transcript.includes("detect") && transcript.includes("object")) {
        toast({ title: "Command recognized", description: "Detecting objects..." });
        detectObjects();
      } else if (transcript.includes("read") && transcript.includes("text")) {
        toast({ title: "Command recognized", description: "Reading text..." });
        readText();
      } else if (transcript.includes("describe") && transcript.includes("scene")) {
        toast({ title: "Command recognized", description: "Describing scene..." });
        describeScene();
      } else if (
        (transcript.includes("stop") || transcript.includes("deactivate") || transcript.includes("disable")) && 
        (transcript.includes("voice") || transcript.includes("listening") || transcript.includes("command"))
      ) {
        toast({ title: "Command recognized", description: "Deactivating voice commands..." });
        stopVoiceRecognition();
      } else if (
        (transcript.includes("start") || transcript.includes("activate") || transcript.includes("enable")) && 
        (transcript.includes("voice") || transcript.includes("command"))
      ) {
        // Already listening, just confirm
        const speech = new SpeechSynthesisUtterance("Voice commands are already active");
        window.speechSynthesis.speak(speech);
        toast({ title: "Already active", description: "Voice commands are already listening" });
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      toast({
        title: "Recognition error",
        description: event.error,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
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
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-border hover:border-primary hover:bg-primary/5 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="glass-card border-0 shadow-large overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-card-foreground">
              <div className="p-2 rounded-xl bg-gradient-primary shadow-glow-blue">
                <CameraIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              AI Object Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Video Feed */}
            <div className="relative bg-card-foreground/5 rounded-2xl overflow-hidden aspect-video border border-border/50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-background-alt">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <CameraIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">Camera not active</p>
                    <p className="text-sm text-muted-foreground mt-1">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}

              {/* Listening indicator */}
              {isListening && (
                <div className="absolute top-4 right-4 flex items-center gap-2 glass px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-card-foreground">Listening...</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!isStreaming ? (
                <Button
                  size="lg"
                  onClick={startCamera}
                  className="bg-gradient-primary hover:shadow-glow-blue transition-all duration-300 rounded-xl px-8"
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
                    className="bg-gradient-primary hover:shadow-glow-blue transition-all duration-300 rounded-xl"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    {isDetecting ? "Detecting..." : "Detect Objects"}
                  </Button>
                  <Button
                    size="lg"
                    onClick={readText}
                    disabled={isDetecting || isReadingText || isDescribingScene}
                    className="bg-secondary hover:bg-secondary-hover hover:shadow-glow-cyan transition-all duration-300 rounded-xl"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    {isReadingText ? "Reading..." : "Read Text"}
                  </Button>
                  <Button
                    size="lg"
                    onClick={describeScene}
                    disabled={isDetecting || isReadingText || isDescribingScene}
                    className="bg-tertiary hover:opacity-90 hover:shadow-glow-purple transition-all duration-300 rounded-xl"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {isDescribingScene ? "Describing..." : "Describe Scene"}
                  </Button>
                  
                  {/* Voice Button - Circular with glow */}
                  {!isListening ? (
                    <Button
                      size="lg"
                      onClick={startVoiceRecognition}
                      className="bg-gradient-voice hover:shadow-glow-cyan transition-all duration-300 rounded-xl"
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Voice Commands
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={stopVoiceRecognition}
                      className="bg-destructive hover:bg-destructive/90 transition-all duration-300 rounded-xl animate-voice-pulse"
                    >
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Listening
                    </Button>
                  )}
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={stopCamera}
                    className="border-border hover:border-destructive hover:text-destructive rounded-xl"
                  >
                    <X className="mr-2 h-5 w-5" />
                    Stop Camera
                  </Button>
                </>
              )}
            </div>

            {/* Results Section */}
            {detectedObjects.length > 0 && (
              <div className="glass-card rounded-2xl p-5 space-y-3 border-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Detected Objects
                  </h3>
                  {personCount > 0 && (
                    <Badge className="bg-primary/10 text-primary border-0 text-sm py-1 px-3">
                      {personCount} {personCount === 1 ? 'person' : 'people'}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {detectedObjects.map((obj, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/10 text-secondary border-0 py-1.5 px-3 text-sm">
                      {obj}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {detectedText && (
              <div className="glass-card rounded-2xl p-5 space-y-3 border-0">
                <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Detected Text
                </h3>
                <p className="text-muted-foreground leading-relaxed bg-background-alt p-4 rounded-xl">
                  {detectedText}
                </p>
              </div>
            )}

            {sceneDescription && (
              <div className="glass-card rounded-2xl p-5 space-y-3 border-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                    <Waves className="w-5 h-5 text-tertiary" />
                    Scene Description
                  </h3>
                  {sceneConfidence > 0 && (
                    <Badge className="bg-tertiary/10 text-tertiary border-0 text-sm py-1 px-3">
                      {Math.round(sceneConfidence * 100)}% confidence
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed bg-background-alt p-4 rounded-xl">
                  {sceneDescription}
                </p>
              </div>
            )}

            {/* Voice Commands Help */}
            {isStreaming && (
              <div className="text-center p-4 bg-info-light rounded-xl border border-info/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-card-foreground">Voice Commands:</strong> Say "detect objects", "read text", or "describe scene"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Camera;
