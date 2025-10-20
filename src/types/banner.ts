export type MainBanner = {
  mainBannerId: number
  mainBannerImageUrl: string
  mainBannerMobileImageUrl: string
  mainBannerStartedAt: string
  mainBannerFinishedAt: string
  mainBannerLink: string
}

export type SubBanner = {
  subMainBannerId: number
  subMainBannerImageUrl: string
  subMainBannerMobileImageUrl: string
  subMainBannerStartedAt: string
  subMainBannerFinishedAt: string
  subMainBannerLink: string
}

// 공통 배너 타입 (prefix 제거)
export type Banner = {
  bannerId: number
  bannerImageUrl: string
  bannerMobileImageUrl: string
  bannerStartedAt: string
  bannerFinishedAt: string
  bannerLink: string
}

export type BannerResponse = MainBanner[] | SubBanner[]
