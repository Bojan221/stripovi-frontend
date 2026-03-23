

interface AvatarProps {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  size?: "small" | "medium" | "large" | "xlarge";
}

function Avatar({firstName, lastName, profilePicture, size="medium"}: AvatarProps) {
  return (
    <div>
        {profilePicture ? (
            <img src={profilePicture} alt={`${firstName} ${lastName}`} className={`rounded-full object-cover ${size === "small" ? "w-8 h-8" : size === "medium" ? "w-12 h-12" : size === "large" ? "w-16 h-16" : "w-24 h-24"}`} />
        ) : (
          <div className={`flex items-center justify-center rounded-full bg-blue-300 text-white font-bold ${size === "small" ? "w-8 h-8 text-sm" : size === "medium" ? "w-12 h-12 text-base" : size === "large" ? "w-16 h-16 text-lg" : "w-24 h-24 text-2xl"}`}>
            {firstName[0]}
            {lastName[0]}
          </div>
        )}  
    </div>
  )
}

export default Avatar