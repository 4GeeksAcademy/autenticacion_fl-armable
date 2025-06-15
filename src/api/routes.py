"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user_created = User.add_user(email, password)
    if not user_created:
        return jsonify({"message": "Email already registered"}), 409

    return jsonify({"message": "User created successfully"}), 201

@api.route("/login", methods=["POST"])
def create_token():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user_valid = User.get_user(email, password)
    if not user_valid:
        return jsonify({"message": "Invalid email or password"}), 401
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, message="Login was successfully"), 200

@api.route("/private/demo", methods=["GET"])
@jwt_required()
def get_all_tasks():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"message": "User not authenticated"}), 401
    tasks = Task.get_all_tasks()
    if not tasks:
        return jsonify({"message": "No tasks found"}), 404
    return jsonify(tasks), 200

@api.route("/private/single/<int:id>", methods=["GET"])
@jwt_required()
def get_single_task(id):
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"message": "User not authenticated"}), 401
    task = Task.get_single_task(id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    return jsonify(task), 200