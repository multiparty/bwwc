import sys

sys.path.append("../cryptography/utils")

from primality import is_prime_miller_rabin


def test_negative_numbers():
    assert not is_prime_miller_rabin(-1)
    assert not is_prime_miller_rabin(-10)
    assert not is_prime_miller_rabin(-100)


def test_small_primes():
    assert is_prime_miller_rabin(2)
    assert is_prime_miller_rabin(3)
    assert is_prime_miller_rabin(5)
    assert is_prime_miller_rabin(7)
    assert is_prime_miller_rabin(11)


def test_small_composites():
    assert not is_prime_miller_rabin(4)
    assert not is_prime_miller_rabin(6)
    assert not is_prime_miller_rabin(8)
    assert not is_prime_miller_rabin(9)
    assert not is_prime_miller_rabin(10)


def test_large_primes():
    assert is_prime_miller_rabin(15485867)  # 1 millionth prime
    assert is_prime_miller_rabin(982451653)  # 50 millionth prime
    assert is_prime_miller_rabin(32416190071)  # 1 billionth prime


def test_large_composites():
    assert not is_prime_miller_rabin(10**10)  # 10-digit composite
    assert not is_prime_miller_rabin(15485863 * 15485867)  # product of two primes
    assert not is_prime_miller_rabin(982451653 * 982451657)  # product of two primes
    assert not is_prime_miller_rabin(
        100000000000000000000000000000000000000000000000000000000000000000000003
    )  # 101-digit composite


def test_edge_cases():
    assert not is_prime_miller_rabin(0)
    assert not is_prime_miller_rabin(1)
    assert is_prime_miller_rabin(2**31 - 1)  # largest Mersenne prime
    assert not is_prime_miller_rabin(75361)  # Carmichael number less than 100,000
    assert not is_prime_miller_rabin(34830684315505)  # large Carmichael number
