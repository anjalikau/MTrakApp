export interface Article {
    autoId: number; 
    // materialId?: number;
    categoryId?: number;
    unitId?: number;
    measurementId?: number;
    length?: number;
    width?: number;
    height?: number;     
    articleName: string;
    stockCode: string;
    description1: string;
    description2: string;
    proTypeId: number;
    proGroupId: number;
    catCode?: string;
    // materialCode: string;
    prodTypeCode?: string;
    subCatCode?: string;
    unitCode?: string;    
    itemType: number;    
    boardLength: number;
    boardWidth: number;
    rollWidth: number;
    colorCardId: number;
    sizeCardId: number;
    salesPrice: number;
    qtyInStock: number;
    avgCostPrice: number;
    lastCostPrice: number;
    maxCostPrice: number;
    pODate: string; 
    createUserId?: number;
    createDateTime?: string; 
}


