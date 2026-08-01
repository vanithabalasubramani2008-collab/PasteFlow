import sys
sys.path.insert(0, ".")
from app.database.session import SessionLocal
from sqlalchemy import text

def add_indexes():
    db = SessionLocal()
    try:
        # Create indexes (IF NOT EXISTS is supported in postgres 9.5+)
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_language ON pastes (language);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_visibility ON pastes (visibility);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_owner_id ON pastes (owner_id);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_tags ON pastes (tags);"))
        db.commit()
        print("Indexes added successfully.")
    except Exception as e:
        print(f"Error adding indexes: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_indexes()
