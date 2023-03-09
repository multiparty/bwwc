export enum Ethnicity {
  Hispanic = 'Hispanic',
  White = 'White',
  Black = 'Black',
  Hawaiian = 'Hawaiian',
  Asian = 'Asian',
  NativeAmerican = 'Native American',
  TwoOrMore = 'Two or more',
  Unreported = 'Unreported'
}

export const EthnicityDisplayNames: Record<Ethnicity, string> = {
  [Ethnicity.Hispanic]: 'Hispanic or Latinx',
  [Ethnicity.White]: 'White',
  [Ethnicity.Black]: 'Black / African American',
  [Ethnicity.Hawaiian]: 'Native Hawaiian or Pacific Islander',
  [Ethnicity.Asian]: 'Asian',
  [Ethnicity.NativeAmerican]: 'American Indian / Alaska Native',
  [Ethnicity.TwoOrMore]: 'Two or More Races (Not Hispanic or Latinx)',
  [Ethnicity.Unreported]: 'Unreported'
};
