from flask import Blueprint, jsonify, session, request
from app.models import User, db
from app.forms import LoginForm, SignUpForm, SignupEmailForm, SignupPhoneForm
from ..utils.helpers import query_for_login_user, validation_errors_to_dict
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/")
def authenticate():
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {"errors": ["Unauthorized"]}


@auth_routes.route("/login", methods=["POST"])
def login():
    form = LoginForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")
    if form.validate_on_submit():
        user = query_for_login_user(form.data["credential"])
        login_user(user)
        return user.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@auth_routes.route("/logout")
def logout():
    logout_user()
    return {"message": "User logged out"}


@auth_routes.route("/signup", methods=["POST"])
def sign_up():
    form = SignUpForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")
    if form.validate_on_submit():
        user = User(
            email=form.data["email"],
            phone=form.data["phone"],
            password=form.data["password"],
            first_name=form.data["first_name"],
            last_name=form.data["last_name"],
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@auth_routes.route("/unauthorized")
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {"errors": ["Unauthorized"]}, 401


@auth_routes.route("/validate_email", methods=["POST"])
def validate_email():
    form = SignupEmailForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if form.validate_on_submit():
        return {"message": "email valid"}
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@auth_routes.route("/validate_phone", methods=["POST"])
def validate_phone():
    form = SignupPhoneForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if form.validate_on_submit():
        return {"message": "phone valid"}
    return {"errors": validation_errors_to_dict(form.errors)}, 400
