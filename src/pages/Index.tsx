import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Camera, FileText, MessageSquare, Brain, Target, Lightbulb, Users } from "lucide-react";

const Index = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const modules = [
    {
      icon: Camera,
      title: "Camera Interface",
      description: "Real-time frame capture and processing with seamless integration across all detection modules.",
      methods: ["start_camera()", "read_frame()", "stop_camera()"]
    },
    {
      icon: Eye,
      title: "Object Detection",
      description: "Advanced AI-powered object recognition using TensorFlow Lite for real-time identification.",
      methods: ["load_model()", "detect_objects()"]
    },
    {
      icon: Brain,
      title: "Scene Description",
      description: "Intelligent scene analysis providing comprehensive environmental context to users.",
      methods: ["describe_scene()", "analyze_context()"]
    },
    {
      icon: FileText,
      title: "Text Recognition (OCR)",
      description: "Optical character recognition for both printed and handwritten text with TTS output.",
      methods: ["extract_text()", "text_to_speech()"]
    },
    {
      icon: MessageSquare,
      title: "Chatbot Assistant",
      description: "Interactive AI chatbot for personalized assistance and user queries.",
      methods: ["process_query()", "generate_response()"]
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
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Voice-Vision Assistant
            </h2>
            <div className="hidden md:flex gap-6">
              <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('objectives')} className="text-foreground hover:text-primary transition-colors">
                Objectives
              </button>
              <button onClick={() => scrollToSection('modules')} className="text-foreground hover:text-primary transition-colors">
                Modules
              </button>
              <button onClick={() => scrollToSection('team')} className="text-foreground hover:text-primary transition-colors">
                Team
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-primary to-secondary text-white border-0" variant="outline">
            AI-Powered Assistive Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Voice-Vision Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Empowering visually impaired individuals through intelligent computer vision and voice interaction
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
              onClick={() => scrollToSection('about')}
            >
              Learn More
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('modules')}
            >
              Explore Modules
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction & Problem Statement */}
      <section id="about" className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-8 h-8 text-primary" />
                  <CardTitle className="text-3xl">Introduction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Globally, around <strong className="text-foreground">285 million people</strong> are visually impaired, facing challenges in social interaction and access to information.
                </p>
                <p>
                  Assistive technologies, especially those integrating voice recognition and computer vision, are crucial for enhancing independence.
                </p>
                <p>
                  Key technologies like AI, machine learning, and OCR enable accurate object detection, scene interpretation, and text-to-speech conversion.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-secondary" />
                  <CardTitle className="text-3xl">Problem Statement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Visually impaired individuals face significant challenges in recognizing objects, reading text, and understanding their surroundings. Existing assistive solutions are often <strong className="text-foreground">limited, expensive, or lack real-time functionality</strong>, creating a need for an affordable and intelligent voice-vision assistant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section id="objectives" className="py-20 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Project Objectives
            </h2>
            <p className="text-xl text-muted-foreground">Our mission to enhance accessibility and independence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {objectives.map((objective, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{objective}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              System Modules
            </h2>
            <p className="text-xl text-muted-foreground">Modular architecture for robust performance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Key Methods:</p>
                    <div className="flex flex-wrap gap-2">
                      {module.methods.map((method, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground">Government Engineering College, Raichur</p>
            <p className="text-lg text-muted-foreground">Department of Computer Science & Engineering</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {team.map((member, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors hover:shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.id}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="border-2 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Project Guide</CardTitle>
              <CardDescription className="text-lg">Dr. Shashikala P</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 Voice-Vision Assistant Project | Government Engineering College, Raichur</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
