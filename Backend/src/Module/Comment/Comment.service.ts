import { Comment } from "./Comment.model";

const createComment = async (
  userId: string,
  payload: any,
  file?: any
) => {

  const comment = await Comment.create({
    user: userId,

    place: payload.place,

    blog: payload.blog,

    text: payload.text,

    image: file?.path,
  });

  return comment;
};

// ================= GET PLACE COMMENTS =================
const getPlaceComments = async (
  placeId: string
) => {

  return await Comment.find({
    place: placeId,
  })
    .populate("user")
    .sort({ createdAt: -1 });
};

// ================= GET BLOG COMMENTS =================
const getBlogComments = async (
  blogId: string
) => {

  return await Comment.find({
    blog: blogId,
  })
    .populate("user")
    .sort({ createdAt: -1 });
};

const getMyComments = async (userId: string) => {

  const comments = await Comment.find({
    user: userId,
  })
    .populate("place")
    .populate("blog")
    .sort({ createdAt: -1 });

  return comments;
};

// ================= DELETE COMMENT =================
const deleteComment = async (
  commentId: string,
  userId: string
) => {

  const comment =
    await Comment.findById(
      commentId
    );

  if (!comment) {
    throw new Error(
      "Comment not found"
    );
  }

  if (
    String(comment.user) !==
    String(userId)
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  await Comment.findByIdAndDelete(
    commentId
  );

  return {
    success: true,
    message:
      "Comment deleted successfully",
  };
};

export const CommentService = {
  createComment,
  getPlaceComments,
  getBlogComments,
  getMyComments,
  deleteComment,
};