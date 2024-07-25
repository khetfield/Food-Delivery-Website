from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Length, ValidationError
from app.models import User
from ..utils.helpers import get_phone_from_input


def email_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("Email address is already in use.")


def valid_phone(form, field):
    phone = get_phone_from_input(field.data)
    if not len(phone) == 10:
        raise ValidationError("Phone number is invalid")


def phone_exists(form, field):
    phone = get_phone_from_input(field.data)
    user = User.query.filter(User.phone == phone).first()
    if user:
        raise ValidationError("Phone number is already in use.")


class SignupEmailForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email(), email_exists])


class SignupPhoneForm(FlaskForm):
    phone = StringField("phone", validators=[DataRequired(), valid_phone, phone_exists])


class SignUpForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(), Email(), email_exists])
    phone = StringField("phone", validators=[DataRequired(), valid_phone, phone_exists])
    password = StringField("password", validators=[DataRequired(), Length(8, 40)])
    first_name = StringField("password", validators=[DataRequired(), Length(1, 255)])
    last_name = StringField("password", validators=[DataRequired(), Length(1, 255)])
