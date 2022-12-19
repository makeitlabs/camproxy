import ConfigParser
import uuid
import json
import httplib2
import flask
from flask import Response
from apiclient.discovery import build
from oauth2client import client
import base64

Config = ConfigParser.ConfigParser()
Config.read('camproxy.ini')
ZoneMinderMonitorURLFormatFull = Config.get('Zoneminder', 'MonitorURLFormatFull')
ZoneMinderMonitorURLFormatHalf = Config.get('Zoneminder', 'MonitorURLFormatHalf')
NXMonitorURLFormatFull = Config.get('NXWitness', 'MonitorURLFormatFull')
NXMonitorURLFormatHalf = Config.get('NXWitness', 'MonitorURLFormatHalf')
NXUser = Config.get('NXWitness', 'User')
NXPassword = Config.get('NXWitness', 'Password')
RequiredDomain = Config.get('Authentication', 'RequiredDomain')
ClientSecretsFile = Config.get('Authentication', 'ClientSecretsFile')
FlaskHost = Config.get('Flask', 'Host')
FlaskPort = Config.getint('Flask', 'Port')
SSLCertFile = Config.get('Flask', 'SSLCertFile', 0, {'SSLCertFile': None})
SSLKeyFile = Config.get('Flask', 'SSLKeyFile', 0, {'SSLKeyFile': None})

DEBUG = Config.get('General', 'Debug')


#-------------------------------------------------

app = flask.Flask(__name__)

app.secret_key = str(uuid.uuid4())

@app.route('/', defaults={'cam': None, 'rando': 0, 'fullsize': False})
@app.route('/<cam>', defaults={'rando': 0, 'fullsize': False})
@app.route('/<cam>/<rando>', defaults={'fullsize': False})
@app.route('/full/<cam>', defaults={'rando': 0, 'fullsize': True})
@app.route('/full/<cam>/<rando>', defaults={'fullsize': True})
def index(cam, rando, fullsize):
  if 'credentials' not in flask.session:
    return flask.redirect(flask.url_for('oauth2callback'))
  credentials = client.OAuth2Credentials.from_json(flask.session['credentials'])
  if credentials.access_token_expired:
    return flask.redirect(flask.url_for('oauth2callback'))
  else:
    http_auth = credentials.authorize(httplib2.Http())
    service = build('people', 'v1', http=http_auth)

    if service:
      ppl = service.people()
      ppl_doc = ppl.get(resourceName='people/me',personFields='names,organizations,memberships,emailAddresses,photos').execute()

      #print ppl_doc
      
      if 'emailAddresses' in ppl_doc:
        #if ppl_doc['domain'] == RequiredDomain:
        if '@'+RequiredDomain in ppl_doc['emailAddresses'][0]['value']:
          if cam:
            if '-' in cam:
              if fullsize:
                URL = NXMonitorURLFormatFull % (cam)
              else:
                URL = NXMonitorURLFormatHalf % (cam)

              h = httplib2.Http()
              auth = base64.encodestring(NXUser + ':' + NXPassword);
              resp, content = h.request(URL, 'GET', headers = { 'Authorization' : 'Basic ' + auth })

              return Response(content, mimetype='image/jpeg')

            else:
              if fullsize:
                URL = ZoneMinderMonitorURLFormatFull % (cam)
              else:
                URL = ZoneMinderMonitorURLFormatHalf % (cam)

              resp, content = httplib2.Http().request(URL)
                
              return Response(content, mimetype='image/jpeg')

          else:
            return flask.render_template('cams.html', username=ppl_doc['names'][0]['displayName'], userimage=ppl_doc['photos'][0]['url'])
      else:
        return "Please use your %s account.  You will need to clear a cookie and reload this page to relogin (known bug)." % (RequiredDomain)
        
    else:
      return "Can't build service."

    return "You are not a %s member." % (RequiredDomain)


@app.route('/oauth2callback')
def oauth2callback():
  flow = client.flow_from_clientsecrets(
      ClientSecretsFile,
      scope='profile email',
      redirect_uri=flask.url_for('oauth2callback', _external=True))
  if 'code' not in flask.request.args:
    auth_uri = flow.step1_get_authorize_url()
    return flask.redirect(auth_uri)
  else:
    auth_code = flask.request.args.get('code')
    try:
      credentials = flow.step2_exchange(auth_code)
    except client.FlowExchangeError as exchange_error:
        return "An error has occurred: {0}".format(exchange_error)
      
    flask.session['credentials'] = credentials.to_json()
    return flask.redirect(flask.url_for('index'))

@app.route('/favicon.ico')
def favicon():
  return Response('', mimetype='image/bmp')

if __name__ == '__main__':
  app.debug = DEBUG

  if SSLCertFile == None or SSLKeyFile == None:
    app.run(port=FlaskPort, host=FlaskHost)
  else:
    app.run(port=FlaskPort, host=FlaskHost, ssl_context=(SSLCertFile, SSLKeyFile))
