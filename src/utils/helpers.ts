export const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return 'yellow';
    case 'in-progress': return 'blue';
    case 'completed': return 'green';
    case 'missed': return 'red';
    default: return 'gray';
  }
};