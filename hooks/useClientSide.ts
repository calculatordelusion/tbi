import { useState, useEffect } from 'react';

export function useClientSide() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function useSafeWindow() {
  const [windowObj, setWindowObj] = useState<Window | null>(null);

  useEffect(() => {
    setWindowObj(window);
  }, []);

  return windowObj;
}

export function useSafeDocument() {
  const [documentObj, setDocumentObj] = useState<Document | null>(null);

  useEffect(() => {
    setDocumentObj(document);
  }, []);

  return documentObj;
}
