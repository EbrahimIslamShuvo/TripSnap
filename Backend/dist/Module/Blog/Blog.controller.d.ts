import { Request, Response } from "express";
export declare const toggleBlogStatusController: (req: any, res: Response) => Promise<void>;
export declare const blogController: {
    createBlog: (req: any, res: Response) => Promise<void>;
    getAllBlogs: (req: Request, res: Response) => Promise<void>;
    getSingleBlog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getMyBlogs: (req: any, res: Response) => Promise<void>;
    toggleBlogStatusController: (req: any, res: Response) => Promise<void>;
    getBlogsByPlaces: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getBlogsByPlace: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateBlog: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getBlogsByAuthor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=Blog.controller.d.ts.map