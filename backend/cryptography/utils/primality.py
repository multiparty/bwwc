import random

'''
Miller-Rabin probabilistic primality test. This algorithm detects non-primes with 
probability 3/4 per round. In practice, t rounds is sufficient to reduce the 
probability of a false positive to < 2^-80 for any 1024-bit integer.

Time complexity: O(log^3 n)
Space complexity: O(1)

inputs:
n (int) - integer to test for primality
k (int) - number of rounds of testing to perform (default: 5)

output:
true if n is probabilistically prime, false otherwise
'''
def is_prime_miller_rabin(n: int, k: int = 5) -> bool:
    # Handle the base cases
    if n == 2 or n == 3:
        return True
    if n < 2 or n % 2 == 0:
        return False

    # Write n-1 as 2^r * d
    r, d = 0, n-1
    while d % 2 == 0:
        r += 1
        d //= 2

    # Perform k rounds of testing
    for _ in range(k):
        a = random.randrange(2, n-1)
        x = pow(a, d, n)
        if x == 1 or x == n-1:
            continue
        for _ in range(r-1):
            x = pow(x, 2, n)
            if x == n-1:
                break
        else:
            return False

    return True