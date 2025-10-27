import { useRoute } from 'wouter';
import { getDocById } from '@/lib/docs';
import MarkdownViewer from '@/components/MarkdownViewer';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function DocPage() {
  const [, params] = useRoute('/doc/:id');
  const { theme, toggleTheme } = useTheme();
  const doc = params?.id ? getDocById(params.id) : null;

  if (!doc) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Document Not Found</h1>
            <p className="text-muted-foreground">The requested document could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-xl font-bold">{doc.title}</h1>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
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
        <main className="container px-6 py-8">
          <MarkdownViewer file={doc.file} />
        </main>
      </div>
    </div>
  );
}

