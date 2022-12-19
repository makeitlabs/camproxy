# camproxy
NxWitness camera proxy viewer with Google OAuth2 authentication.  It is intended to be run on a VM or container (e.g. LXC).

## Install dependencies
- `sudo apt install git apache2 libapache2-mod-wsgi-py3 python3-flask python3-pip python3.10-venv`

## Clone git repo
- `git clone git@github.org:/makeitlabs/camproxy`
- `cp -R camproxy /var/www`
- `chown -R username:www-data /var/www/camproxy` (replace username with your username)

## Python3 Virtual Environment

### Create virtual environment
- `python3 -m venv /var/www/camproxy/.venv`

### Activate venv for your shell
- `. /var/www/camproxy/.venv/bin/activate`

### Install Python dependencies into venv

You must have activated the venv per above, otherwise these will not install in the correct place.

- `pip3 install ConfigParser`
- `pip3 install httplib2`
- `pip3 install flask`
- `pip3 install google-api-python-client`
- `pip3 install oauth2client`

## Install Apache config

The install uses mod-wsgi and points to the python3 virtual environment you set up above.

- `sudo cp /var/www/camproxy/apache2/camproxy.conf /etc/apache2/sites-available`
- `sudo a2ensite camproxy`

## Customize config

Copy `config.ini.example` to `config.ini` and configure it as needed.  You will need credentials for the nxwitness server to pull images via the API.

## Set up Google OAuth 2.0 Client ID

Go here and set up a new OAuth2 client ID - https://console.cloud.google.com/apis/credentials

The client must have an Authorized Redirect URL, e.g.: `https://cameras.makeitlabs.com/oauth2callback`

Download and copy the client secret json file to `/var/www/camproxy/conf/client_secret.json` (look for "Download JSON" from the Google Cloud admin page for the client ID)


## Set up nginx Reverse Proxy

SSL is handled by an nginx proxy in production.  Set up a LetsEncrypt cert for the domain, e.g. `cameras.makeitlabs.com` and enable force SSL.  Forward http to the camproxy instance port 80.

## Restart Apache
- `sudo apachectl restart`

