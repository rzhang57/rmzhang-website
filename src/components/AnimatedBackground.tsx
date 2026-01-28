"use client";

const blobs = [
  {
    color: "bg-pink-200/60",
    size: "w-[500px] h-[500px]",
    initialPosition: "top-[10%] left-[10%]",
    animation: "animate-blob1",
  },
  {
    color: "bg-blue-200/60",
    size: "w-[600px] h-[600px]",
    initialPosition: "top-[50%] right-[10%]",
    animation: "animate-blob2",
  },
  {
    color: "bg-purple-200/50",
    size: "w-[450px] h-[450px]",
    initialPosition: "bottom-[10%] left-[30%]",
    animation: "animate-blob3",
  },
  {
    color: "bg-orange-100/50",
    size: "w-[550px] h-[550px]",
    initialPosition: "top-[30%] left-[50%]",
    animation: "animate-blob4",
  },
  {
    color: "bg-cyan-200/40",
    size: "w-[400px] h-[400px]",
    initialPosition: "bottom-[30%] right-[20%]",
    animation: "animate-blob5",
  },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.color} ${blob.size} ${blob.initialPosition} ${blob.animation}`}
        />
      ))}
    </div>
  );
}
