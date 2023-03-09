export enum Positions {
  Executive = 'Executive',
  Manager = 'Manager',
  Professional = 'Professional',
  Technician = 'Technician',
  Sales = 'Sales',
  Administrative = 'Administrative',
  Craft = 'Craft',
  Operative = 'Operative',
  Laborer = 'Laborer',
  Service = 'Service'
}

export const PositionDisplayNames: Record<Positions, string> = {
  [Positions.Executive]: 'Executive / Senior Level Officials and Managers',
  [Positions.Manager]: 'First / Mid Level Officials and Managers',
  [Positions.Professional]: 'Professionals',
  [Positions.Technician]: 'Technicians',
  [Positions.Sales]: 'Sales Workers',
  [Positions.Administrative]: 'Administrative Support Workers',
  [Positions.Craft]: 'Craft Workers',
  [Positions.Operative]: 'Operatives',
  [Positions.Laborer]: 'Laborers and Helpers',
  [Positions.Service]: 'Service Workers'
};
