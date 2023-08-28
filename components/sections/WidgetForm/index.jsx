import { useState } from "react";
import { SendFeedback } from "./Steps/SendFeedback";
import { FeedbackSent } from "./Steps/FeedbackSent";

export function WidgetForm({ data }) {
  const [feedbackSent, setRestartFeedback] = useState(false);

  const setFeedbackSent = () => {
    setRestartFeedback(true);
    window.open(data.formLink);
  };

  return (
    <div className="bg-[#c0b3c5] p-4 relative mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
      {feedbackSent ? (
        <FeedbackSent
          buttonText={data.feedbackSentButtonText}
          title={data.feedbackSentText}
          setRestartFeedback={setRestartFeedback}
        />
      ) : (
        <SendFeedback
          feedback={data.sendFeedbackButtonText}
          setFeedbackSent={setFeedbackSent}
          title={data.sendFeedbackText}
        />
      )}

      <footer className="text-xs text-neutral-400"></footer>
    </div>
  );
}
