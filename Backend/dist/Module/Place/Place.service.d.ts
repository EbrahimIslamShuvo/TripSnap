export declare const PlaceService: {
    createPlace: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyPlaces: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    approvePlace: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getSinglePlace: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAllPlaces: () => Promise<(import("mongoose").Document<unknown, {}, import("./Place.interface").IPlace, {}, import("mongoose").DefaultSchemaOptions> & import("./Place.interface").IPlace & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=Place.service.d.ts.map