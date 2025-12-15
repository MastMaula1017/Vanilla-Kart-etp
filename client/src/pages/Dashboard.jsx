import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('/appointments');
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      // Refresh list locally
      setAppointments(appointments.map(app => 
         app._id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Your Appointments</h2>
        
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">With</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map(app => {
                  const isMyAppointmentAsCustomer = app.customer?._id === user._id;
                  const counterpart = isMyAppointmentAsCustomer ? app.expert : app.customer;
                  // const counterpartLabel = isMyAppointmentAsCustomer ? 'Expert' : 'Customer';  // Unused now as we use generic "With"

                  return (
                  <tr key={app._id}>
                    <td className="p-4">
                      <div className="font-semibold">{new Date(app.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{app.startTime} - {app.endTime}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {counterpart?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                         {counterpart?.email || 'No email'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                       {/* Chat Button */}
                       <Link 
                         to={`/chat/${counterpart?._id}`}
                         className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 text-sm"
                       >
                         Chat
                       </Link>

                       {/* Expert Actions */}
                       {user.roles?.includes('expert') && app.status === 'pending' && (
                         <>
                           <button 
                             onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                           >
                             Accept
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                             className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                           >
                             Decline
                           </button>
                         </>
                       )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
