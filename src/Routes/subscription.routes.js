import { Router } from 'express';
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscriptions.controllers.js"

import {jwtverify} from "../Middlewares/auth.middleware.js"

const router = Router();
router.use(jwtverify); // Apply verifyJWT middleware to all routes in this file

router.route('/:channelId')
.post(toggleSubscription)
.get(getUserChannelSubscribers);

router.route('/:subscriberId').get(getSubscribedChannels);

export default router;