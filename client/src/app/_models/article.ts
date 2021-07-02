export interface Article {
    autoId: number; 
    materialId?: number;
    categoryId?: number;
    unitId?: number;
    length?: number;
    width?: number;
    height?: number;
    createUserId?: number;
    createDateTime?: string;    
    articleName: string;
    stockCode: string;
    description1: string;
    description2: string;
    proTypeId: number;
    subCatId: number;
    catCode: string;
    materialCode: string;
    rodTypeCode: string;
    subCatCode: string;
    unitCode: string;
    // itemType: number;
    // boardLength: number;
    // boardWidth: number;
    // qtyInStock: number;
    // pODate: string;   
}

