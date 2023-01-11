from flask import Flask 
from flask.wrappers import Response
from functools import wraps
from flask.globals import request, session
import requests
from dotenv import load_dotenv
from werkzeug.exceptions import abort
from werkzeug.utils import redirect
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import os, pathlib
import google
import json
import jwt
import redis
from datetime import datetime
from flask_cors import CORS
from dwAPI import dwAPI


app = Flask(__name__)
load_dotenv()

dw = dwAPI()
r = redis.Redis(host=os.getenv("REDIS_SERVER"),
                port=os.getenv("REDIS_PORT"),
                db=os.getenv("REDIS_DB"),
                username=os.getenv("REDIS_USERNAME"),
                password=os.getenv("REDIS_PASSWORD"),
                decode_responses=True)

CORS(app)
app.config['Access-Control-Allow-Origin'] = '*'
app.config["Access-Control-Allow-Headers"]="Content-Type"

# bypass http
#os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
app.secret_key = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, os.getenv("GOOGLE_CLIENT_SECRET_FILE"))
algorithm = os.getenv("ALGORITHM")
BACKEND_URL=os.getenv("BACKEND_URL")
FRONTEND_URL=os.getenv("FRONTEND_URL")

MAX_SESSION_LENGTH=int(os.getenv("MAX_SESSION_SECONDS"))

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ],
    redirect_uri=BACKEND_URL+"/callback",
)

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            auth_header=request.headers.get("Authorization")
            if auth_header is not None and "Bearer " in auth_header:
                junk, encoded_jwt=auth_header.split("Bearer ")
                if encoded_jwt==None:
                    return abort(401)
                else:
                    sub = session["google_id"]
                    if sub is not None:
                        now = datetime.now().strftime('%s')
                        when = r.hget('session_time', sub)
                        if (when is not None):
                            age = int(now) - int(when)
                            
                            if age > MAX_SESSION_LENGTH:
                                return abort(429)

                            r.hset('session_last', sub, now)
                    
                    
                    return f()
            else:
                return abort(401)
        except:
            return abort(500)
    return wrapper

def Generate_JWT(payload):
    encoded_jwt = jwt.encode(payload, app.secret_key, algorithm=algorithm)
    return encoded_jwt

@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    request_session = requests.session()
    token_request = google.auth.transport.requests.Request(session=request_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token, request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    sub = id_info.get('sub')
    session['google_id'] = sub
    session['google_name'] = id_info.get('name')

    print(f"{sub} {id_info.get('name')}")
    now = int(datetime.now().strftime('%s'))

    r.hset('session_time', sub, now)
    r.hset('session_last', sub, now)
    r.hset('session_email', sub, id_info.get('email'))
    r.hset('session_name', sub, id_info.get('name'))
    r.hset('session_picture', sub, id_info.get('picture'))

    # removing the specific audience, as it is throwing error
    del id_info['aud']

    jwt_token=Generate_JWT(id_info)

    try:
        if os.getenv("REQUIRED_EMAIL_DOMAIN") not in id_info['email']:
            session.clear()
            return redirect(f"/login_error")
        
    except:
        session.clear()
        return redirect(f"/login_error")
    

    return redirect(f"{FRONTEND_URL}/?jwt={jwt_token}")


@app.route("/auth/google")
def login():
    authorization_url, state = flow.authorization_url()
    # Store the state so the callback can verify the auth server response.
    session["state"] = state
    return Response(
        response=json.dumps({'auth_url':authorization_url}),
        status=200,
        mimetype='application/json'
    )


@app.route("/logout")
def logout():
    #clear the local storage from frontend
    session.clear()
    return Response(
        response=json.dumps({"message":"Logged out"}),
        status=202,
        mimetype='application/json'
    )


@app.route("/home", endpoint='home')
@login_required
def home():
    encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
    try:
        decoded_jwt=jwt.decode(encoded_jwt, app.secret_key, algorithms=[algorithm,])
    except Exception as e: 
        return Response(
            response=json.dumps({"message":"Decoding JWT Failed", "exception":e.args}),
            status=500,
            mimetype='application/json'
        )
    return Response(
        response=json.dumps(decoded_jwt),
        status=200,
        mimetype='application/json'
    )

@app.route("/session_info",endpoint='session_info')
@login_required
def session_info():
    sub = session["google_id"]
    try:
        when = r.hget('session_time', sub)
        if (when is not None):
            now = int(datetime.now().strftime('%s'))
            remaining = MAX_SESSION_LENGTH - (now - int(when))
            
            info = {}
            info['max_time'] = MAX_SESSION_LENGTH
            info['remaining_time'] = remaining
            info['others'] = {}

            others = r.hkeys('session_time')
            for osub in others:
                oname = r.hget('session_name', osub)
                olast = r.hget('session_last', osub)
                opic = r.hget('session_picture', osub)

                if osub != sub and olast is not None:
                    age = now - int(olast)
                    if age < 600:
                        record = {}
                        record['session_age'] = age
                        record['session_last'] = olast
                        record['session_name'] = oname
                        if opic is not None:
                            record['session_picture'] = opic

                        info['others'][osub] = record

            return Response(
                response=json.dumps(info),
                status=200,
                mimetype='application/json'
            )
    except Exception as e:
        print(e)
        pass

    print(f"can't find info for {sub}")
    return Response(
        response=json.dumps({"message":"Error getting session info for sub " + sub}),
        status=500,
        mimetype='application/json'
    )   

@app.route("/thumbnail",endpoint='thumbnail')
@login_required
def thumbnail():
    camera_id = request.args['camera_id']
    height = request.args.get('height', None)
    width = request.args.get('width', None)
    dw.login()
    
    if height:
        imgdata = dw.get_thumbnail(camera_id, height=height)
    elif width:
        imgdata = dw.get_thumbnail(camera_id, width=width)
    
    return Response(
        response=imgdata,
        status=200,
        mimetype='image/png'
    )

@app.route("/devices", endpoint='device_list')
@login_required
def device_list():
    
    dw.login()
    dw.get_devices()
    devs = dw.devices()
    
    return Response(
        response=json.dumps(devs),
        status=200,
        mimetype='application/json'
    )



if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0", ssl_context=(os.getenv("FLASK_SSL_CERT"), os.getenv("FLASK_SSL_KEY")))
