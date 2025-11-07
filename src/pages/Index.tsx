import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Camera, FileText, MessageSquare, Brain, Lightbulb, Users } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-[hsl(228,60%,12%)] to-[hsl(271,70%,15%)] relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-card/40 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              Voice-Vision Assistant
            </h2>
            <div className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('about')} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('objectives')} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Objectives
              </button>
              <button onClick={() => scrollToSection('modules')} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Modules
              </button>
              <button onClick={() => scrollToSection('team')} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Team
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 backdrop-blur-sm px-6 py-2 text-sm font-semibold" variant="outline">
            AI-Powered Assistive Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 leading-tight">
            Voice-Vision Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Empowering visually impaired individuals through intelligent computer vision and voice interaction
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 text-lg px-8 py-6 font-semibold"
              onClick={() => navigate('/camera')}
            >
              <Camera className="mr-2 h-5 w-5" />
              Try Camera Detection
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('about')}
              className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary backdrop-blur-sm text-lg px-8 py-6 font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section id="about" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-border/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-500 bg-card/60 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/20 backdrop-blur-sm">
                    <Lightbulb className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground">Introduction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Globally, around <strong className="text-primary font-bold">285 million people</strong> are visually impaired, facing challenges in social interaction and access to information.
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
      <section id="objectives" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Project Objectives
            </h2>
            <p className="text-xl text-muted-foreground">Our mission to enhance accessibility and independence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {objectives.map((objective, index) => (
              <Card key={index} className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-card/60 backdrop-blur-xl group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-foreground font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{objective}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              System Modules
            </h2>
            <p className="text-xl text-muted-foreground">Modular architecture for robust performance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className="border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] group bg-card/60 backdrop-blur-xl">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary/50">
                    <module.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl text-foreground font-bold">{module.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground">Government Engineering College, Raichur</p>
            <p className="text-lg text-muted-foreground">Department of Computer Science & Engineering</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {team.map((member, index) => (
              <Card key={index} className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] text-center bg-card/60 backdrop-blur-xl group">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg text-foreground font-bold">{member.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{member.id}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground font-bold">Project Guide</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">Dr. Shashikala P</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50 bg-card/20 backdrop-blur-sm relative">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2024 Voice-Vision Assistant Project | Government Engineering College, Raichur</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Index;
