import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { docs, getDocsByCategory } from "@/lib/docs";
import { FileText, BookOpen, MessageSquare, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const coreDocs = getDocsByCategory('core');
  const chatDocs = getDocsByCategory('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="font-bold text-xl">Unified Platform Documentation</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unified Platform Project Analysis
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Comprehensive documentation from 19 chat sessions analyzing a sophisticated enterprise platform
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/doc/index">
              <Button size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                Start Reading
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/doc/executive-summary">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Executive Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">19</CardTitle>
              <CardDescription>Chat Sessions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">70-80%</CardTitle>
              <CardDescription>Complete</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">28</CardTitle>
              <CardDescription>Week Roadmap</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">8</CardTitle>
              <CardDescription>Implementation Phases</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Core Documents */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-2xl font-bold">Core Documents</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreDocs.map(doc => (
              <Link key={doc.id} href={`/doc/${doc.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-2xl font-bold">Chat Session Extractions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatDocs.map(doc => (
              <Link key={doc.id} href={`/doc/${doc.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container px-6 py-8 text-center text-sm text-muted-foreground">
          <p>Generated by Manus AI • October 26, 2025</p>
          <p className="mt-2">Analysis of 19 chat sessions documenting the Unified Platform project</p>
        </div>
      </footer>
    </div>
  );
}
