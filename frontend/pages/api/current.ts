import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log('llamaron por api a current');
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {

    
    const {currentUser} = await serverAuth(req, res);

    //console.log('algo que hace el currentuser', currentUser);
    
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log("error current", error);

    return res.status(400).end();
  }
}
