import { Link } from "react-router-dom";
import { clearCreate } from "../redux/slices/cardSlice";
import { useDispatch, useSelector } from "react-redux";
import { DropDown } from "./dropDownMenu/DropDownMenu";
import { setDropDownMenu } from "../redux/slices/cardSlice";
import { changePath } from "../redux/slices/pathSlice";
import { useEffect } from "react";
import { setCards } from "../redux/slices/cardSlice";
import "./Header.css"



export function Header() {
  const dispatch = useDispatch();
  const { path } = useSelector((state) => state.path);
  const { loadingApi } = useSelector((state) => state.card_state);
 




  const LIMIT = 10;

  const fetchCards = async () => {
    const token = localStorage.getItem("jwt");

    if (localStorage.getItem("changes_made") == "0") return

    if (!token) return;

    const res = await fetch(
      `${path}/cards/feed?offset=${0}&limit=${LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    

    if (Array.isArray(data)) {
      localStorage.setItem("userCards", JSON.stringify(data));
      dispatch(setCards(data));
    }

    localStorage.setItem("changes_made", "0")
  };

  useEffect(() => {
    const getCards = () => {
      fetchCards();
    }
    getCards()
  }, [])



  return (
    <>
      <div className="apiLink" onClick={() => dispatch(changePath())}>{path}</div>
      <div className="header">
        <Link to="/">
          <img className="logo" src="/logo.png" alt="" />
        </Link>
        <Link to="/createPost" onClick={() => dispatch(clearCreate())}>
          <button className="addPost" style={{ color: loadingApi ? "red" : "green" }}>+</button>
        </Link>

        <Link onClick={() => dispatch(setDropDownMenu())} className="avatarWraper"><img className="Avatar" src="/userAvatar3.png"></img></Link>
        <DropDown />
      </div>
    </>
  )
}