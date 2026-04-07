interface QuestionCounterProps {
  remaining: number;
  total: number;
}

const QuestionCounter = ({ remaining, total }: QuestionCounterProps) => {
  const used = total - remaining;

  return (
    <div className="flex items-center gap-3" dir="rtl">
      <span className="text-sm text-muted-foreground">الأسئلة:</span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < used ? 'bg-primary/30' : 'bg-primary'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">
        {remaining} متبقي
      </span>
    </div>
  );
};

export default QuestionCounter;
