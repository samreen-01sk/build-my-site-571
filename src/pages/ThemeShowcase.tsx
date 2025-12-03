import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertTriangle, XCircle, Info, Sun, Moon, Menu, Search, Settings, User, Home, BarChart3, FileText, Users } from "lucide-react";
import { useState } from "react";

const ThemeShowcase = () => {
  const [isDark, setIsDark] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const colorPalette = [
    { name: "Background", var: "--background", hex: "#F2FAF7", usage: "Main app background" },
    { name: "Background Alt", var: "--background-alt", hex: "#E6F4F3", usage: "Sidebars, sections" },
    { name: "Card", var: "--card", hex: "#FFFFFF", usage: "Cards, modals, dropdowns" },
    { name: "Primary Text", var: "--foreground", hex: "#1A2D3B", usage: "Headings, body text" },
    { name: "Secondary Text", var: "--muted-foreground", hex: "#546E7A", usage: "Descriptions, labels" },
    { name: "Muted Text", var: "--text-tertiary", hex: "#90A4AE", usage: "Hints, placeholders" },
    { name: "Primary (Teal)", var: "--primary", hex: "#00A3A3", usage: "CTAs, links, brand" },
    { name: "Secondary (Mint)", var: "--secondary", hex: "#4DB6AC", usage: "Success tags, highlights" },
    { name: "Tertiary (Peach)", var: "--tertiary", hex: "#FF8A65", usage: "Warnings, attention" },
    { name: "Border", var: "--border", hex: "#E0E6EB", usage: "Dividers, input borders" },
    { name: "Success", var: "--success", hex: "#2E9B8B", usage: "Success states" },
    { name: "Error", var: "--destructive", hex: "#FF6B6B", usage: "Error states" },
    { name: "Warning", var: "--warning", hex: "#FF7043", usage: "Warning states" },
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: FileText, label: "Documents" },
    { icon: Users, label: "Team" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header/Navigation */}
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-lg hidden sm:block">Serene</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 bg-background-alt border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-64 min-h-[calc(100vh-4rem)] bg-background-alt border-r border-border flex-col p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Serene Theme Showcase</h1>
              <p className="text-muted-foreground mt-1">A calming, professional color palette for SaaS applications</p>
            </div>

            {/* Color Palette Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {colorPalette.map((color) => (
                  <Card key={color.name} className="overflow-hidden shadow-soft">
                    <div 
                      className="h-20" 
                      style={{ backgroundColor: `hsl(var(${color.var}))` }}
                    />
                    <CardContent className="p-3">
                      <p className="font-medium text-sm">{color.name}</p>
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                      <p className="text-xs text-tertiary mt-1">{color.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Buttons Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Buttons</h2>
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Primary</p>
                      <div className="flex gap-2">
                        <Button>Default</Button>
                        <Button className="bg-primary-hover">Hover</Button>
                        <Button className="bg-primary-active">Active</Button>
                        <Button disabled>Disabled</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Secondary</p>
                      <div className="flex gap-2">
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Destructive</p>
                      <div className="flex gap-2">
                        <Button variant="destructive">Delete</Button>
                        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive-light">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Form Inputs Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Form Inputs</h2>
              <Card className="shadow-soft">
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Default State</Label>
                      <Input placeholder="Enter text..." />
                      <p className="text-xs text-muted-foreground">Helper text goes here</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Focus State</Label>
                      <Input 
                        placeholder="Click to focus" 
                        className="ring-2 ring-ring ring-offset-2"
                      />
                      <p className="text-xs text-primary">Input is focused</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-destructive">Error State</Label>
                      <Input 
                        placeholder="Invalid input" 
                        className="border-destructive focus-visible:ring-destructive"
                      />
                      <p className="text-xs text-destructive">This field is required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Status Badges Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Notification Badges & Status</h2>
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Solid Badges</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-success text-success-foreground">
                          <Check className="w-3 h-3 mr-1" /> Success
                        </Badge>
                        <Badge className="bg-warning text-warning-foreground">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Warning
                        </Badge>
                        <Badge className="bg-destructive text-destructive-foreground">
                          <XCircle className="w-3 h-3 mr-1" /> Error
                        </Badge>
                        <Badge className="bg-info text-info-foreground">
                          <Info className="w-3 h-3 mr-1" /> Info
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Light Badges</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-success-light text-success border border-success/20">
                          <Check className="w-3 h-3 mr-1" /> Success
                        </Badge>
                        <Badge className="bg-warning-light text-warning border border-warning/20">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Warning
                        </Badge>
                        <Badge className="bg-destructive-light text-destructive border border-destructive/20">
                          <XCircle className="w-3 h-3 mr-1" /> Error
                        </Badge>
                        <Badge className="bg-info-light text-info border border-info/20">
                          <Info className="w-3 h-3 mr-1" /> Info
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sample Cards Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Content Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Analytics
                    </CardTitle>
                    <CardDescription>Track your performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Page Views</span>
                        <span className="font-medium">12,847</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      Team Members
                    </CardTitle>
                    <CardDescription>Manage your team access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs text-muted-foreground">
                        +5
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-medium transition-shadow border-l-4 border-l-tertiary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-tertiary" />
                      Attention Needed
                    </CardTitle>
                    <CardDescription>3 items require your review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-tertiary text-tertiary hover:bg-tertiary/10">
                      Review Items
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Usage Guidelines */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>
              <Card className="shadow-soft">
                <CardContent className="p-6 prose prose-sm max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Text Hierarchy</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><span className="text-foreground font-medium">Primary text</span> - Headings, important content</li>
                        <li><span className="text-muted-foreground">Secondary text</span> - Descriptions, labels</li>
                        <li><span className="text-tertiary">Muted text</span> - Hints, placeholders, timestamps</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Color Usage</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><span className="text-primary font-medium">Primary (Teal)</span> - CTAs, links, active states</li>
                        <li><span className="text-secondary font-medium">Secondary (Mint)</span> - Success, tags, highlights</li>
                        <li><span className="text-tertiary font-medium">Tertiary (Peach)</span> - Warnings, attention items</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Backgrounds</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Main background - Page body, main container</li>
                        <li>Alt background - Sidebars, section dividers</li>
                        <li>Card background - Elevated content, modals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">WCAG Compliance</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>All text meets AA contrast ratio (4.5:1+)</li>
                        <li>Focus states clearly visible</li>
                        <li>Colorblind-safe palette tested</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ThemeShowcase;
