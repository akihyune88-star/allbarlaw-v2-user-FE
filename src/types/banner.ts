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

export type BannerResponse = MainBanner[] | SubBanner[]
