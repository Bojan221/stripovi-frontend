interface AvatarProps {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  size?: "small" | "xs" | "medium" | "large" | "xlarge";
  className?: string;
}
const API_URL = import.meta.env.VITE_API_URL;
function Avatar({firstName, lastName, profilePicture, size="medium", className=""}: AvatarProps) { 
  const imageUrl = profilePicture?.startsWith('blob:') ? profilePicture : profilePicture ? `${API_URL}${profilePicture}` : undefined;
  
  return (
    <div>
        {imageUrl ? (
            <img src={imageUrl} alt={`${firstName} ${lastName}`} className={`rounded-full object-cover ${size === "small" ? "w-8 h-8" : size === "xs" ? "w-10 h-10" : size === "medium" ? "w-12 h-12" : size === "large" ? "w-16 h-16" : "w-24 h-24"}`} />
        ) : (
          <div className={`flex items-center justify-center rounded-full bg-blue-300 text-white font-bold ${size === "small" ? "w-8 h-8 text-sm" : size === "xs" ? "w-10 h-10 text-xs" : size === "medium" ? "w-12 h-12 text-base" : size === "large" ? "w-16 h-16 text-lg" : "w-24 h-24 text-2xl"} ${className}`}>
            {firstName[0]}
            {lastName[0]}
          </div>
        )}  
    </div>
  )
}

export default Avatar