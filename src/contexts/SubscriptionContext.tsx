import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Subscription {
  id: string;
  tier: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  isPro: boolean;
  canAccessFeature: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const PRO_FEATURES = [
  'ai_coaching',
  'unlimited_history',
  'voice_journaling',
  'pdf_export',
  'advanced_insights',
  'priority_support',
];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading subscription:', error);
    } else if (data) {
      setSubscription(data);
    } else {
      const { data: newSub, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier: 'free',
          status: 'active',
        })
        .select()
        .single();

      if (!insertError && newSub) {
        setSubscription(newSub);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const isPro = subscription?.tier === 'pro' && subscription?.status === 'active';

  const canAccessFeature = (feature: string): boolean => {
    if (isPro) return true;
    return !PRO_FEATURES.includes(feature);
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  const value = {
    subscription,
    loading,
    isPro,
    canAccessFeature,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
