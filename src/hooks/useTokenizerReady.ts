import { useEffect, useState } from 'react';
import { loadOpenAITokenizers } from '@/utils/tokenCalculator';

export function useTokenizerReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    loadOpenAITokenizers().then(() => { if (mounted) setReady(true); }).catch(() => { /* fallback estimate */ });
    return () => { mounted = false; };
  }, []);
  return ready;
}
