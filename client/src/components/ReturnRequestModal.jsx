import React, { useRef, useState } from "react";

const ReturnRequestModal = ({ onClose, onSubmit, product, maxQuantity }) => {
  const modelRef = useRef();
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [returnQuantity, setReturnQuantity] = useState(1);

  const closeModal = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalReason = reason === "Other" ? otherReason : reason;
    if (!finalReason.trim()) {
      alert("Please provide a reason for return");
      return;
    }
    onSubmit({ reason: finalReason, returnQuantity });
  };

  const returnReasons = [
    "Wrong size ordered",
    "Product damaged/defective",
    "Not as described",
    "Changed my mind",
    "Quality issues",
    "Other",
  ];

  return (
    <div
      ref={modelRef}
      onClick={closeModal}
      className="fixed inset-0 z-[100000] backdrop-blur-[1px] bg-black/30 flex justify-center items-center"
    >
      <div className="bg-white p-8 mx-4 max-w-[576px] w-full rounded-xl shadow-[8px_8px_30px_rgba(0,0,0,0.05)]">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Request Return
        </h3>
        {product && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-600">
              {product.color}, Size: {product.size}, Qty: {product.qty}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Return Quantity (Max: {maxQuantity})
            </label>
            <input
              type="number"
              min="1"
              max={maxQuantity}
              value={returnQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= maxQuantity) {
                  setReturnQuantity(val);
                }
              }}
              className="w-full bg-gray-100 p-3 rounded-lg border-none outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Reason for Return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-100 p-3 rounded-lg border-none outline-none mb-2"
              required
            >
              <option value="">Select a reason</option>
              {returnReasons.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {reason === "Other" && (
              <textarea
                placeholder="Please specify the reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full bg-gray-100 p-3 rounded-lg border-none outline-none resize-none"
                rows="3"
                required
              />
            )}
          </div>
          <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium mb-1">Return Policy:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Returns are allowed within 7 days of delivery</li>
              <li>Product must be in original condition</li>
              <li>Refund will be processed after approval</li>
            </ul>
          </div>
          <div className="flex justify-center items-center gap-2">
            <button
              type="submit"
              className="w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm font-['League_Spartan','Poppins',sans-serif] text-[15px] bg-[#A37478] border border-[#A37478] cursor-pointer hover:bg-[#8f6367] hover:border-[#8f6367]"
            >
              Submit
            </button>
            <button
              onClick={() => onClose()}
              type="button"
              className="w-[100px] py-2.5 m-1.5 text-white font-semibold rounded-sm font-['League_Spartan','Poppins',sans-serif] text-[15px] bg-[#A37478] border border-[#A37478] cursor-pointer hover:bg-[#8f6367] hover:border-[#8f6367]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;

