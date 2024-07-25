from app.models import db, Business, Category, environment, SCHEMA
from sqlalchemy.sql import text
from .cuisines_list import cuisines


def seed_categories():
    for business in Business.query.all():
        for i, c in enumerate(cuisines[business.cuisine.name]["categories"]):
            category = Category(order=i, name=c, business_id=business.id)
            db.session.add(category)

    db.session.commit()


def undo_categories():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM categories"))

    db.session.commit()
