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
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-2xl">
                                    <p className="text-gray-900 dark:text-white font-bold mb-2">{label}</p>
                                    {payload.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-gray-600 dark:text-gray-300 capitalize">{entry.name}:</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name="Signups"
                    animationDuration={2000}
                />
                <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorApps)" 
                    name="Appointments"
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ActivityGraph;
