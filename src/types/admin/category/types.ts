export interface TCategory {
  id: string;
  name: string;
  description?: string | null;
  parentId: string | null;
  dealType: string;
  propertyType?: string | null;
  mainCategory?: string | null;
}

export interface TMainCategoriesResponse {
  message: string;
  data: {
    id: string;
    dealType: string;
    mainCategory: string | null;
    name: string;
    description: string | null;
    parentId: string | null;
    isRegion: boolean;
    createdAt: string;
    updatedAt: string;
    children: {
      id: string;
      dealType: string;
      mainCategory: string;
      name: string;
      description: string | null;
      parentId: string;
      isRegion: boolean;
      createdAt: string;
      updatedAt: string;
      propertyType?: string;
    }[];
  }[];
}

export interface TRegionResponse {
  message: string;
  data: {
    name: string;
    description: string | null;
    children: {
      id: string;
      dealType: string;
      name: string;
      description: string | null;
      parentId: string;
      isRegion: boolean;
      createdAt: string;
      updatedAt: string;
      propertyType?: string;
      mainCategory?: string;
      _count: {
        estates: number;
      };
    }[];
  };
}

export interface TMutateRegion {
  id?: string;
  name: string;
  description: string;
  parentId: string;
  isRegion: boolean;
  DealType: string;
  MainCategory: string;
  PropertyType: string;
}
