import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Report from '@/models/Report';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    if (req.method === 'GET') {
        try {
            // Fetch all counsellors
            const counsellors = await User.find({ role: 'counsellor' }).select('name email phone');

            // Fetch stats for each counsellor
            const counsellorsWithStats = await Promise.all(counsellors.map(async (c) => {
                const resolvedCount = await Report.countDocuments({ counsellorId: c._id, status: 'resolved' });
                const assignedReports = await Report.find({ counsellorId: c._id, status: 'assigned' }).select('title');

                return {
                    ...c.toObject(),
                    resolvedCount,
                    assignedReports: assignedReports.map(r => r.title),
                };
            }));

            res.status(200).json(counsellorsWithStats);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
