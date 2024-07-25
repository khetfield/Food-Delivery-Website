from app.models import db, Item, Business, environment, SCHEMA
from sqlalchemy.sql import text
from random import randint, random
from .cuisines_list import cuisines


def seed_items():
    for business in Business.query.all():
        for category in business.categories:
            for name, image in cuisines[business.cuisine.name]["categories"][
                category.name
            ].items():
                item = Item(
                    name=name,
                    image=image,
                    price=float("{0:.2f}".format(random() * 45)),
                    business_id=business.id,
                    category_id=category.id,
                )
                db.session.add(item)

            for i in range(randint(2, 8)):
                item = Item(
                    name=f"Item {randint(10, 1000):04}",
                    price=float("{0:.2f}".format(random() * 30)),
                    business_id=business.id,
                    category_id=category.id,
                )
                db.session.add(item)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))

    db.session.commit()
