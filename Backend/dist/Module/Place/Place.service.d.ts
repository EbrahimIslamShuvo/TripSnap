export declare const PlaceService: {
    createPlace: (payload: any, user: any, files: any) => Promise<import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    approvePlace: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=Place.service.d.ts.map