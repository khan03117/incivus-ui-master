export interface IModalData {
    title?:string;
    displayComponent?:any;
    data?: any;
}

export interface BrandDetails {
    masterBrand: {
        name: string,
        id: string
    };
    productBrand:{
        name:string,
        id: string
    }[];
}

export const BRAND_SETUP_STEPS = {
    ADD_PRODCTS: "Add Products",
    ADD_BRAND_GUIDELINE : "Add Brand Guideline",
    ADD_BRAND_DETAILS: "Add Brand Details",
    EDIT_BRAND_DETAILS:'Edit Brand Details',
    Add_BRAND_PRODUCT_GUIDELINE: "Add Brand Product Guideline"
}