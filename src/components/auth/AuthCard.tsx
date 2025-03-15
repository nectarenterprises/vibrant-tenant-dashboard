
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { AuthFormData } from '@/hooks/useAuthForm';

interface AuthCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  handleSignIn: (data: AuthFormData) => Promise<void>;
  handleSignUp: (data: AuthFormData) => Promise<void>;
}

const AuthCard: React.FC<AuthCardProps> = ({
  activeTab,
  setActiveTab,
  loading,
  handleSignIn,
  handleSignUp
}) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <CardHeader className="space-y-1 text-center pt-10">
        <CardTitle className="text-2xl font-bold">SweetLease</CardTitle>
        <CardDescription>
          Manage your properties efficiently
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 mx-4">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSubmit={handleSignIn} loading={loading} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSubmit={handleSignUp} loading={loading} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
