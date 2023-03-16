import random
from decimal import Decimal
from math import ceil
from typing import List, Tuple


class SecretShare(object):
    def __init__(self, threshold: int, prime: int = 180252380737439):
        self.prime: int = prime
        self.threshold: int = threshold

    def sample_shamir_polynomial(self, zero_value: int) -> List[int]:
        coefs = [zero_value] + [
            random.randrange(self.prime) for _ in range(self.threshold - 1)
        ]
        return coefs

    def evaluate_at_point(self, coefs: List[int], point: int) -> int:
        result = 0
        for coef in reversed(coefs):
            result = (coef + point * result) % self.prime
        return result

    def interpolate_at_point(
        self, points_values: List[Tuple[int, int]], point: int
    ) -> int:
        points, values = zip(*points_values)
        constants = self.lagrange_constants_for_point(points, point)
        return sum(ci * vi for ci, vi in zip(constants, values)) % self.prime

    def lagrange_constants_for_point(self, points: List[int], point: int) -> List[int]:
        constants = [0] * len(points)
        for i in range(len(points)):
            xi = points[i]
            num = 1
            denum = 1
            for j in range(len(points)):
                if j != i:
                    xj = points[j]
                    num = (num * (xj - point)) % self.prime
                    denum = (denum * (xj - xi)) % self.prime
            constants[i] = (num * pow(denum, -1, self.prime)) % self.prime
        return constants

    def shamir_share(self, secret: int, num_shares: int) -> List[Tuple[int, int]]:
        polynomial = self.sample_shamir_polynomial(secret)
        shares = [
            (i, self.evaluate_at_point(polynomial, i)) for i in range(1, num_shares + 1)
        ]
        return shares

    def shamir_reconstruct(self, shares: List[Tuple[int, int]]) -> int:
        polynomial = [(p, v) for p, v in shares]
        secret = self.interpolate_at_point(polynomial, 0)
        return secret

    def shamir_add(self, x, y):
        return [
            (i + 1, (xi[1] + yi[1]) % self.prime)
            for i, (xi, yi) in enumerate(list(zip(x, y)))
        ]
