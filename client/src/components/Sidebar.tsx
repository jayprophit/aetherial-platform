import { Link, useLocation } from 'wouter';
import { docs, getDocsByCategory } from '@/lib/docs';
import { FileText, BookOpen, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [location] = useLocation();
  
  const coreDoc = getDocsByCategory('core');
  const chatDocs = getDocsByCategory('chat');

  return (
    <aside className="w-64 border-r bg-muted/10 h-screen overflow-y-auto sticky top-0">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="font-bold text-lg">Unified Platform Docs</h1>
          </div>
        </Link>

        <nav className="space-y-6">
          {/* Core Documents */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Core Documents</span>
            </div>
            <ul className="space-y-1">
              {coreDoc.map(doc => (
                <li key={doc.id}>
                  <Link href={`/doc/${doc.id}`}>
                    <a className={cn(
                      "block px-3 py-2 rounded-md text-sm transition-colors",
                      location === `/doc/${doc.id}` 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "hover:bg-muted text-foreground"
                    )}>
                      {doc.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Sessions */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Sessions</span>
            </div>
            <ul className="space-y-1">
              {chatDocs.map(doc => (
                <li key={doc.id}>
                  <Link href={`/doc/${doc.id}`}>
                    <a className={cn(
                      "block px-3 py-2 rounded-md text-sm transition-colors",
                      location === `/doc/${doc.id}` 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "hover:bg-muted text-foreground"
                    )}>
                      {doc.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}

