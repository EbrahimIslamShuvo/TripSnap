import mongoose from "mongoose";
import { IPlace } from "./Place.interface";
export declare const Place: mongoose.Model<IPlace, {}, {}, {}, mongoose.Document<unknown, {}, IPlace, {}, mongoose.DefaultSchemaOptions> & IPlace & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IPlace>;
//# sourceMappingURL=Place.model.d.ts.map