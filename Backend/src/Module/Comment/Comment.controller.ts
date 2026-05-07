import { Request, Response } from "express";
import { CommentService } from "./Comment.service";

const createComment = async (
    req: any,
    res: Response
) => {

    try {

        const result =
            await CommentService.createComment(
                req.user.id,
                req.body,
                req.file
            );

        res.json({
            success: true,
            data: result,
        });

    } catch (err: any) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

// ================= PLACE COMMENTS =================
const getPlaceComments = async (
    req: Request,
    res: Response
) => {

    try {

        const result =
            await CommentService.getPlaceComments(
                req.params.id as string
            );

        res.json({
            success: true,
            data: result,
        });

    } catch (err: any) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

// ================= BLOG COMMENTS =================
const getBlogComments = async (
    req: Request,
    res: Response
) => {

    try {

        const result =
            await CommentService.getBlogComments(
                req.params.id as string
            );

        res.json({
            success: true,
            data: result,
        });

    } catch (err: any) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

const getMyComments = async (
    req: Request,
    res: Response
) => {

    try {

        const result =
            await CommentService.getMyComments(
                req.params.userId as string
            );

        res.json({
            success: true,
            data: result,
        });

    } catch (err: any) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

// ================= DELETE COMMENT =================
const deleteComment = async (
  req: any,
  res: Response
) => {

  try {

    console.log(req.user);

    const result =
      await CommentService.deleteComment(
        req.params.id,
        req.user.id || req.user._id
      );

    res.json(result);

  } catch (err: any) {

    console.log(err);

    res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

export const CommentController = {
    createComment,
    getPlaceComments,
    getBlogComments,
    getMyComments,
    deleteComment,
};