import asyncio
from sqlalchemy import delete
from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

async def seed():
    async with AsyncSessionLocal() as db:
        print("Cleaning up existing users...")
        await db.execute(delete(User))
        await db.commit()

        print("Seeding users...")
        auth_service = AuthService(db)

        # Create admin user
        admin = User(
            email="admin@movies.com",
            username="admin",
            hashed_password=auth_service.hash_password("adminpass"),
            role=UserRole.admin,
            is_active=True
        )
        db.add(admin)

        # Create regular users
        alice = User(
            email="alice@example.com",
            username="alice",
            hashed_password=auth_service.hash_password("alicepass"),
            role=UserRole.user,
            is_active=True
        )
        db.add(alice)

        bob = User(
            email="bob@example.com",
            username="bob",
            hashed_password=auth_service.hash_password("bobpass"),
            role=UserRole.user,
            is_active=True
        )
        db.add(bob)

        await db.commit()
        print("Auth database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
