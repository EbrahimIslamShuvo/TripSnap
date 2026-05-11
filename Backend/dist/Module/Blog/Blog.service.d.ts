import { Types } from "mongoose";
export declare const BlogService: {
    createBlog: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllBlogs: () => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getSingleBlog: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyBlogs: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleBlogStatus: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getBlogsByPlaceFromDB: (placeId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBlogsByPlacesFromDB: (placeIds: string[]) => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateBlog: (id: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getBlogsByAuthorService: (authorId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Blog.interface").IBlog, {}, import("mongoose").DefaultSchemaOptions> & import("./Blog.interface").IBlog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=Blog.service.d.ts.map