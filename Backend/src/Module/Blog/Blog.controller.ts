import { Request, Response } from "express";
import { BlogService } from "./Blog.service";
import { ActivityService } from "../Activity/Activity.service";

const createBlog = async (req: any, res: Response) => {
    try {
        const files = req.files as any;

        const banner = files?.banner?.[0]?.path;

        const gallery =
            files?.gallery?.map((f: any) => f.path) || [];

        const sectionImages = files?.sectionImages || [];

        // 🔥 PARSE SECTIONS
        let sections = JSON.parse(req.body.sections);

        let imgIndex = 0;

        // 🔥 MAP IMAGES
        sections = sections.map((sec: any) => {
            if (sec.type === "image") {
                sec.image = sectionImages[imgIndex]?.path || "";
                imgIndex++;
            }
            return sec;
        });

        // 🔥 PLACES
        let places: string[] = [];

        if (req.body.places) {
            places = JSON.parse(req.body.places);
        }

        // 🔥 CREATE BLOG
        const result = await BlogService.createBlog({
            title: req.body.title,
            banner,
            gallery,
            sections,
            places,
            createdBy: req.user.id,
            isActive: true,
        });

        // =========================
        // ADD ACTIVITY HERE
        // =========================
        await ActivityService.createActivity({
            user: req.user.id,
            type: "BLOG",
            message: `${req.user.name} created a blog`,
            blog: result._id,
        });

        // 🔥 RESPONSE
        res.json({
            success: true,
            message: "Blog created ✅",
            data: result,
        });

    } catch (err: any) {
        console.log("ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllBlogs = async (req: Request, res: Response) => {
    const result = await BlogService.getAllBlogs();

    res.json({
        success: true,
        data: result,
    });
};

const getSingleBlog = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
        });
    }

    const result = await BlogService.getSingleBlog(id);

    res.json({
        success: true,
        data: result,
    });
};

const getMyBlogs = async (req: any, res: Response) => {
    const result = await BlogService.getMyBlogs(req.user.id);

    res.json({
        success: true,
        data: result,
    });
};

export const toggleBlogStatusController = async (req: any, res: Response) => {
    try {
        const result = await BlogService.toggleBlogStatus(req.params.id);

        res.json({
            success: true,
            message: "Status updated",
            data: result,
        });
    } catch (er) {
        res.status(400).json({
            success: false,
            message: er instanceof Error ? er.message : "Error toggling status",
        });
    }
};

export const blogController = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    getMyBlogs,
    toggleBlogStatusController
};