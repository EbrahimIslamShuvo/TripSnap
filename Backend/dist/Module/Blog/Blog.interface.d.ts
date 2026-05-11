import { Types } from "mongoose";
export interface ITable {
    title: string;
    columns: string[];
    rows: string[][];
}
export interface ISection {
    type: "text" | "image" | "table" | "day";
    title?: string;
    content?: string;
    image?: string;
    table?: ITable;
    day?: number;
}
export interface IBlog {
    title: string;
    banner: string;
    gallery: string[];
    sections: ISection[];
    createdBy: Types.ObjectId;
    places: Types.ObjectId[];
    isActive: boolean;
}
//# sourceMappingURL=Blog.interface.d.ts.map