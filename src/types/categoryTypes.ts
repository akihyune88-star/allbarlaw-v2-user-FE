type Subcategory = {
  id: number
  subcategoryName: string
}

type Category = {
  id: number
  categoryName: string
  subcategories: Subcategory[]
}

export type CategoryList = Category[]
