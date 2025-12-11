import { APP } from "@/variables/globals";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span>{APP?.NAME}</span>
          </div>
          <p className="text-sm">
            {`Organizing the world's knowledge into personalized learning paths,
            powered by AI.`}
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Pricing (Coming Soon)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
        © {new Date().getFullYear()} Pathfinder.ai. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
