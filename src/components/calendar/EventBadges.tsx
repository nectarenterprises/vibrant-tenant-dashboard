
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const EventBadges: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-wrap space-x-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Rent</Badge>
      </motion.div>
      <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">Maintenance</Badge>
      </motion.div>
      <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Inspection</Badge>
      </motion.div>
      <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Other</Badge>
      </motion.div>
    </motion.div>
  );
};

export default EventBadges;
