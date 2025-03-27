output "vpc_id" {
  value = aws_vpc.bwwc_vpc.id
}

output "private_subnet_ids" {
  value = aws_subnet.bwwc_private_subnet[*].id
}

output "public_subnet_ids" {
  value = aws_subnet.bwwc_public_subnet[*].id
}