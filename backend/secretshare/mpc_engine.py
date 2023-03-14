import sys
sys.path.append('../cryptography')

import configparser

from utils.primality import is_prime_miller_rabin

class MPCEngine(object):
    def __init__(self, protocol:str = 'shamirs', prime:int = 180252380737439):
        parser = configparser.ConfigParser()
        parser.read('../config/dev.ini')
        
        self.protocol = protocol
        
        self.prime = prime
        config_prime = parser.getint('DEFAULT', 'PRIME')
        if config_prime and is_prime_miller_rabin(config_prime):
            self.prime = config_prime