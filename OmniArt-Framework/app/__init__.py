from flask import Flask
from datetime import timedelta
from .config import app_config
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app(config_name):
	app = Flask(__name__, instance_relative_config=False)
	app.config.from_object(app_config[config_name])
	app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)

	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)

	socketio.init_app(app)

	return app