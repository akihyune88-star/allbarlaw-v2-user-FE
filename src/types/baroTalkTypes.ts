// Lawyer 타입 import
import { Lawyer } from './lawyerTypes'

export type CreateBaroTalkRequest = {
  consultationRequestTitle: string
  consultationRequestDescription: string
  consultationRequestSubcategoryId: number
  selectedLawyerIds: number[]
}

// 세션 저장용 타입 (selectedLawyerIds 제외)
export type BaroTalkSessionData = {
  consultationRequestTitle: string
  consultationRequestDescription: string
  consultationRequestSubcategoryId: number
}

export type BaroTalkLawyerListRequest = {
  consultationRequestId: number
  subcategoryId: number
  take?: number
  page?: number
  excludeLawyerIds?: number[]
}

export type BaroTalkLawyerListResponse = {
  lawyers: Lawyer[]
}
