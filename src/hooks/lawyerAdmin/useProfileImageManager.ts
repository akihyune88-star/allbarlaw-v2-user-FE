import { useState, useEffect } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { LawyerBasicInfoEditResponse } from '@/types/lawyerTypes'

export interface ProfileImage {
  url: string
  isExisting?: boolean
  originalDisplayOrder?: number
  imageId?: number
}

export const useProfileImageManager = (lawyerBasicInfo: LawyerBasicInfoEditResponse | undefined) => {
  const [profileImages, setProfileImages] = useState<(ProfileImage | null)[]>([null, null, null, null, null])
  const [isImagesInitialized, setIsImagesInitialized] = useState(false)
  const { uploadFile } = useFileUpload()

  // 이미지 데이터 초기화
  useEffect(() => {
    if (lawyerBasicInfo && !isImagesInitialized) {
      if (lawyerBasicInfo.lawyerProfileImages && lawyerBasicInfo.lawyerProfileImages.length > 0) {
        const images: (ProfileImage | null)[] = [null, null, null, null, null]
        lawyerBasicInfo.lawyerProfileImages.forEach((img: any, index: number) => {
          if (index < 5) {
            images[index] = {
              url: img.imageUrl,
              isExisting: true,
              originalDisplayOrder: img.displayOrder,
              imageId: img.id,
            }
          }
        })
        setProfileImages(images)
      }
      setIsImagesInitialized(true)
    }
  }, [lawyerBasicInfo, isImagesInitialized])

  // 이미지 삭제
  const handleImageDelete = (index: number) => {
    const newImages = [...profileImages]
    newImages.splice(index, 1)
    newImages.push(null)
    setProfileImages(newImages)
  }

  // 이미지 업로드
  const handleImageUpload = async (file: File, index: number) => {
    try {
      const result = await uploadFile(file, {
        folder: `lawyer/profile/${lawyerBasicInfo?.lawyerId}`,
        maxSize: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })

      const newImages = [...profileImages]
      newImages[index] = {
        url: result.fileUrl,
        isExisting: false,
      }
      setProfileImages(newImages)
      
      console.log('이미지가 업로드되었습니다.')
      return true
    } catch (error) {
      console.error(`이미지 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      return false
    }
  }

  // 이미지 URL 배열 반환
  const getImageUrls = (): string[] => {
    return profileImages.filter(img => img !== null).map(img => img!.url)
  }

  // 구조화된 이미지 데이터 반환
  const getImageData = () => {
    return profileImages
      .filter(img => img !== null)
      .map((img, index) => {
        if (img!.isExisting && img!.originalDisplayOrder) {
          return {
            imageUrl: img!.url,
            displayOrder: img!.originalDisplayOrder,
            imageId: img!.imageId,
          }
        } else {
          return {
            imageUrl: img!.url,
            displayOrder: index + 1,
          }
        }
      })
  }

  return {
    profileImages,
    handleImageDelete,
    handleImageUpload,
    getImageUrls,
    getImageData,
  }
}