import random
from decimal import Decimal
from math import ceil
from typing import List, Tuple


class SecretShare(object):
    """
    Initialize the SecretShare object with a threshold and an optional prime.

    inputs:
    threshold (int) - The minimum number of shares needed to reconstruct the secret.
    prime (int) - An optional prime number for the finite field arithmetic (default: 180252380737439).
    """

    def __init__(self, threshold: int, prime: int = 180252380737439):
        self.prime: int = prime
        self.threshold: int = threshold

    """
    Generate a Shamir polynomial with a given zero_value.

    inputs:
    zero_value (int) - The secret value to be shared.

    output:
    coefs (List[int]) - A list of coefficients representing the polynomial.
    """

    def sample_shamir_polynomial(self, zero_value: int) -> List[int]:
        coefs = [zero_value] + [
            random.randrange(self.prime) for _ in range(self.threshold - 1)
        ]
        return coefs

    """
    Evaluate the polynomial at a given point using the provided coefficients.
    
    inputs:
    coefs (List[int]) - A list of coefficients representing the polynomial.
    point (int) - The point at which to evaluate the polynomial.
    
    output:
    result (int) - The result of the polynomial evaluation at the specified point, modulo the prime.
    """

    def evaluate_at_point(self, coefs: List[int], point: int) -> int:
        result = 0
        for coef in reversed(coefs):
            result = (coef + point * result) % self.prime
        return result

    """
    Perform polynomial interpolation at a given point using Lagrange interpolation.

    inputs:
    points_values (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the known points.
    point (int) - The point at which to interpolate the polynomial.

    output:
    interpolated_value (int) - The result of the polynomial interpolation at the specified point, modulo the prime.
    """

    def interpolate_at_point(
        self, points_values: List[Tuple[int, int]], point: int
    ) -> int:
        points, values = zip(*points_values)
        constants = self.lagrange_constants_for_point(points, point)
        return sum(ci * vi for ci, vi in zip(constants, values)) % self.prime

    """
    Calculate Lagrange constants for the provided points and a target point.

    inputs:
    points (List[int]) - A list of x values for the known points.
    point (int) - The target point at which to calculate the Lagrange constants.
    
    output:
    constants (List[int]) - A list of Lagrange constants for the provided points and target point, modulo the prime.
    """

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

    """
    Split a secret into a list of shares.

    inputs:
    secret (int) - The secret to be shared.
    num_shares (int) - The number of shares to generate.

    output:
    shares (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the shares.
    """

    def shamir_share(self, secret: int, num_shares: int) -> List[Tuple[int, int]]:
        polynomial = self.sample_shamir_polynomial(secret)
        shares = [
            (i, self.evaluate_at_point(polynomial, i)) for i in range(1, num_shares + 1)
        ]
        return shares

    """
    Reconstruct the secret from a list of shares.

    inputs:
    shares (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the shares.

    output:
    secret (int) - The reconstructed secret.
    """

    def shamir_reconstruct(self, shares: List[Tuple[int, int]]) -> int:
        polynomial = [(p, v) for p, v in shares]
        secret = self.interpolate_at_point(polynomial, 0)
        return secret

    """
    Add two shares together.
    
    inputs:
    x (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the first share.
    y (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the second share.

    output:
    result (List[Tuple[int, int]]) - A list of tuples containing the x and y values of the sum of the two shares.
    """

    def shamir_add(
        self, x: List[Tuple[int, int]], y: List[Tuple[int, int]]
    ) -> List[Tuple[int, int]]:
        return [
            (i + 1, (xi[1] + yi[1]) % self.prime)
            for i, (xi, yi) in enumerate(list(zip(x, y)))
        ]
