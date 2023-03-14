import sys
sys.path.append('../cryptography/mpc')

import pytest
from shamir import SecretShare


@pytest.fixture
def secret_share():
    return SecretShare(3, 15485867)


def test_sample_shamir_polynomial(secret_share):
    coefs = secret_share.sample_shamir_polynomial(10)
    assert len(coefs) == 3
    assert coefs[0] == 10


def test_evaluate_at_point(secret_share):
    coefs = [2, 3, 5]
    result = secret_share.evaluate_at_point(coefs, 4)
    assert result == 94


def test_interpolate_at_point(secret_share):
    points_values = [(1, 2), (3, 6), (5, 10)]
    result = secret_share.interpolate_at_point(points_values, 4)
    assert result == 8


def test_lagrange_constants_for_point(secret_share):
    points = [1, 3, 5]
    constants = secret_share.lagrange_constants_for_point(points, 4)
    assert constants == [5807200, 11614401, 13550134]


def test_shamir_share(secret_share):
    secret = 1234
    num_shares = 5
    shares = secret_share.shamir_share(secret, num_shares)
    assert len(shares) == num_shares


def test_shamir_reconstruct(secret_share):
    shares = [(1, 2), (3, 6), (5, 10)]
    secret = secret_share.shamir_reconstruct(shares)
    assert secret == 0