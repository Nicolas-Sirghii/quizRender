from fastapi import APIRouter, Header, HTTPException, Form
import json
import jwt

from credentials.credentials import sql_conn, secret_key

updatePost = APIRouter()

SECRET_KEY = secret_key()


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@updatePost.put("/cards/update/{card_id}")
async def update_card(
    card_id: str,
    rects: str = Form(...),
    authorization: str = Header(None)
):
    # -------------------------
    # AUTH
    # -------------------------
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user_id = get_current_user(token)

    db = sql_conn()
    cursor = db.cursor()

    try:
        # -------------------------
        # CHECK CARD + OWNER
        # -------------------------
        cursor.execute("""
            SELECT user_id
            FROM cards
            WHERE id = %s
        """, (card_id,))

        card = cursor.fetchone()

        if not card:
            raise HTTPException(status_code=404, detail="Card not found")

        if str(card[0]) != str(user_id):
            raise HTTPException(status_code=403, detail="Not allowed")

        # -------------------------
        # DELETE OLD RECTS
        # -------------------------
        cursor.execute("""
            DELETE FROM card_rects
            WHERE card_id = %s
        """, (card_id,))

        # -------------------------
        # INSERT NEW RECTS
        # -------------------------
        rect_list = json.loads(rects)

        for r in rect_list:
            cursor.execute("""
                INSERT INTO card_rects
                (id, card_id, question, answer, x, y, width, height, num)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                r["id"],
                card_id,
                r["question"],
                r["answer"],
                r["x"],
                r["y"],
                r["width"],
                r["height"],
                r["num"]
            ))

        db.commit()

        return {
            "message": "Card updated successfully",
            "card_id": card_id
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()