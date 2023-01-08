# Camera Proxy NG - Flask Backend
Camera proxy backend with Google OAuth2 authentication.  It is intended to be run on a VM or container (e.g. LXC).

## Development 

Development uses self-hosted servers for the Flask backend and the React frontend.

### Installation for Backend
```
cd flask-backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

### Running Backend
```
cd flask-backend
. .venv/bin/activate
python3 app.py
```

### Installation for Frontend

```
sudo apt install npm
cd react-frontend
npm install
```

### Running Frontend

```
cd react-frontend
npm start
```

## Production

Make sure you have exited the development venv before starting a production installation.

### Install dependencies
- `sudo apt install git apache2 libapache2-mod-wsgi-py3 python3-flask python3-pip python3.10-venv`

### Clone git repo

You will need your github ssh keys configured before this will work.

- `git clone git@github.org:/makeitlabs/camproxy camproxy-ng`
- `sudo cp -R camproxy-ng /var/www`
- `sudo chown -R username:www-data /var/www/camproxy-ng` (replace username with your username)

### Python3 Virtual Environment

#### Create production virtual environment
- `python3 -m venv /var/www/camproxy-ng/flask-backend/.venv`

#### Activate venv for your shell
- `. /var/www/camproxy-ng/.venv/bin/activate`

#### Install Python dependencies into venv

*You must have activated the venv per above, otherwise these will not install in the correct place.*

```
cd /var/www/camproxy-ng/flask-backend
pip install -r requirements.txt
```

### Install Apache config

The backend uses mod-wsgi and points to the python3 virtual environment you set up above.

The frontend points to the built version of the React frontend.

```
sudo cp /var/www/camproxy-ng/apache2/camproxy-frontend.conf /etc/apache2/sites-available
sudo cp /var/www/camproxy-ng/apache2/camproxy-backend.conf /etc/apache2/sites-available`

[create/copy self-signed SSL certs to the /etc/ssl dir]

sudo a2ensite camproxy-frontend
sudo a2ensite camproxy-backend
sudo a2enmod ssl
```

### Customize config

Copy `env-example` to `.env` and configure it as needed.  You will need credentials for the nxwitness server to pull images via the API.

### Set up Google OAuth 2.0 Client ID

Go here and set up a new OAuth2 client ID - https://console.cloud.google.com/apis/credentials

The client must have an Authorized Redirect URL, e.g.: `https://cameras.makeitlabs.com/api/callback`

Download and copy the client secret json file to `/var/www/camproxy-ng/flask-backend/conf/client_secret.json` (look for "Download JSON" from the Google Cloud admin page for the client ID)


### Set up nginx Reverse Proxy

The application is provided publically via an nginx proxy in production.  Set up a LetsEncrypt cert for the domain, e.g. `cameras.makeitlabs.com` and enable force SSL.  

- Forward https for / to the camproxy frontend at port 443.
- Set up a Custom Location for `/api/` and point it to `production-host/` port 8443.  Note the slashes are important in the nginx config.
- Use the SSL cert you acquired for the domain earlier.

### Restart Apache

`sudo apachectl restart`

### Logs

Production logs appear in:

- Backend: `/var/log/apache2/camproxy-backend.log`
- Frontend: `/var/log/apache2/camproxy-frontend.log`
