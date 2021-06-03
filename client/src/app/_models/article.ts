export interface Article {
    autoId: number;
    name: string;
    code?: string;
    materialId?: number;
    categoryId?: number;
    unitId?: number;
    length?: number;
    width?: number;
    height?: number;
    createUserId?: number;
    createDateTime?: string;
}

