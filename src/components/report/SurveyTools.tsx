
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Plus } from 'lucide-react';
import { SurveyToolsProps } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SurveyTools({ tools, onDownload, onAddTool }: SurveyToolsProps) {
  const [newToolName, setNewToolName] = useState('');
  const [newToolType, setNewToolType] = useState('');
  const [toolDialogOpen, setToolDialogOpen] = useState(false);

  const handleAddTool = () => {
    if (newToolName) {
      onAddTool(newToolName, newToolType);
      setNewToolName('');
      setNewToolType('');
      setToolDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {tools.map(tool => (
        <div key={tool.id} className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">{tool.name}</p>
            <p className="text-xs text-muted-foreground">
              הורד {tool.downloadCount} פעמים
              {tool.lastDownload && ` • עודכן לאחרונה: ${tool.lastDownload.toLocaleDateString()}`}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownload(tool.id)}
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  הורד
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>הורד כלי סקר</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
      
      <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-2">
            <Plus className="mr-1 h-4 w-4" />
            הוסף כלי סקר חדש
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוספת כלי סקר חדש</DialogTitle>
            <DialogDescription>
              הזן את פרטי כלי הסקר החדש
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="toolName">שם כלי הסקר</Label>
              <Input 
                id="toolName" 
                value={newToolName} 
                onChange={(e) => setNewToolName(e.target.value)} 
                placeholder="לדוגמה: סקר בטיחות אש"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toolType">סוג הסקר</Label>
              <Input 
                id="toolType" 
                value={newToolType} 
                onChange={(e) => setNewToolType(e.target.value)} 
                placeholder="לדוגמה: בטיחות אש, בטיחות בעבודה"
              />
            </div>
            <Button onClick={handleAddTool} className="w-full">
              הוסף כלי סקר
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
