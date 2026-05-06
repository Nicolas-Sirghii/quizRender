from fastapi import APIRouter, Header, HTTPException, Query
import jwt

from credentials.credentials import sql_conn, secret_key

feed = APIRouter()

SECRET_KEY = secret_key()


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@feed.get("/cards/feed")
async def get_feed(
    offset: int = Query(0),
    limit: int = Query(10),
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user_id = get_current_user(token)

    db = sql_conn()
    cursor = db.cursor(dictionary=True)

    # -----------------------------
    # 1. GET CARDS (sorted + paginated)
    # -----------------------------
    cursor.execute("""
        SELECT *
        FROM cards
        WHERE user_id = %s
        ORDER BY (right_count - wrong_count), created_at DESC
        LIMIT %s OFFSET %s
    """, (user_id, limit, offset))

    cards = cursor.fetchall()

    if not cards:
        return []

    card_ids = [c["id"] for c in cards]

    # -----------------------------
    # 2. GET RECTS
    # -----------------------------
    format_strings = ",".join(["%s"] * len(card_ids))

    cursor.execute(f"""
        SELECT *
        FROM card_rects
        WHERE card_id IN ({format_strings})
    """, tuple(card_ids))

    rects = cursor.fetchall()

    # -----------------------------
    # 3. GROUP RECTS BY CARD
    # -----------------------------
    rect_map = {}
    for r in rects:
        cid = r["card_id"]
        if cid not in rect_map:
            rect_map[cid] = []
        rect_map[cid].append({
            "id": r["id"],
            "x": r["x"],
            "y": r["y"],
            "width": r["width"],
            "height": r["height"],
            "question": r["question"],
            "answer": r["answer"],
            "num": r["num"]
        })

    # -----------------------------
    # 4. BUILD FINAL RESPONSE
    # -----------------------------
    result = []
    for c in cards:
        result.append({
            "id": c["id"],
            "image": c["image_url"],
            "ratio": c["ratio"],
            "created": c["created_at"],
            "right": c["right_count"],
            "wrong": c["wrong_count"],
            "rects": rect_map.get(c["id"], [])
        })

    return result