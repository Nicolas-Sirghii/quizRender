# BACKEND (FastAPI)

from fastapi import APIRouter, Header, HTTPException, Form
import jwt

from credentials.credentials import sql_conn, secret_key

updateCardStats = APIRouter()

SECRET_KEY = secret_key()


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@updateCardStats.put("/cards/update-stats")
async def update_card_stats(
    card_id: str = Form(...),
    result: str = Form(...),  # "right" or "wrong"
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
        # CHECK CARD EXISTS + OWNER
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
        # UPDATE RIGHT / WRONG
        # -------------------------
        if result == "right":
            cursor.execute("""
                UPDATE cards
                SET right_count = right_count + 1
                WHERE id = %s
            """, (card_id,))

        elif result == "wrong":
            cursor.execute("""
                UPDATE cards
                SET wrong_count = wrong_count + 1
                WHERE id = %s
            """, (card_id,))

        else:
            raise HTTPException(
                status_code=400,
                detail="Result must be 'right' or 'wrong'"
            )

        db.commit()

        return {
            "message": "Card stats updated successfully",
            "card_id": card_id,
            "updated_field": result
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()