from flask import Blueprint, request
from flask_login import login_required, current_user
from app.forms.create_cart_item_form import CreateCartItemForm
from app.forms.edit_cart_form import EditCartForm
from app.forms.edit_cart_item_form import EditCartItemForm
from ..utils.helpers import validation_errors_to_dict

from app.models import db, Cart, CartItem, Item

cart_routes = Blueprint("carts", __name__)


@cart_routes.route("/current")
@login_required
def user_carts():
    carts = Cart.query.filter(Cart.user_id == current_user.id).all()
    items = []
    for cart in carts:
        for cart_item in cart.cart_items:
            if cart_item.item:
                cart_item.item.cart_item_id = cart_item.id
                items.append(cart_item.item)

    return {
        "carts": {cart.business_id: cart.to_dict() for cart in carts},
        "items": {item.id: item.to_dict() for item in items},
    }


@cart_routes.route("/<int:cart_id>")
@login_required
def get_cart(cart_id):
    cart = Cart.query.get(cart_id)
    if not cart:
        return {"errors": "cart not found"}
    return {"cart": cart.to_dict()}


@cart_routes.route("/add_item", methods=["POST"])
@login_required
def add_item():
    form = CreateCartItemForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if not form.validate_on_submit():
        return {"errors": validation_errors_to_dict(form.errors)}, 400

    item = Item.query.get(form.data["item_id"])

    if not item:
        return {"errors": "item not found"}, 404

    cart = (
        Cart.query.filter(Cart.user_id == current_user.id)
        .filter(Cart.business_id == item.business.id)
        .one_or_none()
    )

    if not cart:
        cart = Cart(
            user_id=current_user.id,
            business_id=item.business.id,
            address=form.data["address"],
        )
        db.session.add(cart)
        db.session.commit()

    cart_item = (
        CartItem.query.join(Item)
        .filter(CartItem.cart_id == cart.id)
        .filter(Item.id == form.data["item_id"])
    ).one_or_none()

    if not cart_item:
        cart_item = CartItem(
            cart_id=cart.id,
            item_id=form.data["item_id"],
            quantity=form.data["quantity"],
        )

        db.session.add(cart_item)
    else:
        cart_item.quantity += form.data["quantity"]

    db.session.commit()

    return {"cart": cart.to_dict(), "cartItemId": cart_item.id}


@cart_routes.route("/<int:cart_id>/edit", methods=["PUT"])
def edit_cart(cart_id):
    form = EditCartForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if not form.validate_on_submit():
        return {"errors": validation_errors_to_dict(form.errors)}, 400

    cart = Cart.query.get(cart_id)

    if not cart:
        return {"errors": "cart not found"}, 404

    cart.address = form.data["address"]
    db.session.commit()

    return {"cart": cart.to_dict()}


@cart_routes.route("/<int:cart_id>/items/<int:item_id>/edit", methods=["PUT"])
@login_required
def edit_cart_item(cart_id, item_id):
    form = EditCartItemForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if not form.validate_on_submit():
        return {"errors": validation_errors_to_dict(form.errors)}, 400

    cart = Cart.query.get(cart_id)
    cart_item = CartItem.query.get(item_id)

    if not cart:
        return {"errors": "cart not found"}, 404

    if not cart.user_id == current_user.id:
        return {"errors": "not authorized"}, 401

    if not cart_item:
        return {"errors": "item not found"}, 404

    cart_item.quantity = form.data["quantity"]
    db.session.commit()

    return {"cartItem": cart_item.to_dict(), "cart": cart.to_dict_agg()}


@cart_routes.route("/<int:cart_id>/delete", methods=["DELETE"])
@login_required
def delete_cart(cart_id):
    cart = Cart.query.get(cart_id)

    if not cart:
        return {"errors": "cart not found"}, 404

    if not cart.user_id == current_user.id:
        return {"errors": "not authorized"}, 401

    db.session.delete(cart)
    db.session.commit()

    return {"message": "successfully deleted"}


@cart_routes.route("/<int:cart_id>/items/<int:item_id>/delete", methods=["DELETE"])
@login_required
def delete_cart_item(cart_id, item_id):
    cart = Cart.query.get(cart_id)
    cart_item = CartItem.query.get(item_id)

    if not cart:
        return {"errors": "cart not found"}, 404

    if not cart.user_id == current_user.id:
        return {"errors": "not authorized"}, 401

    if not cart_item:
        return {"errors": "item not found"}, 404

    db.session.delete(cart_item)
    db.session.commit()

    if not cart.cart_items:
        db.session.delete(cart)
        db.session.commit()
        return {"message": "successfully deleted"}

    return {"cart": cart.to_dict_agg()}
