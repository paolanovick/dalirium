import { useEffect, useState } from 'react';
import { categorias as fallbackCategorias, fetchCategorias } from '../data/categorias';

export function useCategorias({ admin = false, apiUrl } = {}) {
  const [categorias, setCategorias] = useState(admin ? [] : fallbackCategorias);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCategorias({ admin, apiUrl })
      .then((data) => {
        if (!cancelled) setCategorias(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [admin, apiUrl]);

  return { categorias, loading };
}
