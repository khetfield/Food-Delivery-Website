from flask import Blueprint, request
from flask_login import login_required, current_user
from ..utils.helpers import validation_errors_to_dict

from app.models import db, Item, Business, Category
from app.forms.create_item_form import CreateItemForm
from app.utils.aws import upload_file_to_s3, get_unique_filename

item_routes = Blueprint("items", __name__)


@item_routes.route("/<int:item_id>")
def get_one_item(item_id):
    item = Item.query.get(item_id)

    if item == None:
        return {"errors": "No item found"}, 404

    return {"item": item.to_dict(timestamps=True)}


@item_routes.route("/new", methods=["POST"])
@login_required
def new_item():
    form = CreateItemForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    business = Business.query.get(form.data.get("business_id"))
    if not business or not business.user_id == current_user.id:
        return {"errors": "Not authorized"}

    category_id = form.data.get("category_id")

    if category_id:
        if not Category.query.get(category_id):
            return {"errors": {"category": "invalid category"}}

    if form.validate_on_submit():
        item = Item(
            name=form.data["name"],
            about=form.data["about"],
            price=form.data["price"],
            business_id=form.data["business_id"],
            category_id=form.data.get("category_id"),
        )

        image = form.data.get("image")
        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)

            if "url" not in upload:
                return {"errors": upload}

            url = upload["url"]
            item.image = url

        db.session.add(item)
        db.session.commit()
        return {"item": item.to_dict(timestamps=True)}
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@item_routes.route("/<int:item_id>/edit", methods=["PUT"])
@login_required
def edit_item(item_id):
    form = CreateItemForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if form.validate_on_submit():
        item = Item.query.get(item_id)
        start_category = item.category

        if not item:
            return {"errors": "No item found"}, 404
        if not item.business.user_id == current_user.id:
            return {"errors": "Not Authorized"}, 401

        category_id = form.data.get("category_id")

        if category_id:
            if not Category.query.get(category_id):
                return {"errors": {"category": "invalid category"}}

        item.name = form.data["name"]
        item.about = form.data["about"]
        item.price = form.data["price"]
        item.category_id = category_id

        image = form.data.get("image")
        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)

            if "url" not in upload:
                return {"errors": upload}

            url = upload["url"]
            item.image = url

        db.session.commit()

        end_category = item.category
        res = {"item": item.to_dict(timestamps=True)}
        if not end_category == start_category:
            res["categories"] = {
                "start": start_category.to_dict() if start_category else None,
                "end": end_category.to_dict() if end_category else None,
            }

        return res

    return {"errors": validation_errors_to_dict(form.errors)}, 400


@item_routes.route("/<int:item_id>/delete", methods=["DELETE"])
@login_required
def delete_item(item_id):
    item = Item.query.get(item_id)

    if not item:
        return {"errors": "No item found"}, 404
    if not item.business.user_id == current_user.id:
        return {"errors": "Not Authorized"}, 401

    db.session.delete(item)
    db.session.commit()

    return {"message": "successfully deleted"}
