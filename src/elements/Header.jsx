import { Link } from "react-router-dom";
import { clearCreate } from "../redux/slices/cardSlice";
import { useDispatch } from "react-redux";
import "./Header.css"


export function Header() {
    const dispatch = useDispatch();
    return (
        <div className="header">
            <Link to="/">
            <button>Feed</button>
            </Link>
            <Link to="/createPost" onClick={() => dispatch(clearCreate())}>
            <button>Create</button>
            </Link>
            <div className="userAvatar"></div>
        </div>
    )
}