import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api/client';

interface Emotion {
  id: number;
  name: string;
  emoji: string | null;
  color: string | null;
}

interface EmotionContextData {
  emotions: Emotion[];
  loading: boolean;
  getEmotionById: (id: number) => Emotion | undefined;
}

const EmotionContext = createContext<EmotionContextData>({} as EmotionContextData);

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const response = await api.get('/emotions/types');
      setEmotions(response.data.data);
    } catch (error) {
      console.error('Error loading emotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionById = (id: number) => {
    return emotions.find(e => e.id === id);
  };

  return (
    <EmotionContext.Provider value={{ emotions, loading, getEmotionById }}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotions = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotions must be used within an EmotionProvider');
  }
  return context;
};