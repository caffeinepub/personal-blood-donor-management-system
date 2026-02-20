import { useInternetIdentity } from './hooks/useInternetIdentity';
import HomePage from './pages/HomePage';
import { Button } from './components/ui/button';
import { Heart, Droplet } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, login, clear, isInitializing, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="mb-4 inline-block animate-pulse">
            <Droplet className="h-12 w-12 text-emerald-600" />
          </div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Droplet className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Blood Donor Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Secure admin portal for managing blood donor information
            </p>
          </div>
          
          <div className="rounded-lg border border-emerald-200 bg-white p-8 shadow-lg">
            <p className="mb-6 text-sm text-muted-foreground">
              This is a secure, single-user system. Please authenticate to continue.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoggingIn ? 'Connecting...' : 'Admin Login'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Droplet className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Blood Donor Management</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            <Button onClick={clear} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <HomePage />
        </main>
        
        <footer className="border-t border-emerald-200 bg-white/80 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                caffeine.ai
              </a>
            </p>
            <p className="mt-1">© {new Date().getFullYear()} Blood Donor Management System</p>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
