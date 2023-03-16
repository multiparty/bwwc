from typing import Dict, Tuple, TypedDict


class GenderData(TypedDict):
    M: int
    F: int
    NB: int


class EthnicityData(TypedDict):
    hispanic: GenderData
    white: GenderData
    black: GenderData
    hawaiian: GenderData
    asian: GenderData
    nativeAmerican: GenderData
    twoOrMore: GenderData
    unreported: GenderData


ProfessionData = Dict[str, EthnicityData]
IndustryData = Dict[str, ProfessionData]
