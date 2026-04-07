import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl mb-8"
        >
          🔎
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          أصل الحكاية
        </h1>

        <p className="text-lg text-muted-foreground mb-2">
          لعبة تأطير المشكلات
        </p>

        <div className="w-16 h-0.5 bg-primary mx-auto my-6 rounded-full" />

        <p className="text-muted-foreground leading-relaxed mb-10 text-base">
          مش كل مشكلة هي اللي بتبان على السطح.
          <br />
          مهمتك تسأل الأسئلة الصح عشان توصل للحقيقة.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="bg-primary text-primary-foreground px-10 py-4 rounded-lg text-lg font-semibold transition-all hover:opacity-90"
        >
          ابدأ المهمة
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartScreen;
