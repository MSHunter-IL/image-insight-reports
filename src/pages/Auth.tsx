
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
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
        title: "שגיאת התחברות",
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
        title: "שגיאת הרשמה",
        description: error.message,
      });
    } else {
      toast({
        title: "בדוק את האימייל שלך",
        description: "נשלח אימייל אימות, אנא בדוק את תיבת הדואר שלך",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>ברוכים הבאים</CardTitle>
          <CardDescription>התחברו למערכת או הירשמו</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">התחבר</TabsTrigger>
              <TabsTrigger value="signup">הירשם</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "מתחבר..." : "התחבר"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "נרשם..." : "הירשם"}
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
                או
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
            התחבר עם Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
