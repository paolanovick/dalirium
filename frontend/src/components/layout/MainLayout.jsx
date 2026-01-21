import TopNav from "./TopNav";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 text-white">
      <TopNav />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
