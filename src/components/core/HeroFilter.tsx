import type {Hero} from "../../types/Hero";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import {useSearchParams} from "react-router-dom";
function HeroFilter({heroes} : {heroes: Hero[]}) {
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [heroId, setHeroId] = useState(searchParams.get("hero") || null);
  const [heroName, setHeroName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
  if (heroId) {
    const h = heroes.find(h => h._id === heroId);
    setHeroName(h?.name || null);
  }
}, [heroId, heroes]);
  const handleHeroSelect = (id: string, name: string) => {
    setHeroId(id);
    setHeroName(name);
    setDropdownOpen(false);
    setSearchParams({ ...Object.fromEntries(searchParams), hero: id });
  }
  return (
   <div className="cursor-pointer relative min-w-37.5">
    <div className="flex items-center justify-between gap-2 bg-gray-100 border-slate-100 rounded-lg px-3 py-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
      <p>{heroName? heroName:"Izaberite heroja:"}</p>  
      <IoIosArrowDown className={`h-4 w-4 transition duration-200 ${dropdownOpen  ? "rotate-180" : ""}`} />
    </div>
    {dropdownOpen && (
      <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white rounded-lg shadow-lg mt-1 p-2 z-50 max-h-60 overflow-y-auto">
        {heroes.length > 0 && (heroes.map((hero) => {
          return (
            <p key={hero._id} onClick={() => handleHeroSelect(hero._id, hero.name)} className={`px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors ${heroId === hero._id && "bg-orange-100"}`}>
            {hero.name}
          </p>
        );
      }))}
      </div>
    )}
   </div>
  )
}

export default HeroFilter