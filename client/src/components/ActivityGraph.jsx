import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from '../utils/axios';

const ActivityGraph = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchMonthlyStats = async () => {
            try {
                const { data } = await axios.get('/admin/stats/monthly');
                setData(data);
            } catch (error) {
                console.error("Error fetching monthly stats:", error);
            }
        };
        fetchMonthlyStats();
    }, []);

    if (!data.length) return <div className="flex items-center justify-center h-full text-gray-400">Loading graph data...</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#e5e7eb' }}
                />
                <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" name="Signups" />
                <Area type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" name="Appointments" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ActivityGraph;
