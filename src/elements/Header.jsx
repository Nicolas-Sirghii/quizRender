import { Link } from "react-router-dom";
import { clearCreate } from "../redux/slices/cardSlice";
import { useDispatch } from "react-redux";


export function Header() {
    const dispatch = useDispatch();
    return (
        <div className="header">
            <Link to="/">Home</Link>
            <Link to="/feed">feed</Link>
            <Link to="/createPost" onClick={() => dispatch(clearCreate())}>Create post</Link>
        </div>
    )
}