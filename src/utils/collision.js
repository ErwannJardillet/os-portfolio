/**
 * Vérifie si deux icônes se chevauchent réellement.
 * @param {{ x: number, y: number }} pos1
 * @param {{ x: number, y: number }} pos2
 * @param {number} iconWidth  Largeur d'une icône en px
 * @param {number} iconHeight Hauteur d'une icône en px
 * @returns {boolean}
 */
export function checkCollision(pos1, pos2, iconWidth, iconHeight) {
  const rect1 = {
    left: pos1.x,
    right: pos1.x + iconWidth,
    top: pos1.y,
    bottom: pos1.y + iconHeight,
  };
  const rect2 = {
    left: pos2.x,
    right: pos2.x + iconWidth,
    top: pos2.y,
    bottom: pos2.y + iconHeight,
  };

  const horizontalOverlap = rect1.right > rect2.left && rect1.left < rect2.right;
  const verticalOverlap = rect1.bottom > rect2.top && rect1.top < rect2.bottom;

  return horizontalOverlap && verticalOverlap;
}
