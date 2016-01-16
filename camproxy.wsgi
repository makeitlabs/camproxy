import sys
import ConfigParser

Config = ConfigParser.ConfigParser()
Config.read('camproxy.ini')
InstallPath = Config.get('General', 'InstallPath')

sys.path.insert(0, InstallPath)
from camproxy import app as application

