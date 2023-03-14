import sys
sys.path.append('../cryptography')

import configparser

from cryptography.utils import primality

class MPCEngine(object):
    def __init__(self, protocol='shamirs'):
        parser = configparser.ConfigParser()
        parser.read('../config/config.ini')
        self.config = parser['DEFAULT']
        self.prime = self.config['prime'] if self.config['prime'] else 180252380737439
        self.protocol = protocol