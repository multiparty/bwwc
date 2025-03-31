export enum Ethnicity {
  Hispanic = 'hispanic',
  White = 'white',
  Black = 'black',
  Hawaiian = 'hawaiian',
  Asian = 'asian',
  MiddleEasternNorthAfrican = 'middleEasternNorthAfrican',
  NativeAmerican = 'nativeAmerican',
  TwoOrMore = 'twoOrMore',
  Unreported = 'unreported'
}

export const EthnicityDisplayNames: Record<Ethnicity, string> = {
  [Ethnicity.Hispanic]: 'Hispanic or Latinx',
  [Ethnicity.White]: 'White',
  [Ethnicity.Black]: 'Black / African American',
  [Ethnicity.Hawaiian]: 'Native Hawaiian or Pacific Islander',
  [Ethnicity.Asian]: 'Asian',
  [Ethnicity.MiddleEasternNorthAfrican]: 'Middle Eastern/North African',
  [Ethnicity.NativeAmerican]: 'American Indian / Alaska Native',
  [Ethnicity.TwoOrMore]: 'Two or More Races (Not Hispanic or Latinx)',
  [Ethnicity.Unreported]: 'Unreported'
};
