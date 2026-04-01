import type {Publisher} from "../../types/Publisher";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import {useSearchParams} from "react-router-dom";
function PublisherFilter({publishers} : {publishers: Publisher[]}) {
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [publisherId, setPublisherId] = useState(searchParams.get("publisher") || null);
  const [publisherName, setPublisherName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
  if (publisherId) {
    const p = publishers.find(p => p._id === publisherId);
    setPublisherName(p?.name || null);
  }
}, [publisherId, publishers]);
  const handlePublisherSelect = (id: string, name: string) => {
    setPublisherId(id);
    setPublisherName(name);
    setDropdownOpen(false);
    setSearchParams({ ...Object.fromEntries(searchParams), publisher: id });
    
  }
  const resetPublisher = () => { 
  const params = Object.fromEntries(searchParams);
  delete params.publisher;
  setSearchParams(params);
  setPublisherId(null);
  setPublisherName(null);
  setDropdownOpen(false);
  }

  return (
   <div className="cursor-pointer relative min-w-37.5">
    <div className="flex items-center justify-between gap-2 bg-gray-100 border-slate-100 rounded-lg px-3 py-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
      <p>{publisherName? publisherName:"Izaberite izdavača:"}</p>  
      <IoIosArrowDown className={`h-4 w-4 transition duration-200 ${dropdownOpen  ? "rotate-180" : ""}`} />
    </div>
    {dropdownOpen && (
      <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white rounded-lg shadow-lg mt-1 p-2 z-50 max-h-60 overflow-y-auto">
        <p className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors" onClick={()=> resetPublisher()}>Svi izdavači</p>
        {publishers.length > 0 && (publishers.map((publisher) => {
          return (
            <p key={publisher._id} onClick={() => handlePublisherSelect(publisher._id, publisher.name)} className={`px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors ${publisherId === publisher._id && "bg-orange-100"}`}>
            {publisher.name}
          </p>
        );
      }))}
      </div>
    )}
   </div>
  )
}

export default PublisherFilter