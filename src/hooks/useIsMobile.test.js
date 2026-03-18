import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

const BREAKPOINT = 1024;

describe('useIsMobile', () => {
  const setWidth = (w) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w });
  };

  afterEach(() => {
    setWidth(1280); // reset
  });

  it('retourne false pour un écran large (>= 1024)', () => {
    setWidth(1280);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('retourne true pour un écran étroit (< 1024)', () => {
    setWidth(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('retourne true juste en dessous du breakpoint (1023)', () => {
    setWidth(BREAKPOINT - 1);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('retourne false exactement au breakpoint (1024)', () => {
    setWidth(BREAKPOINT);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('se met à jour lors d\'un événement resize', () => {
    setWidth(1280);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      setWidth(600);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });

  it('se remet à false si l\'écran est élargi après un resize', () => {
    setWidth(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      setWidth(1400);
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });
});
