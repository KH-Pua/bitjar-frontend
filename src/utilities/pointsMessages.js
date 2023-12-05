import { formatDate } from "./formatting";

const dailyLoginPoints = () => {
  const date = new Date();
  return {
    actionName: `Daily Login for ${formatDate(date)}`,
    pointsAllocated: 5,
  };
};

export { dailyLoginPoints };
