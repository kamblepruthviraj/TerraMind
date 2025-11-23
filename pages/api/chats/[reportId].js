import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Report from '@/models/Report';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { reportId } = req.query;
    await dbConnect();

    // Verify access
    const report = await Report.findById(reportId);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    const isParticipant =
        report.farmerId.toString() === session.user.id ||
        report.counsellorId?.toString() === session.user.id;

    const isAdmin = session.user.role === 'admin';

    if (!isParticipant && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view/chat in this report' });
    }

    if (req.method === 'GET') {
        try {
            const chat = await Chat.findOne({ reportId });
            res.status(200).json(chat ? chat.messages : []);
        } catch (error) {
            console.error('Fetch chat error:', error);
            res.status(500).json({ message: 'Error fetching chat' });
        }
    } else if (req.method === 'POST') {
        if (!isParticipant) {
            return res.status(403).json({ message: 'Only participants can send messages' });
        }

        try {
            const { text } = req.body;

            let chat = await Chat.findOne({ reportId });

            if (!chat) {
                chat = new Chat({ reportId, messages: [] });
            }

            chat.messages.push({
                senderId: session.user.id,
                text,
                timestamp: new Date(),
            });

            await chat.save();
            res.status(201).json(chat.messages);
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ message: error.message || 'Error processing request' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
