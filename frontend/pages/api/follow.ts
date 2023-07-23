import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const {userId} = req.body;
    const {currentUser} = await serverAuth(req,res);

    if(!userId || typeof userId !== 'string'){
        throw new Error('[Follow] Id Invalido')
    }

    const user = await prisma?.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user){
        throw new Error('[follow] ID invalido')
    }

    let updatedFollowingsIds = [...(user.followingIds || [])];

    if(req.method === 'POST'){
        updatedFollowingsIds.push(userId)

        try {
          await prisma.notification.create({
            data: {
              body: "Alguien te sigue",
              userId
            },
          });

          await prisma.user.update({
            where: {id: userId},
            data: {hasNotifications: true}
          })
        } catch (error) {
          console.log("[follow] Error", error);
        }

    }

    if(req.method === "DELETE"){
        updatedFollowingsIds = updatedFollowingsIds.filter(followingID => followingID !== userId)
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            followingIds: updatedFollowingsIds
        }
    });

    return res.status(200).json(updatedUser)

  } catch (error) {
    console.log('[follow] Error', error);
    return res.status(400).end();
  }
}
