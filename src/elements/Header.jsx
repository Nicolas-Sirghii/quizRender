import { Link } from "react-router-dom";
import { clearCreate } from "../redux/slices/cardSlice";
import { useDispatch, useSelector} from "react-redux";
import { DropDown } from "./dropDownMenu/DropDownMenu";
import { setDropDownMenu } from "../redux/slices/cardSlice";
// import { setApi } from "../redux/slices/authSlice";
import { changePath } from "../redux/slices/pathSlice";
import "./Header.css"



export function Header() {
    const dispatch = useDispatch();
    const { path } = useSelector((state) => state.path);

    
    
    return (
        <>
        <div className="apiLink" onClick={() => dispatch(changePath())}>{path}</div>
        <div className="header">
            <Link to="/">
            <img className="logo" src="/logo.png" alt="" />
            </Link>
            <Link to="/createPost" onClick={() => dispatch(clearCreate())}>
            <button className="addPost">+</button>
            </Link>

            <Link onClick={() => dispatch(setDropDownMenu())} className="avatarWraper"><img className="Avatar" src="/userAvatar3.png"></img></Link>
             <DropDown />
        </div>
        </>
    )
}