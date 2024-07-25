from flask.cli import AppGroup
from .user_seeds import seed_users, undo_users
from .business_seeds import seed_businesses, undo_businesses
from .category_seeds import seed_categories, undo_categories
from .item_seeds import seed_items, undo_items

from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup("seed")


@seed_commands.command("all")
def seed():
    if environment == "production":
        undo_items()
        undo_categories()
        undo_businesses()
        undo_users()
    print("SEEDING USERS")
    seed_users()
    print("FINISHED USERS")
    print("SEEDING BUSINESSES")
    seed_businesses()
    print("FINISHED BUSINESSES")
    print("SEEDING CATEGORIES")
    seed_categories()
    print("FINISHED CATEGORIES")
    print("SEEDING ITEMS")
    seed_items()
    print("FINISHED ITEMS")


@seed_commands.command("undo")
def undo():
    undo_items()
    undo_categories()
    undo_businesses()
    undo_users()
