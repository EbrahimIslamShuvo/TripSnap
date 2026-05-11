import { Response } from "express";
export declare const placeController: {
    createPlace: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getMyPlaces: (req: any, res: Response) => Promise<void>;
    getSinglePlace: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllPlaces: (req: any, res: Response) => Promise<void>;
    approvePlace: (req: any, res: Response) => Promise<void>;
};
//# sourceMappingURL=Place.Controller.d.ts.map