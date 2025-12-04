import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Camera, FileText, MessageSquare, Brain, Lightbulb, Users, Mic, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const modules = [
    {
      icon: Camera,
      title: "Camera Interface",
      description: "Real-time frame capture and processing with seamless integration across all detection modules."
    },
    {
      icon: Eye,
      title: "Object Detection",
      description: "Advanced AI-powered object recognition using TensorFlow Lite for real-time identification."
    },
    {
      icon: Brain,
      title: "Scene Description",
      description: "Intelligent scene analysis providing comprehensive environmental context to users."
    },
    {
      icon: FileText,
      title: "Text Recognition (OCR)",
      description: "Optical character recognition for both printed and handwritten text with TTS output."
    },
    {
      icon: MessageSquare,
      title: "Chatbot Assistant",
      description: "Interactive AI chatbot for personalized assistance and user queries."
    }
  ];

  const objectives = [
    "Develop a real-time voice-vision assistant for visually impaired users",
    "Enable object detection and scene description using computer vision",
    "Read printed or handwritten text aloud through OCR and TTS",
    "Provide dual-mode output (audio + text) for accessibility",
    "Integrate chatbot functionality for interactive assistance"
  ];

  const team = [
    { name: "Samreen", id: "3GU22CS035" },
    { name: "Saniya Begum", id: "3GU22CS036" },
    { name: "Tuba Kazmi", id: "3GU22CS049" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                <Waves className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">
                Voice-Vision Assistant
              </h2>
            </div>
            <div className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-primary transition-colors font-medium text-[15px]">
                About
              </button>
              <button onClick={() => scrollToSection('objectives')} className="text-muted-foreground hover:text-primary transition-colors font-medium text-[15px]">
                Objectives
              </button>
              <button onClick={() => scrollToSection('modules')} className="text-muted-foreground hover:text-primary transition-colors font-medium text-[15px]">
                Modules
              </button>
              <button onClick={() => scrollToSection('team')} className="text-muted-foreground hover:text-primary transition-colors font-medium text-[15px]">
                Team
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-5 py-2 text-sm font-medium" variant="outline">
            AI-Powered Assistive Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-card-foreground animate-fade-in leading-tight tracking-tight">
            Voice-Vision
            <span className="text-primary"> Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Empowering visually impaired individuals through intelligent computer vision and voice interaction
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-slide-in-up">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow-blue transition-all duration-300 text-base px-8 py-6 font-semibold rounded-xl"
              onClick={() => navigate('/camera')}
            >
              <Camera className="mr-2 h-5 w-5" />
              Try Camera Detection
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('about')}
              className="border-border hover:border-primary hover:bg-primary/5 text-card-foreground text-base px-8 py-6 font-semibold rounded-xl"
            >
              Learn More
            </Button>
          </div>

          {/* Voice waveform decoration */}
          <div className="flex items-center justify-center gap-1 mt-16 opacity-60">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-gradient-primary rounded-full animate-waveform"
                style={{ 
                  height: `${12 + Math.sin(i * 0.5) * 8}px`,
                  animationDelay: `${i * 0.1}s` 
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section id="about" className="py-20 px-6 bg-background-alt">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card shadow-large border-0">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-xl bg-gradient-primary shadow-glow-blue">
                    <Lightbulb className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-card-foreground">Introduction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Globally, around <strong className="text-primary font-semibold">285 million people</strong> are visually impaired, facing challenges in social interaction and access to information.
                </p>
                <p>
                  Assistive technologies, especially those integrating voice recognition and computer vision, are crucial for enhancing independence.
                </p>
                <p>
                  Key technologies like AI, machine learning, and OCR enable accurate object detection, scene interpretation, and text-to-speech conversion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section id="objectives" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-card-foreground tracking-tight">
              Project Objectives
            </h2>
            <p className="text-lg text-muted-foreground">Our mission to enhance accessibility and independence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {objectives.map((objective, index) => (
              <Card key={index} className="glass-card border-0 hover:shadow-large transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-glow-blue transition-all duration-300">
                      {index + 1}
                    </div>
                    <p className="text-card-foreground leading-relaxed">{objective}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-6 bg-background-alt">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-card-foreground tracking-tight">
              System Modules
            </h2>
            <p className="text-lg text-muted-foreground">Modular architecture for robust performance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className="glass-card border-0 hover:shadow-large transition-all duration-500 group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-glow-blue transition-all duration-300">
                    <module.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground font-bold">{module.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed mt-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-card-foreground tracking-tight">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground">Government Engineering College, Raichur</p>
            <p className="text-muted-foreground">Department of Computer Science & Engineering</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {team.map((member, index) => (
              <Card key={index} className="glass-card border-0 hover:shadow-large transition-all duration-300 text-center group">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow-blue transition-all duration-300">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg text-card-foreground font-bold">{member.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{member.id}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="glass-card border-0 shadow-large">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground font-bold">Project Guide</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">Dr. Shashikala P</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-background-alt">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">© 2024 Voice-Vision Assistant Project | Government Engineering College, Raichur</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Index;
