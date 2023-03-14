import sys
sys.path.append('../cryptography/mpc')

class MPCEngine(object):
    def __init__(self, protocol='shamirs', prime=180252380737439):
        self.protocol = protocol
        self.prime = prime