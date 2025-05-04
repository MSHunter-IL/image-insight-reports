
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useLanguage } from '@/context/LanguageContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    
    if (error) {
      toast({
        variant: "destructive",
        title: t('auth.error'),
        description: error.message,
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUpWithEmail(email, password);
    setLoading(false);
    
    if (error) {
      toast({
        variant: "destructive",
        title: t('auth.error'),
        description: error.message,
      });
    } else {
      toast({
        title: t('auth.checkEmail'),
        description: t('auth.checkEmailDescription'),
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t('auth.welcome')}</CardTitle>
          <CardDescription>{t('auth.welcomeDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">{t('auth.signin')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.signingIn') : t('auth.signin')}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.signingUp') : t('auth.signup')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.or')}
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={signInWithGoogle} 
            className="w-full"
            disabled={loading}
          >
            <FcGoogle className="mr-2" size={20} />
            {t('auth.googleAuth')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
