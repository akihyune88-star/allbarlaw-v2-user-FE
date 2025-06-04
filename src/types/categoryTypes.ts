type Subcategory = {
  id: number
  subcategoryName: string
  isUncategorized: boolean
  categoryId: number
}

type Category = {
  id: number
  categoryName: string
  imageUrl: string
  clickedImageUrl: string
  isUncategorized: boolean
  subcategories: Subcategory[]
}

export type CategoryList = Category[]

export interface MainCategory {
  id: number
  categoryName: string
}

export interface SubCategory {
  id: number
  subcategoryName: string
}
