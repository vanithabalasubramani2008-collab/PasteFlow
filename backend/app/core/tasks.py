import asyncio
import logging
from datetime import datetime
from app.database.session import SessionLocal
from app.models.paste import Paste

logger = logging.getLogger(__name__)

async def auto_delete_expired_pastes():
    while True:
        try:
            db = SessionLocal()
            now = datetime.utcnow()
            expired_pastes = db.query(Paste).filter(Paste.expires_at < now).all()
            if expired_pastes:
                for paste in expired_pastes:
                    db.delete(paste)
                db.commit()
                logger.info(f"Deleted {len(expired_pastes)} expired pastes.")
            db.close()
        except Exception as e:
            logger.error(f"Error in auto_delete_expired_pastes: {e}")
        
        # Run every hour
        await asyncio.sleep(3600)
