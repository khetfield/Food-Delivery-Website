from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from ..utils.helpers import query_for_login_user


def user_exists(form, field):
    credential = field.data
    user = query_for_login_user(credential)
    if not user:
        raise ValidationError("Invalid Login")


def password_matches(form, field):
    password = field.data
    credential = form.data["credential"]
    user = query_for_login_user(credential)
    if not user:
        raise ValidationError("Invalid Login")
    if not user.check_password(password):
        raise ValidationError("Invalid Login")


class LoginForm(FlaskForm):
    credential = StringField("credential", validators=[DataRequired(), user_exists])
    password = StringField("password", validators=[DataRequired(), password_matches])
