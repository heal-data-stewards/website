import { useState } from "react";
// import thoughtImageUrl from "../assets/thought.svg";
import { SendFeedback } from "./Steps/SendFeedback";
import { FeedbackSent } from "./Steps/FeedbackSent";

export function WidgetForm({ data }) {
  const [feedback, setFeedback] = useState({
    title: "Fill in this brief survey to provide feedback",
    image: {
      // source: thoughtImageUrl,
      alt: "Fill in this brief survey to provide feedback",
    },
  });
  const [feedbackSent, setRestartFeedback] = useState(false);

  const setFeedbackSent = () => {
    setRestartFeedback(true)
    window.open('https://www.google.com')
  };

  return (
    <div className="bg-[#c0b3c5] p-4 relative mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
      {feedbackSent ? (
        <FeedbackSent
          buttonText={"Would you like to send more?"}
          title={"Thank you for your feedback!"}
          setRestartFeedback={setRestartFeedback}
        />
      ) : (
        <SendFeedback
          feedback={feedback}
          setFeedbackSent={setFeedbackSent}
          title={"Did you find this page helpful?"}
        />
      )}

      <footer className="text-xs text-neutral-400"></footer>
    </div>
  );
}
