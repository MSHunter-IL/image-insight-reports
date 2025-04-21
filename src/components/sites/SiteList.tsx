
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash } from 'lucide-react';
import { Site } from '@/types/site';
import { SiteDialog } from './SiteDialog';
import { useSites } from '@/context/SiteContext';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

export function SiteList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [siteToEdit, setSiteToEdit] = useState<Site | null>(null);
  const { sites, addSite, updateSite, deleteSite } = useSites();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenDialog = (site?: Site) => {
    if (site) {
      setSiteToEdit(site);
    } else {
      setSiteToEdit(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSiteToEdit(null);
  };

  const handleSaveSite = (site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (siteToEdit) {
        updateSite({
          ...siteToEdit,
          ...site,
          updatedAt: new Date().toISOString()
        });
        toast({
          title: "אתר עודכן",
          description: `האתר ${site.name} עודכן בהצלחה`,
        });
      } else {
        addSite({
          ...site,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast({
          title: "אתר נוסף",
          description: `האתר ${site.name} נוסף בהצלחה`,
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת האתר",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSite = (site: Site) => {
    try {
      deleteSite(site.id);
      toast({
        title: "אתר נמחק",
        description: `האתר ${site.name} נמחק בהצלחה`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת האתר",
        variant: "destructive"
      });
    }
  };

  const goToSite = (site: Site) => {
    navigate(`/sites/${site.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>אתרים</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף אתר חדש
        </Button>
      </CardHeader>
      <CardContent>
        {sites.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            אין אתרים להצגה. לחץ על "הוסף אתר חדש" כדי להתחיל.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם אתר</TableHead>
                <TableHead>כתובת</TableHead>
                <TableHead>איש קשר</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id} className="cursor-pointer hover:bg-muted/50" onClick={() => goToSite(site)}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.address}</TableCell>
                  <TableCell>{site.contactPerson || '-'}</TableCell>
                  <TableCell>{site.phoneNumber || '-'}</TableCell>
                  <TableCell className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(site)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                          <AlertDialogDescription>
                            פעולה זו תמחק את האתר ואת כל הסקרים הקשורים אליו. פעולה זו לא ניתנת לביטול.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ביטול</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSite(site)}>מחיקה</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <SiteDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        onSave={handleSaveSite}
        site={siteToEdit}
      />
    </Card>
  );
}
