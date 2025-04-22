
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useLogo } from '@/context/LogoContext';
import { useToast } from '@/components/ui/use-toast';

export function LogoUploader() {
  const { customLogo, setCustomLogo } = useLogo();
  const { toast } = useToast();

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "שגיאה",
        description: "נא להעלות קובץ תמונה בלבד",
        variant: "destructive"
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64Logo = reader.result as string;
      setCustomLogo(base64Logo);
      toast({
        title: "הלוגו הועלה בהצלחה",
        description: "הלוגו החדש יופיע בכל הדוחות החדשים"
      });
    };
    reader.readAsDataURL(file);
  }, [setCustomLogo, toast]);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">לוגו מותאם אישית</h3>
          <p className="text-sm text-muted-foreground">
            העלה לוגו חדש שיופיע בכל הדוחות
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {customLogo && (
          <div className="relative w-32 h-16 border rounded">
            <img
              src={customLogo}
              alt="לוגו מותאם אישית"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-4 h-4 ml-2" />
            {customLogo ? 'החלף לוגו' : 'העלה לוגו'}
          </Button>
          
          {customLogo && (
            <Button
              variant="outline"
              onClick={() => {
                setCustomLogo(null);
                toast({
                  title: "הלוגו הוסר",
                  description: "חזרה ללוגו ברירת המחדל"
                });
              }}
            >
              <ImageIcon className="w-4 h-4 ml-2" />
              הסר לוגו
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
