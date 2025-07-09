import { useEffect } from 'react';
import io from 'socket.io-client';

// Create socket connection to the /rewards namespace
const socket = io('http://localhost:3000/rewards', {
  transports: ['websocket'],
});

function RewardListener() {
  useEffect(() => {
    // Log connection success
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket:', socket.id);
    });

    // Log all incoming socket events
    socket.onAny((event, data) => {
      console.log(`🔔 Event: ${event}`, data);
    });

    // Handle specific reward update event
    socket.on('reward-update', (data) => {
      console.log('🎉 Live Reward Update:', data);
    });

    // Log disconnection
    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('reward-update');
      socket.off('disconnect');
      socket.offAny();
    };
  }, []);

  return <div>🔔 Listening for live reward updates...</div>;
}

export default RewardListener;
