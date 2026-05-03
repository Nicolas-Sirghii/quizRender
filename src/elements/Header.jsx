import { Link } from "react-router-dom";
import { clearCreate } from "../redux/slices/cardSlice";
import { useDispatch } from "react-redux";
import { DropDown } from "./dropDownMenu/DropDownMenu";
import { setDropDownMenu } from "../redux/slices/cardSlice";
import "./Header.css"



export function Header() {
    const dispatch = useDispatch();
    return (
        <div className="header">
            <Link to="/">
            <img className="logo" src="../../public/logo.png" alt="" />
            </Link>
            <Link to="/createPost" onClick={() => dispatch(clearCreate())}>
            <button className="addPost">+</button>
            </Link>
            <Link onClick={() => dispatch(setDropDownMenu())} className="avatarWraper"><img className="Avatar" src="../../public/userAvatar3.png"></img></Link>
             <DropDown />
        </div>
    )
}