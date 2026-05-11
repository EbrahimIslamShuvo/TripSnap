import mongoose from "mongoose";
import { IComment } from "./Comment.interface";
export declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
//# sourceMappingURL=Comment.model.d.ts.map