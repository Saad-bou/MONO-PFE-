export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;
