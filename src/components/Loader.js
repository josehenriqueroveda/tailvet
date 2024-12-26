import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { dotWave } = await import("ldrs");
      dotWave.register();
    }
    getLoader();
  }, []);
  return (
    <div className="space-x-2">
      <span className="text-gray-200 text-lg font-medium">Loading </span>
      <l-dot-wave size="32" speed="1" color="#f3f4f6"></l-dot-wave>
    </div>
  );
}
