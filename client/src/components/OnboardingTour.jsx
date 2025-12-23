
import { useEffect, useContext } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import AuthContext from '../context/AuthContext';
import axios from '../utils/axios';

const OnboardingTour = () => {
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    // If no user or already seen, do nothing
    if (!user || user.hasSeenOnboarding) {
        return;
    }

    // Define steps based on role
    const steps = [];
    
    // Welcome Step (Generic)
    steps.push({
        element: '#tour-dashboard-title',
        popover: {
            title: 'Welcome to ConsultPro! 👋',
            description: 'We are thrilled to have you. Let’s take a quick tour to get you started.',
            side: "bottom",
            align: 'start'
        }
    });

    if (user.roles.includes('expert')) {
        // Expert Specific Steps
        steps.push({
            element: '#tour-dashboard-title',
            popover: {
                title: 'Your Command Center',
                description: 'This is your Dashboard where you can manage upcoming appointments and track your schedule.',
                side: "bottom"
            }
        });
        
    } else {
        // Customer Specific Steps
        steps.push({
            element: '#tour-experts-link',
            popover: {
                title: 'Find Experts',
                description: 'Browse our list of verified experts to find the perfect mentor for your needs.',
                side: "bottom"
            }
        });
        
        steps.push({
            element: '#tour-dashboard-title',
            popover: {
                title: 'Manage Sessions',
                description: 'Track your booked sessions, join calls, and view status updates here.',
                side: "bottom"
            }
        });
    }

    // Common Ending Steps
    steps.push({
        element: '#tour-profile-menu',
        popover: {
            title: 'Profile & Settings',
            description: 'Update your profile, change settings, or logout from here.',
            side: "left"
        }
    });

    // Initialize Driver
    const driverObj = driver({
        showProgress: true,
        steps: steps,
        onDestroyed: async () => {
            // Mark as seen when tour ends or is skipped
            if (user && !user.hasSeenOnboarding) {
                try {
                    const { data } = await axios.put('/auth/onboarding-seen');
                    // Update local user state so it doesn't show again
                    // preserving other fields
                    updateUser({ ...user, hasSeenOnboarding: true });
                } catch (err) {
                    console.error("Failed to mark onboarding as seen:", err);
                }
            }
        }
    });

    // Start the tour
    driverObj.drive();

  }, [user]); // Run when user loads

  return null; // This component renders nothing visual itself
};

export default OnboardingTour;
