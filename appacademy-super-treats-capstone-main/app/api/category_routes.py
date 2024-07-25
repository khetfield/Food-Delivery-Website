from flask import Blueprint, request
from flask_login import login_required, current_user
from app.forms.create_category_form import CreateCategoryForm
from app.forms.edit_category_form import EditCategoryForm
from ..utils.helpers import validation_errors_to_dict

from app.models import db, Category, Business, Item

category_routes = Blueprint("categories", __name__)


@category_routes.route("/new", methods=["POST"])
@login_required
def create_category():
    form = CreateCategoryForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if not form.validate_on_submit():
        return {"errors": validation_errors_to_dict(form.errors)}, 400

    business = Business.query.get(form.data["business_id"])

    if not business:
        return {"errors": "cart not found"}, 404

    if not business.user_id == current_user.id:
        return {"errors": "not authorized"}, 401

    category = (
        Category.query.filter(Category.name == form.data["name"])
        .filter(Category.business_id == form.data["business_id"])
        .one_or_none()
    )

    if category:
        return {"errors": {"name": "Name must be unique"}}, 400

    category = Category(
        name=form.data["name"],
        business_id=form.data["business_id"],
        order=len(business.categories),
    )
    db.session.add(category)
    db.session.commit()
    return {"category": category.to_dict()}


@category_routes.route("/<int:category_id>/edit", methods=["PUT"])
@login_required
def edit_category(category_id):
    form = EditCategoryForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if not form.validate_on_submit():
        return {"errors": validation_errors_to_dict(form.errors)}, 400

    category = Category.query.get(category_id)
    if not category:
        return {"errors": "Category not found"}, 404

    business = category.business
    if not business or not business.user_id == current_user.id:
        return {"errors": "Not authorized"}, 401

    category.name = form.data["name"]
    db.session.commit()

    return {"category": category.to_dict()}


@category_routes.route("/reorder", methods=["PUT"])
@login_required
def reorder_categories():
    data = request.json
    categories = data.get("categories")

    business = Business.query.get(data.get("business_id"))
    if not business or not business.user_id == current_user.id:
        return {"errors": "Not authorized"}, 401

    try:
        for c in business.categories:
            c.order = categories[str(c.id)]
    except:
        return {"errors": "invalid order for categories"}, 400

    db.session.commit()

    return {"categories": {c.id: c.to_dict() for c in business.categories}}


@category_routes.route("/<int:category_id>/delete", methods=["DELETE"])
@login_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return {"errors": "Category not found"}, 404

    business = category.business
    if not business or not business.user_id == current_user.id:
        return {"errors": "Not authorized"}, 401

    for c in business.categories:
        if c.order > category.order:
            c.order -= 1

    db.session.delete(category)
    db.session.commit()

    return {"message": "successfully deleted"}
