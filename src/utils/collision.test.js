import { describe, it, expect } from 'vitest';
import { checkCollision } from './collision';

const W = 80;
const H = 100;

describe('checkCollision', () => {
  it('détecte une collision quand les icônes se superposent', () => {
    expect(checkCollision({ x: 0, y: 0 }, { x: 40, y: 50 }, W, H)).toBe(true);
  });

  it('retourne false quand les icônes sont séparées horizontalement', () => {
    expect(checkCollision({ x: 0, y: 0 }, { x: 100, y: 0 }, W, H)).toBe(false);
  });

  it('retourne false quand les icônes sont séparées verticalement', () => {
    expect(checkCollision({ x: 0, y: 0 }, { x: 0, y: 110 }, W, H)).toBe(false);
  });

  it('retourne false quand les bords se touchent exactement (adjacent)', () => {
    // rect1.right === 80, rect2.left === 80 → pas de chevauchement strict
    expect(checkCollision({ x: 0, y: 0 }, { x: 80, y: 0 }, W, H)).toBe(false);
  });

  it('détecte une collision à la même position', () => {
    expect(checkCollision({ x: 10, y: 10 }, { x: 10, y: 10 }, W, H)).toBe(true);
  });

  it('détecte une collision avec un léger chevauchement horizontal', () => {
    expect(checkCollision({ x: 0, y: 0 }, { x: 79, y: 0 }, W, H)).toBe(true);
  });

  it('détecte une collision avec un léger chevauchement vertical', () => {
    expect(checkCollision({ x: 0, y: 0 }, { x: 0, y: 99 }, W, H)).toBe(true);
  });
});
