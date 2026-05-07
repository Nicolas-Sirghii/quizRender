import { Link } from "react-router-dom";
import "./DropDown.css"
import { useDispatch, useSelector } from "react-redux"
import { setDropDownMenu } from "../../redux/slices/cardSlice"

export function DropDown() {
    const { dropDownMenu } = useSelector((state) => state.card_state);
    const { is_loged_in } = useSelector((state) => state.path);

    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("api")
        localStorage.removeItem("neonverseUser")
        localStorage.removeItem("expires_at")
        localStorage.removeItem("userCards")
        localStorage.removeItem("changes_made")
        localStorage.removeItem("is_user_loged_in")

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);


    };

    
    const dispatch = useDispatch();
    return (
        <div onClick={() => dispatch(setDropDownMenu())} className={dropDownMenu ? "menu open" : "menu"}>



            {!is_loged_in &&
                <Link to="/register">
                    Register
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                        <path d="M15 14c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5zM6 10V7H4v3H1v2h3v3h2v-3h3v-2H6z" />
                    </svg>
                </Link>
            }
            {!is_loged_in &&
                <Link to="/login">
                    Login
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                        <path d="M10 17l6-5-6-5v3H4v4h6v3zm9-13H8c-1.1 0-2 .9-2 2v4h2V6h11v12H8v-4H6v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                </Link>

            }
            {is_loged_in &&
                <Link to="/profile">
                    Profile
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                </Link>
            }

            <Link to="/">
                Settings
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.94 3.1l-1.7-.98c-.1-.3-.2-.6-.35-.88l.98-1.7-1.73-1.73-1.7.98c-.28-.15-.58-.26-.88-.35l-.98-1.7h-2.46l-.98 1.7c-.3.09-.6.2-.88.35l-1.7-.98-1.73 1.73.98 1.7c-.15.28-.26.58-.35.88l-1.7.98v2.46l1.7.98c.09.3.2.6.35.88l-.98 1.7 1.73 1.73 1.7-.98c.28.15.58.26.88.35l.98 1.7h2.46l.98-1.7c.3-.09.6-.2.88-.35l1.7.98 1.73-1.73-.98-1.7c.15-.28.26-.58.35-.88l1.7-.98v-2.46z" />
                </svg>

            </Link>

            {is_loged_in &&
                <Link onClick={logout}>
                    Logout
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                        <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-9H8c-1.1 0-2 .9-2 2v4h2V6h11v12H8v-4H6v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                </Link>
            }





        </div>

    )
}








