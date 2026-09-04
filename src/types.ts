export type JellyfishSpeedType = 'slow' | 'fast';

export type BellShape = 
  | 'dome' 
  | 'mushroom' 
  | 'umbrella' 
  | 'crown' 
  | 'crystal' 
  | 'scalloped' 
  | 'drop';

export type TentacleStyle = 
  | 'straight' 
  | 'curly' 
  | 'ribbon' 
  | 'spiral' 
  | 'beaded';

export type PatternType = 
  | 'dots' 
  | 'stripes' 
  | 'rings' 
  | 'sparkles' 
  | 'hearts' 
  | 'stars';

export type FaceType = 
  | 'happy' 
  | 'winking' 
  | 'sparkle' 
  | 'shy' 
  | 'excited';

export interface JellyfishData {
  id: number;
  nameEn: string;
  nameZh: string;
  speedType: JellyfishSpeedType;
  baseSpeed: number; // slow: 0.6 ~ 0.9, fast: 1.8 ~ 2.6
  size: number; // 60 ~ 110 px
  bellShape: BellShape;
  tentacleStyle: TentacleStyle;
  tentacleCount: number;
  pattern: PatternType;
  face: FaceType;
  colorPrimary: string;
  colorSecondary: string;
  glowColor: string;
  tentacleColor: string;
  // Dynamic physics state
  x: number; // percentage 5 ~ 90
  y: number; // percentage 10 ~ 85
  vx: number;
  vy: number;
  rotation: number;
  targetRotation: number;
  pulsePhase: number;
  pulseSpeed: number;
  caughtCount: number;
}

export type FilterSpeedMode = 'all' | 'slow' | 'fast';
