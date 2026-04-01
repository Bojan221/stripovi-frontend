import type { Hero } from "../types/Hero"
import type { Publisher } from "../types/Publisher"
import type { Edition } from "../types/Edition"
import Popup from "./core/Popup"
interface PopupProps{ 
    heroes: Hero[];
    publishers:Publisher[];
    editions: Edition[];
    onClose: ()=> void;
}

function ComicActionPopup({heroes,publishers,editions,onClose}: PopupProps) {
  return (
    <Popup title="Dodaj Strip" buttonText="Kreiraj" onClose={()=> onClose()} onConfirm={()=>onClose()}>
        <div>Radi</div>
    </Popup>
  )
}

export default ComicActionPopup