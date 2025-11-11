const HeroBanner = () => {
  return (
    <div className="w-full bg-gradient-to-br from-[#d4b5b5] to-[#c9a9a9] py-1 px-4 flex justify-center items-center min-h-[38px] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08)_0%,transparent_50%)] before:pointer-events-none max-[768px]:min-h-[34px] max-[768px]:py-1 max-[768px]:px-3.5 max-[480px]:min-h-8 max-[480px]:py-1 max-[480px]:px-2.5">
      <div className="relative z-10 max-w-[1200px] w-full text-center">
        <h1 className="text-[clamp(0.8rem,1.6vw,1rem)] font-normal text-[#3b2a2a] m-0 tracking-[0.3px] font-['Georgia','Times_New_Roman',serif] leading-[1.2] max-[768px]:text-[0.9rem] max-[480px]:text-[0.85rem] max-[480px]:tracking-[0.2px]">Redefining Comfort with a Touch of Royalty</h1>
      </div>
    </div>
  );
};

export default HeroBanner;