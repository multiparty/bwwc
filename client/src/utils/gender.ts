export enum Gender {
  Male = 'M',
  Female = 'F',
  NonBinary = 'NB'
}

export const GenderDisplayNames: Record<Gender, string> = {
  [Gender.Male]: 'M',
  [Gender.Female]: 'F',
  [Gender.NonBinary]: 'NB'
};
