import { Request, Response } from "express";
export declare const CommentController: {
    createComment: (req: any, res: Response) => Promise<void>;
    getPlaceComments: (req: Request, res: Response) => Promise<void>;
    getBlogComments: (req: Request, res: Response) => Promise<void>;
    getMyComments: (req: Request, res: Response) => Promise<void>;
    deleteComment: (req: any, res: Response) => Promise<void>;
};
//# sourceMappingURL=Comment.controller.d.ts.map