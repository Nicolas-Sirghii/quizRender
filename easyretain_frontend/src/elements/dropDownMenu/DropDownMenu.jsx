import { Link } from "react-router-dom";
import "./DropDown.css"
import { useDispatch, useSelector } from "react-redux"
import { setDropDownMenu } from "../../redux/slices/cardSlice"

export function DropDown() {
    const { dropDownMenu } = useSelector((state) => state.card_state);

    const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("api")
    localStorage.removeItem("neonverseUser")
    localStorage.removeItem("expires_at")
    localStorage.removeItem("userCards")
    localStorage.removeItem("changes_made")

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);


  };
    

    const dispatch = useDispatch();
    return (
        <div onClick={() => dispatch(setDropDownMenu())} className={dropDownMenu ? "menu open" : "menu"}>

             
            <Link to="/profile">
                Profile
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
            </Link>
            <Link to="/">
                Settings
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                    <path d="M19.4 12.9c0-.3 0-.5-.1-.8l2.1-1.6-2-3.5-2.5 1c-.4-.3-.9-.6-1.4-.8L15 3h-6l-.5 2.2c-.5.2-1 .5-1.4.8l-2.5-1-2 3.5 2.1 1.6c0 .3-.1.5-.1.8s0 .5.1.8l-2.1 1.6 2 3.5 2.5-1c.4.3.9.6 1.4.8L9 21h6l.5-2.2c.5-.2 1-.5 1.4-.8l2.5 1 2-3.5-2.1-1.6c0-.3.1-.5.1-.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5 15.5 10.1 15.5 12 13.9 15.5 12 15.5z" />
                </svg>

            </Link>
            <Link to="/login">
                Login/Register
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                    <path d="M10 17v-2h4v-2h-4v-2l-5 3 5 3zm9-13H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                </svg>

            </Link>
            <Link onClick={logout}>
                Logout
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-9H8c-1.1 0-2 .9-2 2v4h2V6h11v12H8v-4H6v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                </svg>
            </Link>


        </div>

    )
}