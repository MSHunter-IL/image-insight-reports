
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TopicFieldProps {
  topic: string;
  setTopic: (v: string) => void;
}

export function TopicField({ topic, setTopic }: TopicFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="topic">נושא</Label>
      <Input
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="נושא הממצא"
        dir="rtl"
      />
    </div>
  );
}
