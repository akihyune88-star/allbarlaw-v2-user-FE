// Naver Geocoding API Response Types

export type AddressElementType =
  | 'SIDO'
  | 'SIGUGUN'
  | 'DONGMYUN'
  | 'RI'
  | 'ROAD_NAME'
  | 'BUILDING_NUMBER'
  | 'BUILDING_NAME'
  | 'LAND_NUMBER'
  | 'POSTAL_CODE'

export interface AddressElement {
  types: AddressElementType[]
  longName: string
  shortName: string
  code: string
}

export interface GeocodingAddress {
  roadAddress: string
  jibunAddress: string
  englishAddress: string
  addressElements: AddressElement[]
  x: string
  y: string
  distance: number
}

export interface GeocodingMeta {
  totalCount: number
  page: number
  count: number
}

export interface GeocodingResponse {
  timestamp: string
  cached: boolean
  status: string
  meta: GeocodingMeta
  addresses: GeocodingAddress[]
  errorMessage: string
}
