import { Navbar } from "./components/Navbar";
import { ResponsiveLayout } from "./components/ResponsiveLayout";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ResponsiveLayout />
      </div>
    </div>
  );
}
