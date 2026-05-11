import { IActivity } from "./Activity.interface";
export declare const ActivityService: {
    createActivity: (payload: IActivity) => Promise<import("mongoose").Document<unknown, {}, IActivity, {}, import("mongoose").DefaultSchemaOptions> & IActivity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllActivities: () => Promise<(import("mongoose").Document<unknown, {}, IActivity, {}, import("mongoose").DefaultSchemaOptions> & IActivity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=Activity.service.d.ts.map