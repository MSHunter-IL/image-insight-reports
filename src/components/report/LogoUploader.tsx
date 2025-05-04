
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

    // Optimize the logo for the report
    const optimizeLogo = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            // Set optimal dimensions for report header
            const maxWidth = 300;
            const maxHeight = 100;
            
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions while maintaining aspect ratio
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const optimizedDataUrl = canvas.toDataURL('image/png');
              resolve(optimizedDataUrl);
            } else {
              // Fallback if canvas context isn't available
              resolve(e.target?.result as string);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const optimizedLogo = await optimizeLogo(file);
      setCustomLogo(optimizedLogo);
      toast({
        title: "הלוגו הועלה בהצלחה",
        description: "הלוגו החדש יופיע בכל הדוחות החדשים"
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת עיבוד הלוגו",
        variant: "destructive"
      });
    }
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
