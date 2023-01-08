# Camera Proxy NG - Flask Backend
Camera proxy backend with Google OAuth2 authentication.  It is intended to be run on a VM or container (e.g. LXC).

## Development 

### Installation for Development
```
python3 -m venv flaskenv
. flaskenv/bin/activate
pip install -r requirements.txt
```

### Running for Development
```
. flaskenv/bin/activate
python3 app.py
```

## Production

Make sure you have exited the development venv before starting a production installation.

### Install dependencies
- `sudo apt install git apache2 libapache2-mod-wsgi-py3 python3-flask python3-pip python3.10-venv`

### Clone git repo
- `git clone git@github.org:/makeitlabs/camproxy -b ng camproxy-ng`
- `sudo cp -R camproxy-ng /var/www`
- `sudo chown -R username:www-data /var/www/camproxy-ng` (replace username with your username)

### Python3 Virtual Environment

#### Create production virtual environment
- `python3 -m venv /var/www/camproxy-ng/.venv`

#### Activate venv for your shell
- `. /var/www/camproxy-ng/.venv/bin/activate`

#### Install Python dependencies into venv

*You must have activated the venv per above, otherwise these will not install in the correct place.*

```
cd /var/www/camproxy-ng/flask-backend
pip install -r requirements.txt
```

### Install Apache config

The install uses mod-wsgi and points to the python3 virtual environment you set up above.

- `sudo cp /var/www/camproxy-ng/apache2/camproxy-ng.conf /etc/apache2/sites-available`
- `sudo a2ensite camproxy-ng`

### Customize config

Copy `env-example` to `.env` and configure it as needed.  You will need credentials for the nxwitness server to pull images via the API.

### Set up Google OAuth 2.0 Client ID

Go here and set up a new OAuth2 client ID - https://console.cloud.google.com/apis/credentials

The client must have an Authorized Redirect URL, e.g.: `https://cameras.makeitlabs.com/oauth2callback`

Download and copy the client secret json file to `/var/www/camproxy/conf/client_secret.json` (look for "Download JSON" from the Google Cloud admin page for the client ID)


### Set up nginx Reverse Proxy

SSL is handled by an nginx proxy in production.  Set up a LetsEncrypt cert for the domain, e.g. `cameras.makeitlabs.com` and enable force SSL.  Forward https to the camproxy-ng instance port 443.

### Restart Apache
- `sudo apachectl restart`
