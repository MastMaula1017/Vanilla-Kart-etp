import { Marquee } from "@/components/magicui/marquee";

const companies = [
  { name: "Google", color: "text-blue-500" },
  { name: "Microsoft", color: "text-blue-600" },
  { name: "Spotify", color: "text-green-500" },
  { name: "Amazon", color: "text-orange-500" },
  { name: "Netflix", color: "text-red-600" },
  { name: "Adobe", color: "text-red-500" },
  { name: "Meta", color: "text-blue-600" },
  { name: "Shopify", color: "text-green-600" }
];

const BrandTicker = () => {
  return (
    <div className="py-8 bg-white border-y border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800">
      <p className="text-center text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider dark:text-gray-400">
        Trusted by professionals from
      </p>
      <Marquee className="[--duration:20s] [--gap:3rem]">
        {companies.map((company) => (
          <div key={company.name} className="flex items-center gap-2 px-4">
             <span className={`text-2xl font-bold opacity-70 hover:opacity-100 transition-opacity cursor-default ${company.color}`}>
               {company.name}
             </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default BrandTicker;
