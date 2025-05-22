// src/components/crm/CRMHeader.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  BrainCircuit,
  Settings,
  LogOut,
  Presentation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ✨ NEW: Supabase & Toast
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const CRMHeader = ({ activePage }: { activePage?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.'
    });
    navigate('/signin', { replace: true });
  };

  return (
    <header className="bg-white dark:bg-indigo-900 border-b border-gray-200 dark:border-indigo-800 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
              <span className="mr-2">AdvisorAI</span>
              <span className="text-sm px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-md">CRM</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <NavButton 
              icon={<Home size={18} />} 
              label="Dashboard" 
              to="/crm"
              active={currentPath === '/crm' || activePage === 'Dashboard'} 
            />
            <NavButton 
              icon={<Users size={18} />} 
              label="Contacts" 
              to="/crm/contacts"
              active={currentPath === '/crm/contacts' || activePage === 'Contacts'} 
            />
            <NavButton 
              icon={<Presentation size={18} />} 
              label="Meetings" 
              to="/crm/meetings"
              active={currentPath === '/crm/meetings' || currentPath === '/meeting' || currentPath === '/meeting-details' || activePage === 'Meetings'} 
            />
            <NavButton 
              icon={<Calendar size={18} />} 
              label="Calendar" 
              to="/crm/calendar"
              active={currentPath === '/crm/calendar' || activePage === 'Calendar'} 
            />
            <NavButton 
              icon={<BrainCircuit size={18} />} 
              label="AdvisorLM" 
              to="/crm/advisorlm"
              active={currentPath === '/crm/advisorlm' || activePage === 'AdvisorLM'} 
            />
            <NavButton 
              icon={<Settings size={18} />} 
              label="Settings" 
              to="/crm/settings"
              active={currentPath === '/crm/settings' || currentPath === '/plans' || activePage === 'Settings'} 
            />
          </nav>
          
          {/* Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full h-8 w-8 p-0 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 font-semibold"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ icon, label, to, active = false }: NavButtonProps) => (
  <Button
    variant={active ? "secondary" : "ghost"}
    className={`flex items-center px-3 py-2 text-sm ${
      active 
        ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300" 
        : "text-gray-600 dark:text-gray-300"
    }`}
    asChild
  >
    <Link to={to}>
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  </Button>
);

export default CRMHeader;
