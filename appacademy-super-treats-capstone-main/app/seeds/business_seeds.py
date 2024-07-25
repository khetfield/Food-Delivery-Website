from app.models import db, Business, environment, SCHEMA
from app.models.business import types, price_ranges, cuisines
from sqlalchemy.sql import text
from .business_list import businesses
from .cuisines_list import cuisines
from random import randint


def seed_businesses():
    demo_business = Business(
        address="180 Geary St Fl 6\nSan Francisco, CA 94108",
        cuisine="Burgers",
        delivery_fee="0.99",
        image="/images/app-academy.png",
        name="App Academy",
        price_range=price_ranges["$$$$"],
        rating=4.8,
        type=types["Restaurant"],
        user_id=1,
    )
    db.session.add(demo_business)

    for i, b in enumerate(businesses):
        images = cuisines[b["cuisine"]]["images"]
        business = Business(
            address=b["address"],
            cuisine=b["cuisine"],
            delivery_fee=b["delivery_fee"],
            image=images[i % len(images)],
            name=b["name"],
            price_range=b["price_range"],
            rating=b["rating"],
            type=types["Restaurant"],
            user_id=randint(1, 15),
        )
        db.session.add(business)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_businesses():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.businesses RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM businesses"))

    db.session.commit()
