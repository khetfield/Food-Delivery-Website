from flask import Blueprint, jsonify
from flask_login import current_user
from app.models import Business, Cart

business_routes = Blueprint("businesses", __name__)


@business_routes.route("/all")
def all_businesses():
    """
    Query for all the businesses in the database, no filters
    """
    businesses = Business.query.all()
    
    for b in businesses:
        d = b.to_dict()
        print(d["name"], d["image"])

    return {"businesses": {b.id: b.to_dict() for b in businesses}}


@business_routes.route("/<int:business_id>")
def one_business(business_id):
    business = Business.query.get(business_id)

    if not business:
        return {"errors": "business not found"}, 404

    if not current_user.is_authenticated:
        return {"business": business.to_dict(get_items=True)}

    cart = Cart.query.filter(
        Cart.business_id == business_id, Cart.user_id == current_user.id
    ).one_or_none()

    if cart:
        for item in business.items:
            for cart_item in cart.cart_items:
                if cart_item.item_id == item.id:
                    item.cart_item_id = cart_item.id
                    break

    return {"business": business.to_dict(get_items=True)}
