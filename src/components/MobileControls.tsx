/**
 * MobileControls: Touch overlay allowing the player to touch/hold anywhere and drag the jet freely
 * without obstructing buttons or visual clutter.
 */

import React from 'react';
import { InputManager } from '../game/engine/InputManager';

interface MobileControlsProps {
  input: InputManager;
  autoFire: boolean;
  onToggleAutoFire: () => void;
  leftHanded?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = () => {
  // Free touch-drag control is handled directly via InputManager's touch listeners on window.
  // We keep this component light and non-intrusive.
  return null;
};
