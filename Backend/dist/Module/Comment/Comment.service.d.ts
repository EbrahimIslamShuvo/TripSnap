export declare const CommentService: {
    createComment: (userId: string, payload: any, file?: any) => Promise<import("mongoose").Document<unknown, {}, import("./Comment.interface").IComment, {}, import("mongoose").DefaultSchemaOptions> & import("./Comment.interface").IComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPlaceComments: (placeId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Comment.interface").IComment, {}, import("mongoose").DefaultSchemaOptions> & import("./Comment.interface").IComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBlogComments: (blogId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Comment.interface").IComment, {}, import("mongoose").DefaultSchemaOptions> & import("./Comment.interface").IComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMyComments: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./Comment.interface").IComment, {}, import("mongoose").DefaultSchemaOptions> & import("./Comment.interface").IComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteComment: (commentId: string, userId: string) => Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=Comment.service.d.ts.map