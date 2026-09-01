import express from "express";

import { getAllChatsController,getChatController,sendChatController,deleteChatController } from "../controllers/chatController.js";
const router = express.Router();

router.get( "/", getAllChatsController);

router.get( "/:chatId",getChatController);

router.delete( "/:chatId",deleteChatController);

router.post("/",sendChatController);

export default router;