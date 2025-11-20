import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";

const WhatsAppButton = ({
    phoneNumber = "919304978001",
    message = "Hi! I'm interested in TiaraSteps products. Can you help me?",
    className = "",
    showIcon = "whatsapp", // DEFAULT
    variant = "floating",
    showTooltip = true,
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const IconComponent = showIcon === "phone" ? Phone : MessageCircle;

  if (variant === "floating") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {showTooltip && showTooltipState && (
          <div className="absolute bottom-16 right-0 mb-2 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
            Need help? Chat with us!
            <div className="absolute top-full right-4 h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        )}
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
          className={`flex items-center gap-3 rounded-full border-2 border-green-500 bg-white px-4 py-2 text-black shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 ${className}`}
          title="Chat with us on WhatsApp"
          aria-label="Chat with us on WhatsApp"
        >
          <IconComponent className="h-6 w-6 text-green-500" />
          <span className="text-sm font-semibold">Chat with us</span>
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`flex min-w-[200px] items-center justify-center gap-3 rounded-lg bg-green-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-xl ${className}`}
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <IconComponent className="h-6 w-6" />
        <span>Chat with us</span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-green-600 ${className}`}
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <IconComponent className="h-6 w-6" />
      </button>
    );
  }

  return null;
};

export default WhatsAppButton;

