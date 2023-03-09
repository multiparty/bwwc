export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-binary'
}

export const GenderDisplayNames: Record<Gender, string> = {
  [Gender.Male]: 'M',
  [Gender.Female]: 'F',
  [Gender.NonBinary]: 'NB'
};
