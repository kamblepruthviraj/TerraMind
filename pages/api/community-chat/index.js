import dbConnect from '@/lib/mongodb';
import CommunityMessage from '@/models/CommunityMessage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                // Fetch last 50 messages, sorted by timestamp ascending
                const messages = await CommunityMessage.find({})
                    .sort({ timestamp: -1 })
                    .limit(50);

                // Reverse to show oldest first in chat
                res.status(200).json({ success: true, data: messages.reverse() });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'POST':
            try {
                const session = await getServerSession(req, res, authOptions);
                if (!session) {
                    return res.status(401).json({ success: false, message: 'Unauthorized' });
                }

                const { text } = req.body;
                if (!text) {
                    return res.status(400).json({ success: false, message: 'Message text is required' });
                }

                const message = await CommunityMessage.create({
                    text,
                    senderUid: session.user.id,
                    senderName: session.user.name,
                });

                res.status(201).json({ success: true, data: message });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
