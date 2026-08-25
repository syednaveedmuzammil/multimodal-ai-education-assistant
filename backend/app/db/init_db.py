from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models import User


def initialize_database() -> None:
    """
    Create all database tables defined by SQLAlchemy models.
    """

    Base.metadata.create_all(bind=engine)


def check_database_connection() -> bool:
    """
    Verify that the backend can connect to MySQL.
    """

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    except Exception:
        return False


if __name__ == "__main__":
    if not check_database_connection():
        raise RuntimeError(
            "Unable to connect to the MySQL database."
        )

    initialize_database()

    print("Database connection successful.")
    print("Database tables initialized successfully.")