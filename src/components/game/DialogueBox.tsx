import { motion } from 'framer-motion';

interface DialogueBoxProps {
  clientName: string;
  text: string;
}

const DialogueBox = ({ clientName, text }: DialogueBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-xl p-5 md:p-6"
      dir="rtl"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
          👤
        </div>
        <span className="font-bold text-foreground">{clientName}</span>
      </div>
      <p className="text-foreground/90 leading-relaxed text-base">{text}</p>
    </motion.div>
  );
};

export default DialogueBox;
