
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Site } from '@/types/site';

interface SiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>) => void;
  site: Site | null;
}

interface FormValues {
  name: string;
  address: string;
  contactPerson: string;
  phoneNumber: string;
}

export function SiteDialog({ isOpen, onClose, onSave, site }: SiteDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      name: site?.name || '',
      address: site?.address || '',
      contactPerson: site?.contactPerson || '',
      phoneNumber: site?.phoneNumber || ''
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: site?.name || '',
        address: site?.address || '',
        contactPerson: site?.contactPerson || '',
        phoneNumber: site?.phoneNumber || ''
      });
    }
  }, [isOpen, site, reset]);

  const onSubmit = (data: FormValues) => {
    onSave({
      name: data.name,
      address: data.address,
      contactPerson: data.contactPerson,
      phoneNumber: data.phoneNumber
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{site ? 'עריכת אתר' : 'הוספת אתר חדש'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם אתר *</Label>
            <Input
              id="name"
              {...register('name', { required: 'שם אתר הוא שדה חובה' })}
              placeholder="הזן שם אתר"
              dir="rtl"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">כתובת *</Label>
            <Input
              id="address"
              {...register('address', { required: 'כתובת היא שדה חובה' })}
              placeholder="הזן כתובת"
              dir="rtl"
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">איש קשר</Label>
            <Input
              id="contactPerson"
              {...register('contactPerson')}
              placeholder="הזן שם איש קשר"
              dir="rtl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">טלפון</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="הזן מספר טלפון"
              dir="rtl"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>ביטול</Button>
            <Button type="submit">{site ? 'עדכן' : 'הוסף'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
