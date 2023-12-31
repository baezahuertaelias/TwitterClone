import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("[like] Id Invalido");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("[like] ID invalido");
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (req.method === "POST") {
      updatedLikedIds.push(currentUser.id);

      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: "A alguien le gusto el twitt",
              userId: post.userId,
            },
          });

          await prisma.user.update({
            where: { id: post.userId },
            data: {
              hasNotifications: true,
            },
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
      
    }

    if (req.method === "DELETE") {
      updatedLikedIds = updatedLikedIds.filter(
        (likedID) => likedID !== currentUser.id
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log("[like] error", error);
    return res.status(400).end();
  }
}
