from app.models import User
from re import search, sub


def query_for_login_user(credential):
    is_email = search("@.*\..*", credential)
    user = None
    if is_email:
        user = User.query.filter(User.email == credential).first()
    else:
        phone = get_phone_from_input(credential)
        user = User.query.filter(User.phone == phone).first()
    return user


def get_phone_from_input(phone_str):
    return sub("\D", "", phone_str)


def validation_errors_to_dict(validation_errors):
    return {k: v for k in validation_errors for v in validation_errors[k]}
